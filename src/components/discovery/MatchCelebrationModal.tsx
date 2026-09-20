import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MessageCircle, Coffee, ArrowRight, X, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const MatchCelebrationModal: React.FC = () => {
  const {
    currentUser,
    matchModalData,
    setMatchModalData,
    setActiveTab,
    conversations,
    setActiveChat,
    setIsDatePlannerOpen,
    sendMessage,
  } = useApp();

  const [customGreeting, setCustomGreeting] = useState('');

  if (!matchModalData || !currentUser) return null;

  const { matchedProfile, conversationId } = matchModalData;

  const handleOpenChat = () => {
    setMatchModalData(null);
    setActiveTab('matches');
    const conv = conversations.find(
      (c) =>
        (c.participants.includes(currentUser.id) && c.participants.includes(matchedProfile.id)) ||
        c.id === conversationId
    );
    if (conv) {
      setActiveChat(conv);
    }
  };

  const handleQuickSend = async () => {
    if (!customGreeting.trim()) return;
    const greetingText = customGreeting.trim();
    setMatchModalData(null);
    setActiveTab('matches');

    const conv = conversations.find(
      (c) =>
        (c.participants.includes(currentUser.id) && c.participants.includes(matchedProfile.id)) ||
        c.id === conversationId
    );

    if (conv) {
      setActiveChat(conv);
      await sendMessage(greetingText);
    }
  };

  const handlePlanDate = () => {
    setMatchModalData(null);
    setActiveTab('matches');
    const conv = conversations.find(
      (c) =>
        (c.participants.includes(currentUser.id) && c.participants.includes(matchedProfile.id)) ||
        c.id === conversationId
    );
    if (conv) {
      setActiveChat(conv);
      setIsDatePlannerOpen(true);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-md w-full rounded-3xl bg-paper border border-border p-6 sm:p-8 text-center text-ink shadow-modal overflow-hidden"
        >
          {/* Subtle warm paper texture gradient */}
          <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-terracotta/5 to-transparent pointer-events-none" />

          {/* Close button */}
          <button
            onClick={() => setMatchModalData(null)}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-surface-sand text-ink-muted hover:text-ink transition z-20"
            aria-label="Close match dialog"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Editorial tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-sand border border-border-subtle text-xs font-serif italic text-terracotta mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-terracotta inline-block" />
            A Shared Spark on Campus
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif font-normal text-ink-heading tracking-tight">
            You both saw something special.
          </h2>
          <p className="text-xs text-ink-muted mt-1.5 max-w-xs mx-auto leading-relaxed">
            Mutual interest between you and <span className="text-ink font-medium">{matchedProfile.name}</span>.
          </p>

          {/* 3D Floating Cinematic Portraits */}
          <div className="perspective-1200 flex items-center justify-center -space-x-4 my-7 relative py-2">
            {/* Current user portrait */}
            <motion.div
              initial={{ x: -40, rotateY: 15, opacity: 0 }}
              animate={{ x: 0, rotateY: 8, opacity: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-28 h-36 rounded-2xl overflow-hidden border border-border shadow-soft bg-surface transform -rotate-3"
            >
              <img
                src={currentUser.photos[0]}
                alt={currentUser.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
              <div className="absolute bottom-2 inset-x-2 text-left">
                <span className="text-[10px] uppercase font-semibold tracking-wider text-paper/90">
                  You
                </span>
              </div>
            </motion.div>

            {/* Central Heart Monogram */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 350, damping: 22 }}
              className="z-20 w-11 h-11 rounded-full bg-terracotta text-white flex items-center justify-center shadow-card-3d border-2 border-paper"
            >
              <Heart className="w-5 h-5 fill-white" />
            </motion.div>

            {/* Matched student portrait */}
            <motion.div
              initial={{ x: 40, rotateY: -15, opacity: 0 }}
              animate={{ x: 0, rotateY: -8, opacity: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-28 h-36 rounded-2xl overflow-hidden border border-border shadow-soft bg-surface transform rotate-3"
            >
              <img
                src={matchedProfile.photos[0]}
                alt={matchedProfile.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
              <div className="absolute bottom-2 inset-x-2 text-left">
                <p className="text-[11px] font-serif font-medium text-white truncate">
                  {matchedProfile.name.split(' ')[0]}
                </p>
                <p className="text-[9px] text-paper/80 truncate">
                  {matchedProfile.major.split(' ')[0]}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Editorial Context Callout */}
          <div className="p-3.5 rounded-2xl bg-surface border border-border mb-5 text-left text-xs space-y-1.5 shadow-soft">
            <div className="flex items-center justify-between text-ink-muted text-[11px]">
              <span>{matchedProfile.campus}</span>
              <span className="text-campus-sage font-medium bg-surface-sand px-2 py-0.5 rounded border border-border-subtle text-[10px]">
                {matchedProfile.trustScore}% Verified Student
              </span>
            </div>
            <div className="text-ink text-xs">
              Major: <span className="font-medium text-ink-heading">{matchedProfile.major}</span> · {matchedProfile.batch}
            </div>
            {matchedProfile.favoriteCampusSpot && (
              <p className="text-[11px] text-terracotta font-serif italic pt-0.5">
                &ldquo;Favorite campus haunt: {matchedProfile.favoriteCampusSpot}&rdquo;
              </p>
            )}
          </div>

          {/* Instant Note Opener */}
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                value={customGreeting}
                onChange={(e) => setCustomGreeting(e.target.value)}
                placeholder={`Send a quick note to ${matchedProfile.name.split(' ')[0]}...`}
                className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border text-xs text-ink placeholder-ink-faint focus:outline-none focus:border-terracotta transition pr-20"
                onKeyDown={(e) => e.key === 'Enter' && handleQuickSend()}
              />
              <button
                onClick={handleQuickSend}
                disabled={!customGreeting.trim()}
                className="absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-lg bg-terracotta hover:bg-terracotta-600 text-white text-xs font-medium disabled:opacity-40 transition flex items-center gap-1 shadow-soft"
              >
                Send <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <button
              onClick={handleOpenChat}
              className="w-full py-2.5 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-soft transition"
            >
              <MessageCircle className="w-4 h-4" />
              Start Conversation
            </button>

            <button
              onClick={handlePlanDate}
              className="w-full py-2.5 rounded-xl bg-surface hover:bg-surface-sand text-ink border border-border text-xs font-medium flex items-center justify-center gap-2 transition shadow-soft"
            >
              <Coffee className="w-4 h-4 text-terracotta" />
              Propose a Campus Coffee
            </button>

            <button
              onClick={() => setMatchModalData(null)}
              className="text-xs text-ink-muted hover:text-ink font-medium py-1.5 transition block mx-auto"
            >
              Keep Exploring Profiles
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
