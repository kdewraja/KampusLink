import { SignJWT, jwtVerify, JWTPayload } from 'jose';
import bcrypt from 'bcryptjs';
import { db } from './database';
import { User, VerificationType, VerificationStatus } from '@prisma/client';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'kampuslink-super-secret-jwt-key-change-in-production');
const JWT_REFRESH_SECRET = new TextEncoder().encode(process.env.JWT_REFRESH_SECRET || 'kampuslink-refresh-secret-change-in-production');
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';
const SESSION_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000;

export interface TokenPayload extends JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

export class AuthService {
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async generateTokens(user: User): Promise<AuthTokens> {
    const payload: TokenPayload = { userId: user.id, email: user.email, role: user.role };

    const accessToken = await new SignJWT({ ...payload })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(ACCESS_TOKEN_EXPIRY)
      .sign(JWT_SECRET);

    const refreshToken = await new SignJWT({ ...payload })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(REFRESH_TOKEN_EXPIRY)
      .sign(JWT_REFRESH_SECRET);

    const expiresAt = new Date(Date.now() + SESSION_TOKEN_EXPIRY);
    await db.createSession(user.id, refreshToken, expiresAt);

    return { accessToken, refreshToken, expiresAt };
  }

  async verifyAccessToken(token: string): Promise<TokenPayload | null> {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      return payload as unknown as TokenPayload;
    } catch {
      return null;
    }
  }

  async verifyRefreshToken(token: string): Promise<TokenPayload | null> {
    try {
      const { payload } = await jwtVerify(token, JWT_REFRESH_SECRET);
      const session = await db.findSessionByToken(token);
      if (!session || session.expiresAt < new Date()) {
        return null;
      }
      return payload as unknown as TokenPayload;
    } catch {
      return null;
    }
  }

  async refreshTokens(refreshToken: string): Promise<AuthTokens | null> {
    const payload = await this.verifyRefreshToken(refreshToken);
    if (!payload) return null;

    const user = await db.findUserById(payload.userId);
    if (!user || !user.isActive) return null;

    await db.deleteSession(refreshToken);
    return this.generateTokens(user);
  }

  async revokeSession(refreshToken: string): Promise<void> {
    await db.deleteSession(refreshToken);
  }

  async revokeAllUserSessions(userId: string): Promise<void> {
    await db.deleteUserSessions(userId);
  }

  async register(data: { email: string; password: string; name: string; age: number; gender: string; campus: string; major: string; batch: string; hostel?: string; bio?: string; relationshipIntent: string }): Promise<{ user: User; tokens: AuthTokens; profile: any }> {
    const existingUser = await db.findUserByEmail(data.email);
    if (existingUser) {
      throw new Error('An account with this email already exists.');
    }

    if (data.age < 18) {
      throw new Error('Kampu$Link is for adult college students (18+) only.');
    }

    const passwordHash = await this.hashPassword(data.password);
    const user = await db.createUser({ email: data.email, passwordHash });

    const profile = await db.createProfile(user.id, {
      name: data.name,
      age: data.age,
      gender: data.gender as any,
      campus: data.campus,
      major: data.major,
      batch: data.batch,
      hostel: data.hostel || '',
      bio: data.bio || '',
      relationshipIntent: data.relationshipIntent as any,
      isVerified: data.email.endsWith('.edu') || data.email.endsWith('.ac.in'),
      trustScore: (data.email.endsWith('.edu') || data.email.endsWith('.ac.in')) ? 95 : 75,
      favoriteCampusSpot: '',
      twoAmCraving: '',
    });

    const tokens = await this.generateTokens(user);

    return { user, tokens, profile };
  }

  async login(email: string, password: string): Promise<{ user: User; tokens: AuthTokens; profile: any } | null> {
    const user = await db.findUserByEmail(email);
    if (!user) return null;

    const isValid = await this.verifyPassword(password, user.passwordHash);
    if (!isValid) return null;

    if (!user.isActive) {
      throw new Error('Account has been deactivated.');
    }

    const profile = await db.findProfileByUserId(user.id);
    const tokens = await this.generateTokens(user);

    await db.updateUser(user.id, { lastLoginAt: new Date() });

    return { user, tokens, profile };
  }

  async logout(refreshToken: string): Promise<void> {
    await this.revokeSession(refreshToken);
  }

  async requestStudentVerification(userId: string, collegeEmail: string): Promise<void> {
    const user = await db.findUserById(userId);
    if (!user) throw new Error('User not found');

    if (!collegeEmail.endsWith('.edu') && !collegeEmail.endsWith('.ac.in') && !collegeEmail.includes('campus')) {
      throw new Error('Please provide an accredited university domain email (.edu or .ac.in)');
    }

    await db.createVerification({ userId, type: 'INSTITUTIONAL', email: collegeEmail });
  }

  async verifyStudentEmail(userId: string, collegeEmail: string): Promise<void> {
    const verification = await db.findVerificationByEmail(collegeEmail);
    if (verification && verification.userId === userId) {
      await db.updateVerificationStatus(verification.id, 'VERIFIED');
      await db.updateProfile(userId, { isVerified: true, trustScore: 99 });
    }
  }

  async getCurrentUser(userId: string): Promise<{ user: User; profile: any } | null> {
    const user = await db.findUserById(userId);
    if (!user) return null;

    const profile = await db.findProfileWithDetails(userId);
    return { user, profile };
  }

  async updateProfile(userId: string, data: Partial<any>): Promise<any> {
    return db.updateProfile(userId, data);
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<boolean> {
    const user = await db.findUserById(userId);
    if (!user) return false;

    const isValid = await this.verifyPassword(currentPassword, user.passwordHash);
    if (!isValid) return false;

    const newHash = await this.hashPassword(newPassword);
    await db.updateUser(userId, { passwordHash: newHash });
    await this.revokeAllUserSessions(userId);

    return true;
  }

  async deleteAccount(userId: string): Promise<void> {
    await db.deleteAccount(userId);
  }
}

export const authService = new AuthService();
export default authService;