export interface StudentPrompt {
  question: string;
  answer: string;
}

export interface FreeTonightStatus {
  isActive: boolean;
  timeWindow: string;
  dateType: 'Cafe & Coffee' | 'Campus Walk' | 'Study Date' | 'Casual Food' | 'Event Hangout';
  area: string;
  note?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: 'female' | 'male' | 'non-binary';
  campus: string;
  major: string;
  batch: string;
  hostel: string;
  isVerified: boolean;
  trustScore: number;
  bio: string;
  relationshipIntent: 'Dating & Romance' | 'Study Date Buddy' | 'Campus Hangouts' | 'Serious Relationship';
  photos: string[];
  interests: string[];
  clubs: string[];
  prompts: StudentPrompt[];
  campusAnthem: {
    title: string;
    artist: string;
    vibe: string;
  };
  favoriteCampusSpot: string;
  twoAmCraving: string;
  compatibilityScore?: number;
  hasIncomingLike?: boolean;
  freeTonight?: FreeTonightStatus;
}

export interface DatePlan {
  id: string;
  initiatorId: string;
  recipientId: string;
  venueName: string;
  venueType: string;
  dateTime: string;
  notes?: string;
  status: 'suggested' | 'pending' | 'accepted' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  otherUser?: UserProfile;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
  type?: 'text' | 'date_proposal' | 'prompt_comment';
  promptCommentData?: {
    promptQuestion?: string;
    promptAnswer?: string;
    photoUrl?: string;
    comment: string;
  };
  datePlanId?: string;
}

export interface Conversation {
  id: string;
  participants: [string, string];
  compatibilityScore: number;
  lastMessage: string;
  lastMessageTimestamp: string;
  unread: boolean;
  messages: ChatMessage[];
  otherUser?: UserProfile;
  datePlans?: DatePlan[];
}

export interface MatchItem {
  profile: UserProfile;
  conversation?: Conversation;
  matchedAt: string;
  compatibilityScore: number;
}

export interface FilterState {
  campus: string;
  major: string;
  batch: string;
  gender: string;
  intent: string;
  verifiedOnly: boolean;
}

export type ToneType = 'friendly' | 'confident' | 'natural' | 'less_awkward' | 'concise';

export interface GrammarResult {
  original: string;
  corrected: string;
  corrections: Array<{ original: string; replacement: string; reason: string }>;
  wasCorrected: boolean;
}

export interface ToneResult {
  original: string;
  improved: string;
  tone: ToneType;
  rationale: string;
}
