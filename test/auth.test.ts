import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from '../server/lib/auth';
import { db } from '../server/lib/database';

vi.mock('../server/lib/database', () => ({
  db: {
    findUserByEmail: vi.fn(),
    createUser: vi.fn(),
    createProfile: vi.fn(),
    findProfileByUserId: vi.fn(),
    createSession: vi.fn(),
    deleteUserSessions: vi.fn(),
    findUserById: vi.fn(),
    updateUser: vi.fn(),
    updateProfile: vi.fn(),
    deleteAccount: vi.fn(),
    findSessionByToken: vi.fn(),
    deleteSession: vi.fn(),
  },
}));

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('register', () => {
    it('should throw error if email already exists', async () => {
      db.findUserByEmail.mockResolvedValue({ id: '1', email: 'test@test.com' });

      await expect(authService.register({
        email: 'test@test.com',
        password: 'password123',
        name: 'Test User',
        age: 20,
        gender: 'female',
        campus: 'IIT Delhi',
        major: 'CS',
        batch: "Class of '26",
        relationshipIntent: 'Dating & Romance',
      })).rejects.toThrow('An account with this email already exists.');
    });

    it('should throw error if age < 18', async () => {
      db.findUserByEmail.mockResolvedValue(null);

      await expect(authService.register({
        email: 'new@test.com',
        password: 'password123',
        name: 'Test User',
        age: 17,
        gender: 'female',
        campus: 'IIT Delhi',
        major: 'CS',
        batch: "Class of '26",
        relationshipIntent: 'Dating & Romance',
      })).rejects.toThrow('Kampu$Link is for adult college students (18+) only.');
    });

    it('should create user and profile on valid input', async () => {
      db.findUserByEmail.mockResolvedValue(null);
      db.createUser.mockResolvedValue({ id: 'user-1', email: 'new@test.com', passwordHash: 'hash', role: 'USER' });
      db.createProfile.mockResolvedValue({ id: 'profile-1', userId: 'user-1', name: 'Test User' });
      db.findProfileByUserId.mockResolvedValue({ id: 'profile-1', name: 'Test User' });
      db.createSession.mockResolvedValue({});

      const result = await authService.register({
        email: 'new@test.com',
        password: 'password123',
        name: 'Test User',
        age: 20,
        gender: 'female',
        campus: 'IIT Delhi',
        major: 'CS',
        batch: "Class of '26",
        relationshipIntent: 'Dating & Romance',
      });

      expect(result.user).toBeDefined();
      expect(result.tokens).toBeDefined();
      expect(result.profile).toBeDefined();
    });
  });

  describe('login', () => {
    it('should return null for non-existent user', async () => {
      db.findUserByEmail.mockResolvedValue(null);

      const result = await authService.login('nonexistent@test.com', 'password123');
      expect(result).toBeNull();
    });

    it('should return null for invalid password', async () => {
      db.findUserByEmail.mockResolvedValue({ id: '1', email: 'test@test.com', passwordHash: 'hashedpassword', isActive: true });
      vi.spyOn(authService, 'verifyPassword').mockResolvedValue(false);

      const result = await authService.login('test@test.com', 'wrongpassword');
      expect(result).toBeNull();
    });

    it('should throw error for deactivated account', async () => {
      db.findUserByEmail.mockResolvedValue({ id: '1', email: 'test@test.com', passwordHash: 'hashedpassword', isActive: false });
      vi.spyOn(authService, 'verifyPassword').mockResolvedValue(true);

      await expect(authService.login('test@test.com', 'password123')).rejects.toThrow('Account has been deactivated.');
    });
  });

  describe('changePassword', () => {
    it('should return false for non-existent user', async () => {
      db.findUserById.mockResolvedValue(null);

      const result = await authService.changePassword('nonexistent', 'oldpass', 'newpass');
      expect(result).toBe(false);
    });

    it('should return false for incorrect current password', async () => {
      db.findUserById.mockResolvedValue({ id: '1', passwordHash: 'hashedpassword' });
      vi.spyOn(authService, 'verifyPassword').mockResolvedValue(false);

      const result = await authService.changePassword('1', 'wrongpass', 'newpass');
      expect(result).toBe(false);
    });
  });
});