import React from 'react';
import { useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Toast } from './components/common/Toast';
import { LandingPage } from './components/landing/LandingPage';
import { SwipeDeck } from './components/discovery/SwipeDeck';
import { FreeTonightView } from './components/freeTonight/FreeTonightView';
import { ChatView } from './components/chat/ChatView';
import { DatePlansView } from './components/dates/DatePlansView';
import { ProfileEditView } from './components/profile/ProfileEditView';
import { FilterModal } from './components/discovery/FilterModal';
import { MatchCelebrationModal } from './components/discovery/MatchCelebrationModal';
import { CampusDatePlannerModal } from './components/chat/CampusDatePlannerModal';
import { AiToneAssistantModal } from './components/chat/AiToneAssistantModal';
import { PromptLikeModal } from './components/discovery/PromptLikeModal';
import { AuthModal } from './components/auth/AuthModal';
import { OnboardingWizard } from './components/auth/OnboardingWizard';

export const App: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col selection:bg-terracotta-200 selection:text-ink pb-16 md:pb-0 font-sans">
      {/* Main Header & Navigation */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'landing' && <LandingPage />}
        {activeTab === 'discover' && <SwipeDeck />}
        {activeTab === 'free_tonight' && <FreeTonightView />}
        {activeTab === 'matches' && <ChatView />}
        {activeTab === 'dates' && <DatePlansView />}
        {activeTab === 'profile' && <ProfileEditView />}
      </main>

      {/* Modals & Overlays */}
      <FilterModal />
      <MatchCelebrationModal />
      <CampusDatePlannerModal />
      <AiToneAssistantModal />
      <PromptLikeModal />
      <AuthModal />
      <OnboardingWizard />
      <Toast />
    </div>
  );
};
