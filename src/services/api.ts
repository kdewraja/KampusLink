import {
  UserProfile,
  Conversation,
  MatchItem,
  FilterState,
  DatePlan,
  FreeTonightStatus,
  GrammarResult,
  ToneResult,
  ToneType,
} from '../types';

const API_BASE = '/api';

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('kampuslink_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  // ==================== AUTHENTICATION ====================
  async login(email: string, password: string): Promise<{ success: boolean; user?: UserProfile; token?: string; error?: string }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },

  async register(
    data: { email: string; password: string } & Partial<UserProfile>
  ): Promise<{ success: boolean; user?: UserProfile; token?: string; error?: string }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async getSession(): Promise<{ success: boolean; user: UserProfile }> {
    const res = await fetch(`${API_BASE}/auth/session`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async verifyStudent(collegeEmail: string): Promise<{ success: boolean; user: UserProfile; message: string; error?: string }> {
    const res = await fetch(`${API_BASE}/auth/verify-student`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ collegeEmail }),
    });
    return res.json();
  },

  // ==================== AI GRAMMAR & TONE CHECKER ====================
  async checkGrammar(text: string): Promise<{ success: boolean; result: GrammarResult; error?: string }> {
    const res = await fetch(`${API_BASE}/ai/tone-check`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ text, mode: 'grammar' }),
    });
    return res.json();
  },

  async adjustTone(text: string, tone: ToneType): Promise<{ success: boolean; result: ToneResult; error?: string }> {
    const res = await fetch(`${API_BASE}/ai/tone-check`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ text, mode: 'tone', tone }),
    });
    return res.json();
  },

  // ==================== PROFILES & DISCOVERY ====================
  async getProfiles(filters?: Partial<FilterState>): Promise<{ success: boolean; profiles: UserProfile[] }> {
    const params = new URLSearchParams();
    if (filters) {
      if (filters.campus && filters.campus !== 'all') params.append('campus', filters.campus);
      if (filters.major && filters.major !== 'all') params.append('major', filters.major);
      if (filters.batch && filters.batch !== 'all') params.append('batch', filters.batch);
      if (filters.gender && filters.gender !== 'all') params.append('gender', filters.gender);
      if (filters.intent && filters.intent !== 'all') params.append('intent', filters.intent);
      if (filters.verifiedOnly) params.append('verifiedOnly', 'true');
    }

    const res = await fetch(`${API_BASE}/profiles?${params.toString()}`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async getProfile(id: string): Promise<{ success: boolean; profile: UserProfile }> {
    const res = await fetch(`${API_BASE}/profiles/${id}`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async updateMyProfile(updates: Partial<UserProfile>): Promise<{ success: boolean; user: UserProfile }> {
    const res = await fetch(`${API_BASE}/profiles/me`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    return res.json();
  },

  // ==================== SWIPES & HINGE-STYLE LIKES ====================
  async swipe(
    targetUserId: string,
    action: 'like' | 'pass' | 'super',
    options?: {
      comment?: string;
      targetPrompt?: string;
      targetPromptAnswer?: string;
      targetPhoto?: string;
    }
  ): Promise<{
    success: boolean;
    isMatch: boolean;
    matchedProfile?: UserProfile;
    conversationId?: string;
    compatibilityScore?: number;
    initialMessageSent?: boolean;
  }> {
    const res = await fetch(`${API_BASE}/swipes`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ targetUserId, action, ...options }),
    });
    return res.json();
  },

  async rewindSwipe(): Promise<{ success: boolean; rewoundProfile?: UserProfile }> {
    const res = await fetch(`${API_BASE}/swipes/rewind`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  // ==================== "FREE TONIGHT" DATE AVAILABILITY ====================
  async getFreeTonightProfiles(area?: string, dateType?: string): Promise<{ success: boolean; profiles: UserProfile[] }> {
    const params = new URLSearchParams();
    if (area && area !== 'all') params.append('area', area);
    if (dateType && dateType !== 'all') params.append('dateType', dateType);

    const res = await fetch(`${API_BASE}/free-tonight?${params.toString()}`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async toggleFreeTonight(statusData: Partial<FreeTonightStatus>): Promise<{ success: boolean; user: UserProfile }> {
    const res = await fetch(`${API_BASE}/free-tonight/toggle`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(statusData),
    });
    return res.json();
  },

  // ==================== CAFE DATE PLANNING LIFECYCLE ====================
  async getDatePlans(): Promise<{ success: boolean; dates: DatePlan[] }> {
    const res = await fetch(`${API_BASE}/dates`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async proposeDate(
    recipientId: string,
    venueName: string,
    venueType: string,
    dateTime: string,
    notes?: string
  ): Promise<{ success: boolean; datePlan: DatePlan; conversation?: Conversation }> {
    const res = await fetch(`${API_BASE}/dates/propose`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ recipientId, venueName, venueType, dateTime, notes }),
    });
    return res.json();
  },

  async updateDateStatus(
    datePlanId: string,
    status: 'suggested' | 'pending' | 'accepted' | 'confirmed' | 'completed' | 'cancelled'
  ): Promise<{ success: boolean; datePlan: DatePlan }> {
    const res = await fetch(`${API_BASE}/dates/${datePlanId}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    return res.json();
  },

  // ==================== MATCHES & MESSAGES ====================
  async getMatches(): Promise<{ success: boolean; matches: MatchItem[] }> {
    const res = await fetch(`${API_BASE}/matches`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async getConversations(): Promise<{ success: boolean; conversations: Conversation[] }> {
    const res = await fetch(`${API_BASE}/conversations`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async getConversation(id: string): Promise<{ success: boolean; conversation: Conversation }> {
    const res = await fetch(`${API_BASE}/conversations/${id}`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async sendMessage(
    conversationId: string,
    text: string,
    type: 'text' | 'date_proposal' | 'prompt_comment' = 'text',
    datePlanId?: string
  ): Promise<{ success: boolean; message: unknown; conversation: Conversation }> {
    const res = await fetch(`${API_BASE}/conversations/${conversationId}/messages`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ text, type, datePlanId }),
    });
    return res.json();
  },

  async unmatch(conversationId: string, otherUserId: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/conversations/${conversationId}/unmatch`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ otherUserId }),
    });
    return res.json();
  },

  // ==================== SAFETY & REPORTING ====================
  async reportUser(targetUserId: string, reason: string, details?: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/safety/report`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ targetUserId, reason, details }),
    });
    return res.json();
  },

  async blockUser(targetUserId: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/safety/block`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ targetUserId }),
    });
    return res.json();
  },
};
