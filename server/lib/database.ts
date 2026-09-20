import { prisma } from './prisma';
import { Prisma, User, Profile, ProfilePhoto, PromptAnswer, Interest, ProfileInterest, Club, ProfileClub, CampusAnthem, FreeTonightStatus, Verification, Like, Match, Conversation, ConversationParticipant, Message, DatePlan, Block, Report, Notification, AIRequest, Role, Gender, RelationshipIntent, DateType, VerificationType, VerificationStatus, LikeAction, MessageType, DatePlanStatus, ReportReason, ReportStatus, NotificationType, AIRequestType, AIRequestStatus } from '@prisma/client';

export type {
  User, Profile, ProfilePhoto, PromptAnswer, Interest, ProfileInterest, Club, ProfileClub,
  CampusAnthem, FreeTonightStatus, Verification, Like, Match, Conversation, ConversationParticipant,
  Message, DatePlan, Block, Report, Notification, AIRequest,
  Role, Gender, RelationshipIntent, DateType, VerificationType, VerificationStatus,
  LikeAction, MessageType, DatePlanStatus, ReportReason, ReportStatus, NotificationType,
  AIRequestType, AIRequestStatus
};

export type UserWithProfile = User & { profile: Profile | null };
export type ProfileWithDetails = Profile & {
  photos: ProfilePhoto[];
  prompts: PromptAnswer[];
  interests: (ProfileInterest & { interest: Interest })[];
  clubs: (ProfileClub & { club: Club })[];
  campusAnthem: CampusAnthem | null;
  freeTonight: FreeTonightStatus | null;
};
export type ConversationWithDetails = Conversation & {
  participants: (ConversationParticipant & { user: UserWithProfile })[];
  messages: Message[];
  datePlans: DatePlan[];
};

class DatabaseService {
  async findUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  }

  async findUserById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async createUser(data: { email: string; passwordHash: string }): Promise<User> {
    return prisma.user.create({ data: { email: data.email.toLowerCase(), passwordHash: data.passwordHash } });
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    return prisma.user.update({ where: { id }, data });
  }

  async deleteUser(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }

  async createProfile(userId: string, data: Omit<Profile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Profile> {
    return prisma.profile.create({ data: { ...data, userId } });
  }

  async findProfileByUserId(userId: string): Promise<Profile | null> {
    return prisma.profile.findUnique({ where: { userId } });
  }

  async findProfileById(id: string): Promise<Profile | null> {
    return prisma.profile.findUnique({ where: { id } });
  }

  async findProfileWithDetails(userId: string): Promise<ProfileWithDetails | null> {
    return prisma.profile.findUnique({
      where: { userId },
      include: {
        photos: { orderBy: { order: 'asc' } },
        prompts: { orderBy: { order: 'asc' } },
        interests: { include: { interest: true } },
        clubs: { include: { club: true } },
        campusAnthem: true,
        freeTonight: true,
      }
    });
  }

  async updateProfile(userId: string, data: Partial<Profile> & { freeTonight?: any }): Promise<Profile | null> {
    const { freeTonight, ...profileData } = data;
    await prisma.profile.update({ where: { userId }, data: profileData });
    if (freeTonight) {
      await prisma.freeTonightStatus.upsert({
        where: { profileId: userId },
        create: { profileId: userId, ...freeTonight },
        update: freeTonight,
      });
    }
    return this.findProfileByUserId(userId);
  }

  async deleteProfile(userId: string): Promise<void> {
    await prisma.profile.delete({ where: { userId } });
  }

  async createSession(userId: string, token: string, expiresAt: Date, userAgent?: string, ipAddress?: string) {
    return prisma.session.create({ data: { userId, token, expiresAt, userAgent, ipAddress } });
  }

  async findSessionByToken(token: string) {
    return prisma.session.findUnique({ where: { token }, include: { user: { include: { profile: true } } } });
  }

  async deleteSession(token: string): Promise<void> {
    await prisma.session.delete({ where: { token } });
  }

  async deleteUserSessions(userId: string): Promise<void> {
    await prisma.session.deleteMany({ where: { userId } });
  }

  async cleanupExpiredSessions(): Promise<number> {
    const result = await prisma.session.deleteMany({ where: { expiresAt: { lt: new Date() } } });
    return result.count;
  }

  async createVerification(data: { userId: string; type: VerificationType; email: string }): Promise<Verification> {
    return prisma.verification.create({ data });
  }

  async findVerificationByEmail(email: string): Promise<Verification | null> {
    return prisma.verification.findFirst({ where: { email: email.toLowerCase() }, orderBy: { createdAt: 'desc' } });
  }

  async updateVerificationStatus(id: string, status: VerificationStatus): Promise<Verification> {
    return prisma.verification.update({ where: { id }, data: { status, verifiedAt: status === 'VERIFIED' ? new Date() : null } });
  }

  async createLike(data: { likerId: string; likeeId: string; action: LikeAction; comment?: string; targetPromptId?: string; targetPhotoUrl?: string }): Promise<Like> {
    return prisma.like.create({ data });
  }

  async findLike(likerId: string, likeeId: string): Promise<Like | null> {
    return prisma.like.findUnique({ where: { likerId_likeeId: { likerId, likeeId } } });
  }

  async findLikesByUser(userId: string, action?: LikeAction): Promise<Like[]> {
    return prisma.like.findMany({ where: { likerId: userId, ...(action ? { action } : {}) }, orderBy: { createdAt: 'desc' } });
  }

  async findLikesReceived(userId: string, action?: LikeAction): Promise<Like[]> {
    return prisma.like.findMany({ where: { likeeId: userId, ...(action ? { action } : {}) }, orderBy: { createdAt: 'desc' } });
  }

  async createMatch(userId: string, matchedUserId: string, compatibilityScore: number): Promise<Match> {
    return prisma.$transaction(async (tx) => {
      const match = await tx.match.create({ data: { userId, matchedUserId, compatibilityScore } });
      await tx.match.create({ data: { userId: matchedUserId, matchedUserId: userId, compatibilityScore } });
      return match;
    });
  }

  async findMatches(userId: string): Promise<Match[]> {
    return prisma.match.findMany({ where: { userId }, include: { matchedUser: { include: { profile: true } } } });
  }

  async findMatch(userId: string, matchedUserId: string): Promise<Match | null> {
    return prisma.match.findUnique({ where: { userId_matchedUserId: { userId, matchedUserId } } });
  }

  async createConversation(participants: string[], compatibilityScore?: number): Promise<Conversation> {
    return prisma.conversation.create({
      data: {
        compatibilityScore,
        participants: { create: participants.map(userId => ({ userId })) }
      },
      include: { participants: { include: { user: { include: { profile: true } } } } }
    });
  }

  async findConversationById(id: string): Promise<ConversationWithDetails | null> {
    return prisma.conversation.findUnique({
      where: { id },
      include: { participants: { include: { user: { include: { profile: true } } } }, messages: { orderBy: { createdAt: 'asc' } }, datePlans: true }
    });
  }

  async findConversationsByUser(userId: string): Promise<ConversationWithDetails[]> {
    return prisma.conversation.findMany({
      where: { participants: { some: { userId } } },
      include: { participants: { include: { user: { include: { profile: true } } } }, messages: { orderBy: { createdAt: 'desc' }, take: 1 }, datePlans: true },
      orderBy: { updatedAt: 'desc' }
    });
  }

  async findConversationBetweenUsers(userId1: string, userId2: string): Promise<Conversation | null> {
    const conversations = await prisma.conversation.findMany({
      where: {
        participants: { every: { userId: { in: [userId1, userId2] } } }
      },
      include: { participants: { include: { user: { include: { profile: true } } } } }
    });
    return conversations.find(c => c.participants.length === 2) || null;
  }

  async addMessage(conversationId: string, senderId: string, text: string, type: MessageType = 'TEXT', promptComment?: any, datePlanId?: string) {
    return prisma.$transaction(async (tx) => {
      const message = await tx.message.create({
        data: { conversationId, senderId, text, type, promptComment, datePlanId },
        include: { sender: { include: { profile: true } } }
      });
      await tx.conversation.update({ where: { id: conversationId }, data: { lastMessage: text, lastMessageAt: new Date(), updatedAt: new Date() } });
      await tx.conversationParticipant.updateMany({ where: { conversationId, userId: { not: senderId } }, data: { hasUnread: true } });
      return message;
    });
  }

  async markMessagesRead(conversationId: string, userId: string): Promise<void> {
    await prisma.$transaction(async (tx) => {
      await tx.message.updateMany({ where: { conversationId, senderId: { not: userId }, isRead: false }, data: { isRead: true, readAt: new Date() } });
      await tx.conversationParticipant.update({ where: { conversationId_userId: { conversationId, userId } }, data: { hasUnread: false, lastReadAt: new Date() } });
    });
  }

  async createDatePlan(data: { initiatorId: string; recipientId: string; venueName: string; venueType: string; dateTime: Date; notes?: string }): Promise<DatePlan> {
    return prisma.datePlan.create({ data: { ...data, dateTime: new Date(data.dateTime) } });
  }

  async findDatePlanById(id: string): Promise<DatePlan | null> {
    return prisma.datePlan.findUnique({ where: { id }, include: { initiator: { include: { profile: true } }, recipient: { include: { profile: true } } } });
  }

  async findDatePlansByUser(userId: string): Promise<DatePlan[]> {
    return prisma.datePlan.findMany({
      where: { OR: [{ initiatorId: userId }, { recipientId: userId }] },
      include: { initiator: { include: { profile: true } }, recipient: { include: { profile: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }

  async updateDatePlanStatus(id: string, userId: string, status: DatePlanStatus): Promise<DatePlan | null> {
    const datePlan = await prisma.datePlan.findUnique({ where: { id } });
    if (!datePlan) return null;
    if (datePlan.initiatorId !== userId && datePlan.recipientId !== userId) return null;

    return prisma.datePlan.update({ where: { id }, data: { status, updatedAt: new Date() } });
  }

  async createBlock(blockerId: string, blockedId: string, reason?: string): Promise<Block> {
    return prisma.$transaction(async (tx) => {
      const block = await tx.block.create({ data: { blockerId, blockedId, reason } });
      await tx.like.deleteMany({ where: { OR: [{ likerId: blockerId, likeeId: blockedId }, { likerId: blockedId, likeeId: blockerId }] } });
      await tx.match.deleteMany({ where: { OR: [{ userId: blockerId, matchedUserId: blockedId }, { userId: blockedId, matchedUserId: blockerId }] } });
      const conversations = await tx.conversation.findMany({ where: { participants: { every: { userId: { in: [blockerId, blockedId] } } } } });
      for (const conv of conversations) {
        await tx.conversation.delete({ where: { id: conv.id } });
      }
      return block;
    });
  }

  async isBlocked(userId: string, targetId: string): Promise<boolean> {
    const block = await prisma.block.findUnique({ where: { blockerId_blockedId: { blockerId: userId, blockedId: targetId } } });
    return !!block;
  }

  async createReport(data: { reporterId: string; reportedId: string; reason: ReportReason; details?: string }): Promise<Report> {
    return prisma.report.create({ data });
  }

  async findReportsByStatus(status: ReportStatus): Promise<Report[]> {
    return prisma.report.findMany({ where: { status }, include: { reporter: { include: { profile: true } }, reported: { include: { profile: true } } }, orderBy: { createdAt: 'desc' } });
  }

  async updateReportStatus(id: string, status: ReportStatus, reviewedBy: string): Promise<Report> {
    return prisma.report.update({ where: { id }, data: { status, reviewedAt: new Date(), reviewedBy } });
  }

  async createNotification(data: { userId: string; type: NotificationType; title: string; body: string; data?: any }): Promise<Notification> {
    return prisma.notification.create({ data });
  }

  async findNotificationsByUser(userId: string, unreadOnly = false): Promise<Notification[]> {
    return prisma.notification.findMany({ where: { userId, ...(unreadOnly ? { isRead: false } : {}) }, orderBy: { createdAt: 'desc' }, take: 50 });
  }

  async markNotificationsRead(userId: string): Promise<void> {
    await prisma.notification.updateMany({ where: { userId, isRead: false }, data: { isRead: true, readAt: new Date() } });
  }

  async createAIRequest(data: { userId: string; type: AIRequestType; input: string; output?: string; tokensUsed?: number }): Promise<AIRequest> {
    return (prisma as any).aIRequest.create({ data });
  }

  async getDiscoveryFeed(currentUserId: string, filters?: {
    campus?: string;
    major?: string;
    batch?: string;
    gender?: Gender;
    intent?: RelationshipIntent;
    verifiedOnly?: boolean;
    limit?: number;
    cursor?: string;
  }): Promise<ProfileWithDetails[]> {
    const likedIds = await prisma.like.findMany({ where: { likerId: currentUserId }, select: { likeeId: true } });
    const blockedIds = await prisma.block.findMany({ where: { blockerId: currentUserId }, select: { blockedId: true } });
    const blockedByIds = await prisma.block.findMany({ where: { blockedId: currentUserId }, select: { blockerId: true } });
    const excludeIds = new Set([...likedIds.map(l => l.likeeId), ...blockedIds.map(b => b.blockedId), ...blockedByIds.map(b => b.blockerId), currentUserId]);

    return prisma.profile.findMany({
      where: {
        userId: { notIn: Array.from(excludeIds) },
        ...(filters?.campus && { campus: filters.campus }),
        ...(filters?.major && { major: { contains: filters.major, mode: 'insensitive' } }),
        ...(filters?.batch && { batch: { contains: filters.batch } }),
        ...(filters?.gender && { gender: filters.gender }),
        ...(filters?.intent && { relationshipIntent: filters.intent }),
        ...(filters?.verifiedOnly && { isVerified: true }),
      },
      include: {
        photos: { orderBy: { order: 'asc' } },
        prompts: { orderBy: { order: 'asc' } },
        interests: { include: { interest: true } },
        clubs: { include: { club: true } },
        campusAnthem: true,
        freeTonight: true,
      },
      take: filters?.limit || 20,
      ...(filters?.cursor && { cursor: { userId: filters.cursor }, skip: 1 }),
      orderBy: { updatedAt: 'desc' }
    });
  }

  async getFreeTonightProfiles(currentUserId: string, area?: string, dateType?: DateType): Promise<ProfileWithDetails[]> {
    return prisma.profile.findMany({
      where: {
        userId: { not: currentUserId },
        freeTonight: {
          isActive: true,
          ...(area && { area }),
          ...(dateType && { dateType }),
        }
      },
      include: {
        photos: { orderBy: { order: 'asc' } },
        prompts: { orderBy: { order: 'asc' } },
        interests: { include: { interest: true } },
        clubs: { include: { club: true } },
        campusAnthem: true,
        freeTonight: true,
      },
      orderBy: { updatedAt: 'desc' }
    });
  }

  async getUserStats(userId: string): Promise<{ likesReceived: number; matches: number; conversations: number; datePlans: number }> {
    const [likesReceived, matches, conversations, datePlans] = await Promise.all([
      prisma.like.count({ where: { likeeId: userId, action: 'LIKE' } }),
      prisma.match.count({ where: { userId } }),
      prisma.conversation.count({ where: { participants: { some: { userId } } } }),
      prisma.datePlan.count({ where: { OR: [{ initiatorId: userId }, { recipientId: userId }] } }),
    ]);
    return { likesReceived, matches, conversations, datePlans };
  }

  async logAIRequest(userId: string, type: AIRequestType, input: string, output: string, tokensUsed?: number): Promise<AIRequest> {
    return (prisma as any).aIRequest.create({ data: { userId, type, input, output, tokensUsed } });
  }

  async deleteAccount(userId: string): Promise<void> {
    await prisma.$transaction(async (tx) => {
      await tx.messageReaction.deleteMany({ where: { message: { senderId: userId } } });
      await tx.message.deleteMany({ where: { senderId: userId } });
      await tx.message.deleteMany({ where: { conversation: { participants: { some: { userId } } } } });
      await tx.conversationParticipant.deleteMany({ where: { userId } });
      await tx.conversation.deleteMany({ where: { participants: { every: { userId } } } });
      await tx.datePlan.deleteMany({ where: { OR: [{ initiatorId: userId }, { recipientId: userId }] } });
      await tx.match.deleteMany({ where: { OR: [{ userId }, { matchedUserId: userId }] } });
      await tx.like.deleteMany({ where: { OR: [{ likerId: userId }, { likeeId: userId }] } });
      await tx.block.deleteMany({ where: { OR: [{ blockerId: userId }, { blockedId: userId }] } });
      await tx.report.deleteMany({ where: { OR: [{ reporterId: userId }, { reportedId: userId }] } });
      await tx.notification.deleteMany({ where: { userId } });
      await (tx as any).aIRequest.deleteMany({ where: { userId } });
      await tx.session.deleteMany({ where: { userId } });
      await tx.verification.deleteMany({ where: { userId } });
      await tx.profilePhoto.deleteMany({ where: { profile: { userId } } });
      await tx.promptAnswer.deleteMany({ where: { profile: { userId } } });
      await tx.profileInterest.deleteMany({ where: { profile: { userId } } });
      await tx.profileClub.deleteMany({ where: { profile: { userId } } });
      await tx.campusAnthem.deleteMany({ where: { profile: { userId } } });
      await tx.freeTonightStatus.deleteMany({ where: { profile: { userId } } });
      await tx.profile.deleteMany({ where: { userId } });
      await tx.user.delete({ where: { id: userId } });
    });
  }
}

export const db = new DatabaseService();
export default db;