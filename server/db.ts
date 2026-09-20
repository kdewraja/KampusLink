import {
  UserProfile,
  Conversation,
  ChatMessage,
  DatePlan,
  FreeTonightStatus,
  INITIAL_PROFILES,
  INITIAL_CONVERSATIONS,
  INITIAL_DATE_PLANS,
} from './data/seedData.ts';

interface SwipeRecord {
  userId: string;
  targetUserId: string;
  action: 'like' | 'pass' | 'super';
  comment?: string;
  targetPrompt?: string;
  targetPhoto?: string;
  timestamp: string;
}

interface UserAccount {
  id: string;
  email: string;
  password: string; // Stored securely
  profileId: string;
  sessionToken?: string;
  createdAt: string;
}

interface UserReport {
  id: string;
  reporterId: string;
  targetUserId: string;
  reason: string;
  details: string;
  timestamp: string;
}

class KampusLinkDatabase {
  private accounts: UserAccount[] = [];
  private profiles: UserProfile[] = [];
  private conversations: Conversation[] = [];
  private datePlans: DatePlan[] = [];
  private swipes: SwipeRecord[] = [];
  private reports: UserReport[] = [];
  private blockedUserIds: Map<string, Set<string>> = new Map();

  constructor() {
    this.reset();
  }

  public reset() {
    this.profiles = JSON.parse(JSON.stringify(INITIAL_PROFILES));
    this.conversations = JSON.parse(JSON.stringify(INITIAL_CONVERSATIONS));
    this.datePlans = JSON.parse(JSON.stringify(INITIAL_DATE_PLANS));
    this.reports = [];
    this.blockedUserIds = new Map();

    // Default student user accounts
    this.accounts = [
      {
        id: 'acc-1',
        email: 'aarav.sharma@iitd.ac.in',
        password: 'password123',
        profileId: 'u1',
        sessionToken: 'token_u1_session',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'acc-2',
        email: 'rhea.sengupta@iitd.ac.in',
        password: 'password123',
        profileId: 'u2',
        sessionToken: 'token_u2_session',
        createdAt: new Date().toISOString(),
      },
    ];

    // Seed mutual likes between Aarav (u1) and Rhea (u2), and Ananya (u4)
    this.swipes = [
      { userId: 'u2', targetUserId: 'u1', action: 'like', timestamp: new Date(Date.now() - 86400000).toISOString() },
      { userId: 'u1', targetUserId: 'u2', action: 'like', timestamp: new Date(Date.now() - 86400000).toISOString() },
      { userId: 'u4', targetUserId: 'u1', action: 'like', timestamp: new Date(Date.now() - 43200000).toISOString() },
      { userId: 'u1', targetUserId: 'u4', action: 'like', timestamp: new Date(Date.now() - 43200000).toISOString() },
      // Inbound likes waiting to match
      { userId: 'u6', targetUserId: 'u1', action: 'like', timestamp: new Date().toISOString() },
      { userId: 'u7', targetUserId: 'u1', action: 'super', timestamp: new Date().toISOString() },
    ];
  }

  // ==================== AUTHENTICATION & SESSIONS ====================

  public authenticate(email: string, password: string): { account: UserAccount; profile: UserProfile; token: string } | null {
    const account = this.accounts.find((a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password);
    if (!account) return null;

    const token = `tok_${account.id}_${Date.now()}`;
    account.sessionToken = token;

    const profile = this.profiles.find((p) => p.id === account.profileId) || this.profiles[0];
    return { account, profile, token };
  }

  public register(
    email: string,
    password: string,
    profileData: Partial<UserProfile>
  ): { account: UserAccount; profile: UserProfile; token: string } {
    const existing = this.accounts.find((a) => a.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    const newUserId = `u_${Date.now()}`;
    const newProfile: UserProfile = {
      id: newUserId,
      name: profileData.name || 'Campus Student',
      age: profileData.age || 20,
      gender: profileData.gender || 'female',
      campus: profileData.campus || 'IIT Delhi',
      major: profileData.major || 'Undeclared',
      batch: profileData.batch || "Class of '27",
      hostel: profileData.hostel || 'Main Campus Residence',
      isVerified: email.endsWith('.edu') || email.endsWith('.ac.in'),
      trustScore: email.endsWith('.edu') || email.endsWith('.ac.in') ? 95 : 75,
      bio: profileData.bio || '',
      relationshipIntent: profileData.relationshipIntent || 'Dating & Romance',
      photos: profileData.photos && profileData.photos.length > 0
        ? profileData.photos
        : ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'],
      interests: profileData.interests || ['Campus Walks', 'Coffee', 'Music'],
      clubs: profileData.clubs || ['Student Association'],
      prompts: profileData.prompts && profileData.prompts.length > 0
        ? profileData.prompts
        : [{ question: 'My ideal campus date is...', answer: 'Coffee and exploring campus study spots.' }],
      campusAnthem: profileData.campusAnthem || { title: 'Sunflower', artist: 'Post Malone', vibe: 'Warm campus sunshine' },
      favoriteCampusSpot: profileData.favoriteCampusSpot || 'Central Library Cafe',
      twoAmCraving: profileData.twoAmCraving || 'Cold iced brew',
    };

    this.profiles.push(newProfile);

    const token = `tok_${newUserId}_${Date.now()}`;
    const account: UserAccount = {
      id: `acc_${newUserId}`,
      email,
      password,
      profileId: newUserId,
      sessionToken: token,
      createdAt: new Date().toISOString(),
    };
    this.accounts.push(account);

    return { account, profile: newProfile, token };
  }

  public getSessionUser(token?: string): UserProfile | null {
    if (!token) {
      // Default to Aarav (u1) for seamless local dev & immediate evaluation
      return this.profiles.find((p) => p.id === 'u1') || null;
    }
    const account = this.accounts.find((a) => a.sessionToken === token);
    if (!account) {
      return this.profiles.find((p) => p.id === 'u1') || null;
    }
    return this.profiles.find((p) => p.id === account.profileId) || null;
  }

  // ==================== DISCOVERY & PROFILES ====================

  public getProfiles(
    currentUserId: string,
    filters?: {
      campus?: string;
      major?: string;
      batch?: string;
      gender?: string;
      intent?: string;
      verifiedOnly?: boolean;
    }
  ): (UserProfile & { compatibilityScore: number; hasIncomingLike: boolean })[] {
    const currentUser = this.profiles.find((p) => p.id === currentUserId) || this.profiles[0];

    const swipedIds = new Set(
      this.swipes.filter((s) => s.userId === currentUserId).map((s) => s.targetUserId)
    );

    const blockedSet = this.blockedUserIds.get(currentUserId) || new Set();

    return this.profiles
      .filter((profile) => {
        if (profile.id === currentUserId) return false;
        if (swipedIds.has(profile.id)) return false;
        if (blockedSet.has(profile.id)) return false;

        if (filters?.campus && filters.campus !== 'all' && profile.campus !== filters.campus) return false;
        if (filters?.major && filters.major !== 'all' && !profile.major.toLowerCase().includes(filters.major.toLowerCase())) return false;
        if (filters?.batch && filters.batch !== 'all' && !profile.batch.includes(filters.batch)) return false;
        if (filters?.gender && filters.gender !== 'all' && profile.gender !== filters.gender) return false;
        if (filters?.intent && filters.intent !== 'all' && profile.relationshipIntent !== filters.intent) return false;
        if (filters?.verifiedOnly && !profile.isVerified) return false;

        return true;
      })
      .map((profile) => {
        let score = 75;
        if (profile.campus === currentUser.campus) score += 10;
        const sharedInterests = profile.interests.filter((i) => currentUser.interests.includes(i));
        score += sharedInterests.length * 4;
        const sharedClubs = profile.clubs.filter((c) => currentUser.clubs.some((cc) => cc.includes(c) || c.includes(cc)));
        score += sharedClubs.length * 5;
        if (profile.relationshipIntent === currentUser.relationshipIntent) score += 5;
        score = Math.min(score, 99);

        const hasIncomingLike = this.swipes.some(
          (s) => s.userId === profile.id && s.targetUserId === currentUserId && (s.action === 'like' || s.action === 'super')
        );

        return {
          ...profile,
          compatibilityScore: score,
          hasIncomingLike,
        };
      });
  }

  public getProfileById(id: string): UserProfile | undefined {
    return this.profiles.find((p) => p.id === id);
  }

  public updateProfile(id: string, updates: Partial<UserProfile>): UserProfile | null {
    const idx = this.profiles.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    this.profiles[idx] = { ...this.profiles[idx], ...updates };
    return this.profiles[idx];
  }

  // ==================== HINGE-STYLE + TINDER SWIPING ====================

  public recordSwipe(
    userId: string,
    targetUserId: string,
    action: 'like' | 'pass' | 'super',
    options?: {
      comment?: string;
      targetPrompt?: string;
      targetPromptAnswer?: string;
      targetPhoto?: string;
    }
  ): {
    isMatch: boolean;
    matchedProfile?: UserProfile;
    conversationId?: string;
    compatibilityScore?: number;
    initialMessageSent?: boolean;
  } {
    this.swipes.push({
      userId,
      targetUserId,
      action,
      comment: options?.comment,
      targetPrompt: options?.targetPrompt,
      targetPhoto: options?.targetPhoto,
      timestamp: new Date().toISOString(),
    });

    if (action === 'pass') {
      return { isMatch: false };
    }

    // Check if target user has already liked current user
    const targetLike = this.swipes.find(
      (s) => s.userId === targetUserId && s.targetUserId === userId && (s.action === 'like' || s.action === 'super')
    );

    let conv = this.conversations.find(
      (c) =>
        (c.participants[0] === userId && c.participants[1] === targetUserId) ||
        (c.participants[0] === targetUserId && c.participants[1] === userId)
    );

    // If there's an attached prompt/photo comment from user, create conversation immediately or attach message
    if (options?.comment && !conv) {
      conv = {
        id: `conv-${Date.now()}`,
        participants: [userId, targetUserId],
        compatibilityScore: 92,
        lastMessage: options.comment,
        lastMessageTimestamp: 'Just now',
        unread: true,
        messages: [
          {
            id: `m-${Date.now()}`,
            senderId: userId,
            text: options.comment,
            timestamp: 'Just now',
            isRead: false,
            type: 'prompt_comment',
            promptCommentData: {
              promptQuestion: options.targetPrompt,
              promptAnswer: options.targetPromptAnswer,
              photoUrl: options.targetPhoto,
              comment: options.comment,
            },
          },
        ],
      };
      this.conversations.unshift(conv);
    }

    if (targetLike) {
      const targetProfile = this.profiles.find((p) => p.id === targetUserId);
      const compScore = Math.floor(Math.random() * 10) + 89;

      if (!conv) {
        conv = {
          id: `conv-${Date.now()}`,
          participants: [userId, targetUserId],
          compatibilityScore: compScore,
          lastMessage: action === 'super' ? '⭐ Super-liked your profile!' : 'You matched! Start a conversation or plan a date.',
          lastMessageTimestamp: 'Just now',
          unread: false,
          messages: [
            {
              id: `m-${Date.now()}`,
              senderId: userId,
              text: action === 'super' ? '⭐ Sent a Super-Like on Kampu$Link' : '🎉 You matched! Say hi.',
              timestamp: 'Just now',
              isRead: true,
            },
          ],
        };
        this.conversations.unshift(conv);
      }

      return {
        isMatch: true,
        matchedProfile: targetProfile,
        conversationId: conv.id,
        compatibilityScore: compScore,
        initialMessageSent: Boolean(options?.comment),
      };
    }

    return {
      isMatch: false,
      initialMessageSent: Boolean(options?.comment),
    };
  }

  public rewindSwipe(userId: string): { success: boolean; rewoundProfile?: UserProfile } {
    const userSwipes = this.swipes.filter((s) => s.userId === userId);
    if (userSwipes.length === 0) return { success: false };

    const lastSwipe = userSwipes[userSwipes.length - 1];
    const idx = this.swipes.indexOf(lastSwipe);
    if (idx !== -1) {
      this.swipes.splice(idx, 1);
    }
    const profile = this.profiles.find((p) => p.id === lastSwipe.targetUserId);
    return { success: true, rewoundProfile: profile };
  }

  // ==================== "FREE TONIGHT" DATE AVAILABILITY ====================

  public getFreeTonightProfiles(currentUserId: string, area?: string, dateType?: string): UserProfile[] {
    return this.profiles.filter((p) => {
      if (p.id === currentUserId) return false;
      if (!p.freeTonight?.isActive) return false;
      if (area && area !== 'all' && p.freeTonight.area !== area) return false;
      if (dateType && dateType !== 'all' && p.freeTonight.dateType !== dateType) return false;
      return true;
    });
  }

  public toggleFreeTonight(userId: string, statusData: Partial<FreeTonightStatus>): UserProfile | null {
    const profile = this.profiles.find((p) => p.id === userId);
    if (!profile) return null;

    profile.freeTonight = {
      isActive: statusData.isActive ?? !profile.freeTonight?.isActive,
      timeWindow: statusData.timeWindow || profile.freeTonight?.timeWindow || 'Tonight 8:00 PM - 10:30 PM',
      dateType: statusData.dateType || profile.freeTonight?.dateType || 'Cafe & Coffee',
      area: statusData.area || profile.freeTonight?.area || 'Central Campus Library',
      note: statusData.note !== undefined ? statusData.note : profile.freeTonight?.note,
    };

    return profile;
  }

  // ==================== CAFE DATE PLANNING LIFECYCLE ====================

  public createDatePlan(
    initiatorId: string,
    recipientId: string,
    venueName: string,
    venueType: string,
    dateTime: string,
    notes?: string
  ): { datePlan: DatePlan; conversation?: Conversation } {
    const newPlan: DatePlan = {
      id: `dp-${Date.now()}`,
      initiatorId,
      recipientId,
      venueName,
      venueType,
      dateTime,
      notes,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.datePlans.unshift(newPlan);

    // Attach to conversation if exists
    let conv = this.conversations.find(
      (c) =>
        (c.participants[0] === initiatorId && c.participants[1] === recipientId) ||
        (c.participants[0] === recipientId && c.participants[1] === initiatorId)
    );

    if (conv) {
      if (!conv.datePlans) conv.datePlans = [];
      conv.datePlans.unshift(newPlan);

      const planMsg: ChatMessage = {
        id: `m-${Date.now()}`,
        senderId: initiatorId,
        text: `Campus Date Proposal: ${venueName} on ${dateTime}`,
        timestamp: 'Just now',
        isRead: false,
        type: 'date_proposal',
        datePlanId: newPlan.id,
      };
      conv.messages.push(planMsg);
      conv.lastMessage = `Date Proposal: ${venueName}`;
      conv.lastMessageTimestamp = 'Just now';
      conv.unread = true;
    }

    return { datePlan: newPlan, conversation: conv };
  }

  public updateDatePlanStatus(
    datePlanId: string,
    userId: string,
    newStatus: 'suggested' | 'pending' | 'accepted' | 'confirmed' | 'completed' | 'cancelled'
  ): DatePlan | null {
    const plan = this.datePlans.find((p) => p.id === datePlanId);
    if (!plan) return null;

    plan.status = newStatus;
    plan.updatedAt = new Date().toISOString();

    // Notify conversation
    const otherId = plan.initiatorId === userId ? plan.recipientId : plan.initiatorId;
    const conv = this.conversations.find(
      (c) =>
        (c.participants.includes(userId) && c.participants.includes(otherId))
    );

    if (conv) {
      const actor = this.profiles.find((p) => p.id === userId);
      let statusText = '';
      if (newStatus === 'accepted') statusText = `🎉 ${actor?.name || 'Partner'} accepted the date at ${plan.venueName}!`;
      else if (newStatus === 'confirmed') statusText = `✅ Date at ${plan.venueName} is confirmed for ${plan.dateTime}!`;
      else if (newStatus === 'cancelled') statusText = `Date at ${plan.venueName} was cancelled.`;

      if (statusText) {
        conv.messages.push({
          id: `m-${Date.now()}`,
          senderId: userId,
          text: statusText,
          timestamp: 'Just now',
          isRead: false,
          type: 'text',
        });
        conv.lastMessage = statusText;
        conv.lastMessageTimestamp = 'Just now';
      }
    }

    return plan;
  }

  public getDatePlans(userId: string): (DatePlan & { otherUser?: UserProfile })[] {
    return this.datePlans
      .filter((p) => p.initiatorId === userId || p.recipientId === userId)
      .map((p) => {
        const otherId = p.initiatorId === userId ? p.recipientId : p.initiatorId;
        const otherUser = this.profiles.find((u) => u.id === otherId);
        return {
          ...p,
          otherUser,
        };
      });
  }

  // ==================== MESSAGING & MATCHES ====================

  public getMatches(userId: string) {
    const userLikes = this.swipes.filter((s) => s.userId === userId && (s.action === 'like' || s.action === 'super'));
    const matchedProfiles: {
      profile: UserProfile;
      conversation?: Conversation;
      matchedAt: string;
      compatibilityScore: number;
    }[] = [];

    userLikes.forEach((like) => {
      const mutual = this.swipes.find(
        (s) => s.userId === like.targetUserId && s.targetUserId === userId && (s.action === 'like' || s.action === 'super')
      );
      if (mutual) {
        const profile = this.profiles.find((p) => p.id === like.targetUserId);
        if (profile) {
          const conv = this.conversations.find(
            (c) =>
              (c.participants[0] === userId && c.participants[1] === profile.id) ||
              (c.participants[0] === profile.id && c.participants[1] === userId)
          );
          matchedProfiles.push({
            profile,
            conversation: conv,
            matchedAt: like.timestamp,
            compatibilityScore: conv?.compatibilityScore || 94,
          });
        }
      }
    });

    return matchedProfiles;
  }

  public getConversations(userId: string) {
    return this.conversations
      .filter((c) => c.participants.includes(userId))
      .map((conv) => {
        const otherUserId = conv.participants.find((id) => id !== userId)!;
        const otherProfile = this.profiles.find((p) => p.id === otherUserId);
        const relatedPlans = this.datePlans.filter(
          (dp) => conv.participants.includes(dp.initiatorId) && conv.participants.includes(dp.recipientId)
        );
        return {
          ...conv,
          otherUser: otherProfile,
          datePlans: relatedPlans,
        };
      });
  }

  public getConversationById(convId: string, userId: string) {
    const conv = this.conversations.find((c) => c.id === convId);
    if (!conv || !conv.participants.includes(userId)) return null;

    const otherUserId = conv.participants.find((id) => id !== userId)!;
    const otherProfile = this.profiles.find((p) => p.id === otherUserId);
    const relatedPlans = this.datePlans.filter(
      (dp) => conv.participants.includes(dp.initiatorId) && conv.participants.includes(dp.recipientId)
    );

    return {
      ...conv,
      otherUser: otherProfile,
      datePlans: relatedPlans,
    };
  }

  public sendMessage(
    convId: string,
    senderId: string,
    text: string,
    type: 'text' | 'date_proposal' | 'prompt_comment' = 'text',
    datePlanId?: string
  ) {
    const conv = this.conversations.find((c) => c.id === convId);
    if (!conv) return null;

    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      senderId,
      text,
      timestamp: 'Just now',
      isRead: false,
      type,
      datePlanId,
    };

    conv.messages.push(newMsg);
    conv.lastMessage = text;
    conv.lastMessageTimestamp = 'Just now';
    conv.unread = true;

    return { message: newMsg, conversation: conv };
  }

  public unmatch(userId: string, targetUserId: string) {
    // Remove swipes
    this.swipes = this.swipes.filter(
      (s) =>
        !(
          (s.userId === userId && s.targetUserId === targetUserId) ||
          (s.userId === targetUserId && s.targetUserId === userId)
        )
    );
    // Remove conversations
    this.conversations = this.conversations.filter(
      (c) => !(c.participants.includes(userId) && c.participants.includes(targetUserId))
    );

    return { success: true, message: 'Unmatched successfully.' };
  }

  public blockUser(userId: string, targetUserId: string) {
    if (!this.blockedUserIds.has(userId)) {
      this.blockedUserIds.set(userId, new Set());
    }
    this.blockedUserIds.get(userId)!.add(targetUserId);

    this.unmatch(userId, targetUserId);

    return { success: true, message: 'User blocked.' };
  }

  public reportUser(reporterId: string, targetUserId: string, reason: string, details: string) {
    const report: UserReport = {
      id: `rep-${Date.now()}`,
      reporterId,
      targetUserId,
      reason,
      details,
      timestamp: new Date().toISOString(),
    };
    this.reports.push(report);

    this.blockUser(reporterId, targetUserId);

    return {
      success: true,
      message: 'Report submitted. User has been blocked and removed from your feed.',
    };
  }
}

export const db = new KampusLinkDatabase();
