import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  UserProfile,
  Conversation,
  MatchItem,
  FilterState,
  DatePlan,
  FreeTonightStatus,
} from '../types';
import { api } from '../services/api';
import confetti from 'canvas-confetti';

export interface ToastInfo {
  id: string;
  title: string;
  desc?: string;
  type: 'success' | 'match' | 'alert' | 'info';
}

export interface PromptLikeTarget {
  targetProfile: UserProfile;
  promptQuestion?: string;
  promptAnswer?: string;
  photoUrl?: string;
}

interface AppContextType {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  token: string | null;
  activeTab: 'landing' | 'discover' | 'free_tonight' | 'matches' | 'dates' | 'profile';
  setActiveTab: (tab: 'landing' | 'discover' | 'free_tonight' | 'matches' | 'dates' | 'profile') => void;
  feed: UserProfile[];
  freeTonightProfiles: UserProfile[];
  matches: MatchItem[];
  conversations: Conversation[];
  datePlans: DatePlan[];
  activeChat: Conversation | null;
  setActiveChat: (conv: Conversation | null) => void;
  filterState: FilterState;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  matchModalData: { matchedProfile: UserProfile; compatibilityScore: number; conversationId?: string } | null;
  setMatchModalData: (data: { matchedProfile: UserProfile; compatibilityScore: number; conversationId?: string } | null) => void;
  toast: ToastInfo | null;
  showToast: (title: string, desc?: string, type?: 'success' | 'match' | 'alert' | 'info') => void;
  isLoading: boolean;
  // Modals & Popups
  isFilterModalOpen: boolean;
  setIsFilterModalOpen: (open: boolean) => void;
  isDatePlannerOpen: boolean;
  setIsDatePlannerOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  promptLikeTarget: PromptLikeTarget | null;
  setPromptLikeTarget: (target: PromptLikeTarget | null) => void;
  // AI Modal
  isAiModalOpen: boolean;
  aiModalInitialText: string;
  openAiModal: (text: string, onAccept: (improved: string) => void) => void;
  closeAiModal: () => void;
  aiAcceptCallback: ((improved: string) => void) | null;
  // Actions
  login: (email: string, pass: string) => Promise<boolean>;
  register: (data: { email: string; password: string } & Partial<UserProfile>) => Promise<boolean>;
  logout: () => void;
  recordSwipe: (
    targetUserId: string,
    action: 'like' | 'pass' | 'super',
    options?: {
      comment?: string;
      targetPrompt?: string;
      targetPromptAnswer?: string;
      targetPhoto?: string;
    }
  ) => Promise<void>;
  rewindSwipe: () => Promise<void>;
  toggleFreeTonight: (statusData: Partial<FreeTonightStatus>) => Promise<void>;
  proposeDate: (recipientId: string, venueName: string, venueType: string, dateTime: string, notes?: string) => Promise<boolean>;
  updateDateStatus: (datePlanId: string, status: DatePlan['status']) => Promise<void>;
  sendMessage: (text: string, type?: 'text' | 'date_proposal' | 'prompt_comment', datePlanId?: string) => Promise<void>;
  unmatch: (otherUserId: string) => Promise<void>;
  reportUser: (targetUserId: string, reason: string, details?: string) => Promise<void>;
  blockUser: (targetUserId: string) => Promise<void>;
  verifyStudent: (email: string) => Promise<boolean>;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('kampuslink_token'));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true); // Defaults to true with seeded profile
  const [activeTab, setActiveTab] = useState<'landing' | 'discover' | 'free_tonight' | 'matches' | 'dates' | 'profile'>('landing');

  const [feed, setFeed] = useState<UserProfile[]>([]);
  const [freeTonightProfiles, setFreeTonightProfiles] = useState<UserProfile[]>([]);
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [datePlans, setDatePlans] = useState<DatePlan[]>([]);
  const [activeChat, setActiveChat] = useState<Conversation | null>(null);

  const [matchModalData, setMatchModalData] = useState<{ matchedProfile: UserProfile; compatibilityScore: number; conversationId?: string } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [toast, setToast] = useState<ToastInfo | null>(null);

  // Modals
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isDatePlannerOpen, setIsDatePlannerOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [promptLikeTarget, setPromptLikeTarget] = useState<PromptLikeTarget | null>(null);

  // AI Tone modal state
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiModalInitialText, setAiModalInitialText] = useState('');
  const [aiAcceptCallback, setAiAcceptCallback] = useState<((improved: string) => void) | null>(null);

  // Filters
  const [filterState, setFilterState] = useState<FilterState>({
    campus: 'all',
    major: 'all',
    batch: 'all',
    gender: 'all',
    intent: 'all',
    verifiedOnly: false,
  });

  const showToast = useCallback((title: string, desc?: string, type: 'success' | 'match' | 'alert' | 'info' = 'info') => {
    setToast({ id: String(Date.now()), title, desc, type });
  }, []);

  // Fetch all core platform data
  const refreshData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [sessionRes, profilesRes, freeRes, matchesRes, convsRes, datesRes] = await Promise.all([
        api.getSession(),
        api.getProfiles(filterState),
        api.getFreeTonightProfiles(),
        api.getMatches(),
        api.getConversations(),
        api.getDatePlans(),
      ]);

      if (sessionRes.success && sessionRes.user) {
        setCurrentUser(sessionRes.user);
        setIsAuthenticated(true);
      }
      if (profilesRes.success) setFeed(profilesRes.profiles);
      if (freeRes.success) setFreeTonightProfiles(freeRes.profiles);
      if (matchesRes.success) setMatches(matchesRes.matches);
      if (convsRes.success) {
        setConversations(convsRes.conversations);
        if (activeChat) {
          const updated = convsRes.conversations.find((c) => c.id === activeChat.id);
          if (updated) setActiveChat(updated);
        }
      }
      if (datesRes.success) setDatePlans(datesRes.dates);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filterState, activeChat]);

  useEffect(() => {
    refreshData();
  }, [filterState]);

  // Auth actions
  const login = async (email: string, pass: string): Promise<boolean> => {
    try {
      const res = await api.login(email, pass);
      if (res.success && res.user && res.token) {
        localStorage.setItem('kampuslink_token', res.token);
        setToken(res.token);
        setCurrentUser(res.user);
        setIsAuthenticated(true);
        setIsAuthModalOpen(false);
        showToast('Welcome back!', `Signed in as ${res.user.name}`, 'success');
        await refreshData();
        return true;
      }
      showToast('Sign In Failed', res.error || 'Check your email and password', 'alert');
      return false;
    } catch {
      showToast('Error', 'Unable to reach server', 'alert');
      return false;
    }
  };

  const register = async (data: { email: string; password: string } & Partial<UserProfile>): Promise<boolean> => {
    try {
      const res = await api.register(data);
      if (res.success && res.user && res.token) {
        localStorage.setItem('kampuslink_token', res.token);
        setToken(res.token);
        setCurrentUser(res.user);
        setIsAuthenticated(true);
        setIsOnboardingOpen(false);
        showToast('Welcome to Kampu$Link!', `Your profile is live on campus`, 'success');
        setActiveTab('discover');
        await refreshData();
        return true;
      }
      showToast('Registration Error', res.error || 'Could not complete registration', 'alert');
      return false;
    } catch {
      showToast('Error', 'Unable to complete registration', 'alert');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('kampuslink_token');
    setToken(null);
    setIsAuthenticated(false);
    setActiveTab('landing');
    showToast('Signed Out', 'You have been logged out.', 'info');
  };

  // Swiping & Hinge-style prompt likes
  const recordSwipe = async (
    targetUserId: string,
    action: 'like' | 'pass' | 'super',
    options?: {
      comment?: string;
      targetPrompt?: string;
      targetPromptAnswer?: string;
      targetPhoto?: string;
    }
  ) => {
    setFeed((prev) => prev.filter((p) => p.id !== targetUserId));

    try {
      const res = await api.swipe(targetUserId, action, options);
      if (res.success && res.isMatch && res.matchedProfile) {
        confetti({
          particleCount: 100,
          spread: 65,
          origin: { y: 0.6 },
          colors: ['#D96B52', '#E27D68', '#C69244', '#5B8266'],
        });

        setMatchModalData({
          matchedProfile: res.matchedProfile,
          compatibilityScore: res.compatibilityScore || 94,
          conversationId: res.conversationId,
        });

        showToast('New Connection!', `You and ${res.matchedProfile.name} linked on campus!`, 'match');
      } else if (options?.comment) {
        showToast('Comment Sent', `Your reply was sent to their profile!`, 'success');
      }

      const [mRes, cRes] = await Promise.all([api.getMatches(), api.getConversations()]);
      if (mRes.success) setMatches(mRes.matches);
      if (cRes.success) setConversations(cRes.conversations);
    } catch (err) {
      console.error('Swipe error:', err);
    }
  };

  const rewindSwipe = async () => {
    try {
      const res = await api.rewindSwipe();
      if (res.success && res.rewoundProfile) {
        setFeed((prev) => [res.rewoundProfile!, ...prev]);
        showToast('Profile Restored', `Returned ${res.rewoundProfile.name} to your stack`, 'info');
      } else {
        showToast('Cannot Undo', 'No previous swipe available to rewind', 'alert');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Free Tonight toggle
  const toggleFreeTonight = async (statusData: Partial<FreeTonightStatus>) => {
    try {
      const res = await api.toggleFreeTonight(statusData);
      if (res.success && res.user) {
        setCurrentUser(res.user);
        const freeRes = await api.getFreeTonightProfiles();
        if (freeRes.success) setFreeTonightProfiles(freeRes.profiles);
        showToast(
          res.user.freeTonight?.isActive ? 'Free Tonight Active!' : 'Status Inactive',
          res.user.freeTonight?.isActive
            ? `Available for ${res.user.freeTonight.dateType} in ${res.user.freeTonight.area}`
            : 'You are no longer listed for tonight.',
          'success'
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Propose date & lifecycle
  const proposeDate = async (
    recipientId: string,
    venueName: string,
    venueType: string,
    dateTime: string,
    notes?: string
  ): Promise<boolean> => {
    try {
      const res = await api.proposeDate(recipientId, venueName, venueType, dateTime, notes);
      if (res.success) {
        showToast('Date Invitation Sent!', `Proposed ${venueName} for ${dateTime}`, 'success');
        setIsDatePlannerOpen(false);
        const datesRes = await api.getDatePlans();
        if (datesRes.success) setDatePlans(datesRes.dates);
        if (res.conversation) {
          setActiveChat(res.conversation);
          setConversations((prev) => prev.map((c) => (c.id === res.conversation!.id ? res.conversation! : c)));
        }
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const updateDateStatus = async (datePlanId: string, status: DatePlan['status']) => {
    try {
      const res = await api.updateDateStatus(datePlanId, status);
      if (res.success) {
        const datesRes = await api.getDatePlans();
        if (datesRes.success) setDatePlans(datesRes.dates);
        const convsRes = await api.getConversations();
        if (convsRes.success) setConversations(convsRes.conversations);

        if (status === 'accepted') {
          confetti({ particleCount: 75, spread: 55, origin: { y: 0.65 } });
          showToast('Date Accepted!', 'Campus date confirmed. Have a wonderful time!', 'success');
        } else if (status === 'confirmed') {
          showToast('Date Confirmed', 'Both students confirmed attendance.', 'success');
        } else {
          showToast('Date Updated', `Status updated to ${status}`, 'info');
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Send message
  const sendMessage = async (
    text: string,
    type: 'text' | 'date_proposal' | 'prompt_comment' = 'text',
    datePlanId?: string
  ) => {
    if (!activeChat) return;

    try {
      const res = await api.sendMessage(activeChat.id, text, type, datePlanId);
      if (res.success) {
        setActiveChat(res.conversation);
        setConversations((prev) => prev.map((c) => (c.id === res.conversation.id ? res.conversation : c)));

        // Simulated auto-reply from Rhea
        if (res.conversation.participants.includes('u2') && currentUser?.id === 'u1') {
          setTimeout(async () => {
            const updated = await api.getConversation(activeChat.id);
            if (updated.success) {
              setActiveChat(updated.conversation);
              setConversations((prev) => prev.map((c) => (c.id === updated.conversation.id ? updated.conversation : c)));
            }
          }, 1500);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Safety actions
  const unmatch = async (otherUserId: string) => {
    if (!activeChat) return;
    try {
      await api.unmatch(activeChat.id, otherUserId);
      setActiveChat(null);
      showToast('Unmatched', 'This conversation has been removed.', 'info');
      await refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  const reportUser = async (targetUserId: string, reason: string, details?: string) => {
    try {
      const res = await api.reportUser(targetUserId, reason, details);
      if (res.success) {
        showToast('Report Submitted', 'User blocked and submitted to community trust safety.', 'info');
        setActiveChat(null);
        await refreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const blockUser = async (targetUserId: string) => {
    try {
      const res = await api.blockUser(targetUserId);
      if (res.success) {
        showToast('User Blocked', 'They will no longer appear in your discovery or chat.', 'info');
        setActiveChat(null);
        await refreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const verifyStudent = async (email: string): Promise<boolean> => {
    try {
      const res = await api.verifyStudent(email);
      if (res.success && res.user) {
        setCurrentUser(res.user);
        showToast('Scholar Verified!', 'Verified student badge added to your profile', 'success');
        return true;
      }
      showToast('Verification Notice', res.error || 'Please provide an accredited .edu or .ac.in email', 'alert');
      return false;
    } catch {
      return false;
    }
  };

  // AI modal helper
  const openAiModal = (text: string, onAccept: (improved: string) => void) => {
    setAiModalInitialText(text);
    setAiAcceptCallback(() => onAccept);
    setIsAiModalOpen(true);
  };

  const closeAiModal = () => {
    setIsAiModalOpen(false);
    setAiModalInitialText('');
    setAiAcceptCallback(null);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        token,
        activeTab,
        setActiveTab,
        feed,
        freeTonightProfiles,
        matches,
        conversations,
        datePlans,
        activeChat,
        setActiveChat,
        filterState,
        setFilterState,
        matchModalData,
        setMatchModalData,
        toast,
        showToast,
        isLoading,
        isFilterModalOpen,
        setIsFilterModalOpen,
        isDatePlannerOpen,
        setIsDatePlannerOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isOnboardingOpen,
        setIsOnboardingOpen,
        promptLikeTarget,
        setPromptLikeTarget,
        isAiModalOpen,
        aiModalInitialText,
        openAiModal,
        closeAiModal,
        aiAcceptCallback,
        login,
        register,
        logout,
        recordSwipe,
        rewindSwipe,
        toggleFreeTonight,
        proposeDate,
        updateDateStatus,
        sendMessage,
        unmatch,
        reportUser,
        blockUser,
        verifyStudent,
        refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
