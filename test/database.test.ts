import { describe, it, expect, vi, beforeEach } from 'vitest';
import { db } from '../server/lib/database';

vi.mock('../server/lib/prisma', () => {
  const mockPrisma = {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    session: {
      create: vi.fn(),
      findUnique: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
    },
    profile: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    like: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      deleteMany: vi.fn(),
    },
    match: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      deleteMany: vi.fn(),
    },
    conversation: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
    },
    conversationParticipant: {
      create: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
      deleteMany: vi.fn(),
    },
    message: {
      create: vi.fn(),
      findMany: vi.fn(),
      updateMany: vi.fn(),
      deleteMany: vi.fn(),
    },
    datePlan: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      deleteMany: vi.fn(),
    },
    block: {
      create: vi.fn(),
      findUnique: vi.fn(),
      deleteMany: vi.fn(),
    },
    report: {
      create: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      deleteMany: vi.fn(),
    },
    notification: {
      create: vi.fn(),
      findMany: vi.fn(),
      updateMany: vi.fn(),
      deleteMany: vi.fn(),
    },
    aiRequest: {
      create: vi.fn(),
    },
    verification: {
      create: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
    },
    $transaction: vi.fn(async (callback: any) => {
      const mockTx = {
        messageReaction: { deleteMany: vi.fn() },
        message: { deleteMany: vi.fn() },
        conversationParticipant: { deleteMany: vi.fn() },
        conversation: { deleteMany: vi.fn() },
        datePlan: { deleteMany: vi.fn() },
        match: { deleteMany: vi.fn() },
        like: { deleteMany: vi.fn() },
        block: { deleteMany: vi.fn() },
        report: { deleteMany: vi.fn() },
        notification: { deleteMany: vi.fn() },
        aiRequest: { deleteMany: vi.fn() },
        session: { deleteMany: vi.fn() },
        verification: { deleteMany: vi.fn() },
        profilePhoto: { deleteMany: vi.fn() },
        promptAnswer: { deleteMany: vi.fn() },
        profileInterest: { deleteMany: vi.fn() },
        profileClub: { deleteMany: vi.fn() },
        campusAnthem: { deleteMany: vi.fn() },
        freeTonightStatus: { deleteMany: vi.fn() },
        profile: { deleteMany: vi.fn() },
        user: { delete: vi.fn() },
      };
      return callback(mockTx);
    }),
  };
  return { prisma: mockPrisma };
});

describe('DatabaseService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('findUserByEmail', () => {
    it('should call prisma with correct email', async () => {
      const { prisma } = await import('../server/lib/prisma');
      prisma.user.findUnique.mockResolvedValue({ id: '1', email: 'test@test.com' });

      const result = await db.findUserByEmail('test@test.com');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'test@test.com' } });
      expect(result).toEqual({ id: '1', email: 'test@test.com' });
    });
  });

  describe('createUser', () => {
    it('should hash email to lowercase', async () => {
      const { prisma } = await import('../server/lib/prisma');
      prisma.user.create.mockResolvedValue({ id: '1', email: 'test@test.com' });

      await db.createUser({ email: 'TEST@TEST.COM', passwordHash: 'hash' });

      expect(prisma.user.create).toHaveBeenCalledWith({ data: { email: 'test@test.com', passwordHash: 'hash' } });
    });
  });

  describe('createSession', () => {
    it('should create session with correct data', async () => {
      const { prisma } = await import('../server/lib/prisma');
      prisma.session.create.mockResolvedValue({ id: 'session-1' });

      const expiresAt = new Date('2024-12-31');
      await db.createSession('user-1', 'token-123', expiresAt, 'Mozilla', '127.0.0.1');

      expect(prisma.session.create).toHaveBeenCalledWith({
        data: { userId: 'user-1', token: 'token-123', expiresAt, userAgent: 'Mozilla', ipAddress: '127.0.0.1' },
      });
    });
  });

  describe('deleteAccount', () => {
    it('should call transaction with all delete operations', async () => {
      const { prisma } = await import('../server/lib/prisma');
      prisma.$transaction.mockResolvedValue(undefined);

      await db.deleteAccount('user-1');

      expect(prisma.$transaction).toHaveBeenCalled();
    });
  });
});