import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Flame,
  MessageCircleHeart,
  Calendar,
  Coffee,
  Sparkles,
  SlidersHorizontal,
  CheckCircle2,
  User,
  Moon,
  LogIn,
  Clock,
  Compass,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentUser,
    activeTab,
    setActiveTab,
    matches,
    conversations,
    datePlans,
    setIsFilterModalOpen,
    setIsAuthModalOpen,
    isAuthenticated,
  } = useApp();

  const unreadCount = conversations.reduce((acc, c) => acc + (c.unread ? 1 : 0), 0);
  const pendingDatesCount = datePlans.filter(
    (d) => (d.status === 'pending' || d.status === 'accepted') && d.recipientId === currentUser?.id
  ).length;

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-paper/90 backdrop-blur-md border-b border-border transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <div
            onClick={() => setActiveTab('landing')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-surface-sand border border-border-subtle flex items-center justify-center text-terracotta shadow-soft group-hover:scale-105 transition">
              <Flame className="w-4 h-4 fill-terracotta" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-medium text-xl text-ink-heading tracking-tight">
                  Kampu$Link
                </span>
                <span className="text-[10px] uppercase font-sans font-medium tracking-wider px-1.5 py-0.2 rounded-full bg-surface-sand text-terracotta border border-border-subtle">
                  College
                </span>
              </div>
              <p className="text-[11px] text-ink-muted hidden sm:block">
                Intentional Dating for College Students
              </p>
            </div>
          </div>

          {/* Center Navigation (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 bg-surface-sand/70 p-1 rounded-full border border-border-subtle shadow-soft">
            <button
              onClick={() => setActiveTab('discover')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium transition ${
                activeTab === 'discover'
                  ? 'bg-surface text-ink-heading shadow-soft border border-border'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-terracotta" />
              <span>Discover</span>
            </button>

            <button
              onClick={() => setActiveTab('free_tonight')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium transition relative ${
                activeTab === 'free_tonight'
                  ? 'bg-surface text-ink-heading shadow-soft border border-border'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-campus-gold" />
              <span>Free Tonight</span>
              <span className="w-1.5 h-1.5 rounded-full bg-terracotta absolute top-1.5 right-2" />
            </button>

            <button
              onClick={() => setActiveTab('matches')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium transition relative ${
                activeTab === 'matches'
                  ? 'bg-surface text-ink-heading shadow-soft border border-border'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              <MessageCircleHeart className="w-3.5 h-3.5 text-terracotta" />
              <span>Messages</span>
              {(matches.length > 0 || unreadCount > 0) && (
                <span className="px-1.5 py-0.2 rounded-full bg-terracotta text-[10px] font-medium text-white">
                  {unreadCount > 0 ? unreadCount : matches.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('dates')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium transition relative ${
                activeTab === 'dates'
                  ? 'bg-surface text-ink-heading shadow-soft border border-border'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              <Coffee className="w-3.5 h-3.5 text-terracotta" />
              <span>Campus Dates</span>
              {pendingDatesCount > 0 && (
                <span className="w-1.5 h-1.5 rounded-full bg-campus-sage absolute top-1.5 right-2" />
              )}
            </button>
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Filter Drawer Trigger */}
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-surface border border-border hover:bg-surface-sand text-ink-muted hover:text-ink flex items-center gap-2 text-xs font-medium transition shadow-soft"
              title="Campus Filters"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-terracotta" />
              <span className="hidden sm:inline">Preferences</span>
            </button>

            {/* Auth / Profile */}
            {currentUser && isAuthenticated ? (
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-2 p-1 sm:pr-3 rounded-full border transition ${
                  activeTab === 'profile'
                    ? 'border-terracotta bg-surface shadow-soft'
                    : 'border-border bg-surface hover:bg-surface-sand'
                }`}
                title="My Profile"
              >
                <div className="relative">
                  <img
                    src={currentUser.photos[0]}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-border"
                  />
                  {currentUser.isVerified && (
                    <div className="w-3.5 h-3.5 rounded-full bg-campus-sage text-white flex items-center justify-center text-[9px] absolute -bottom-0.5 -right-0.5 ring-2 ring-paper">
                      ✓
                    </div>
                  )}
                </div>
                <div className="text-left hidden lg:block">
                  <div className="text-xs font-serif font-medium leading-tight flex items-center gap-1 text-ink-heading">
                    {currentUser.name.split(' ')[0]}
                    <span className="text-[10px] font-sans text-campus-sage bg-surface-sand px-1.5 rounded border border-border-subtle">
                      {currentUser.trustScore}%
                    </span>
                  </div>
                  <div className="text-[10px] text-ink-muted truncate max-w-[90px]">
                    {currentUser.campus}
                  </div>
                </div>
              </button>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white font-medium text-xs transition shadow-soft flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (Screens < 768px) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-paper/95 backdrop-blur-lg border-t border-border px-3 py-2 flex items-center justify-around shadow-modal">
        <button
          onClick={() => setActiveTab('discover')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] font-medium transition ${
            activeTab === 'discover' ? 'text-terracotta font-medium' : 'text-ink-muted'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Discover</span>
        </button>

        <button
          onClick={() => setActiveTab('free_tonight')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] font-medium transition relative ${
            activeTab === 'free_tonight' ? 'text-campus-gold font-medium' : 'text-ink-muted'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Free Tonight</span>
          <span className="w-1.5 h-1.5 rounded-full bg-terracotta absolute top-1 right-2" />
        </button>

        <button
          onClick={() => setActiveTab('matches')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] font-medium transition relative ${
            activeTab === 'matches' ? 'text-terracotta font-medium' : 'text-ink-muted'
          }`}
        >
          <MessageCircleHeart className="w-4 h-4" />
          <span>Messages</span>
          {unreadCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-terracotta text-[9px] font-medium text-white flex items-center justify-center absolute top-0.5 right-1">
              {unreadCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('dates')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] font-medium transition relative ${
            activeTab === 'dates' ? 'text-terracotta font-medium' : 'text-ink-muted'
          }`}
        >
          <Coffee className="w-4 h-4" />
          <span>Dates</span>
          {pendingDatesCount > 0 && (
            <span className="w-1.5 h-1.5 rounded-full bg-campus-sage absolute top-1 right-2" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] font-medium transition ${
            activeTab === 'profile' ? 'text-terracotta font-medium' : 'text-ink-muted'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile</span>
        </button>
      </nav>
    </>
  );
};
