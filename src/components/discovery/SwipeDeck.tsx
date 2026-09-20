import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ProfileCard } from './ProfileCard';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Sparkles, SlidersHorizontal, RefreshCw, Keyboard } from 'lucide-react';

export const SwipeDeck: React.FC = () => {
  const {
    feed,
    recordSwipe,
    rewindSwipe,
    refreshData,
    setIsFilterModalOpen,
    isLoading,
  } = useApp();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-250, 250], [-14, 14]);
  const opacity = useTransform(x, [-300, -200, 0, 200, 300], [0.2, 1, 1, 1, 0.2]);

  const likeOpacity = useTransform(x, [20, 110], [0, 1]);
  const nopeOpacity = useTransform(x, [-20, -110], [0, 1]);
  const superOpacity = useTransform(y, [-20, -100], [0, 1]);

  const currentCard = feed[0];
  const nextCard = feed[1];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!currentCard) return;
      if (e.key === 'ArrowLeft') {
        recordSwipe(currentCard.id, 'pass');
      } else if (e.key === 'ArrowRight') {
        recordSwipe(currentCard.id, 'like');
      } else if (e.key === 'ArrowUp') {
        recordSwipe(currentCard.id, 'super');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentCard, recordSwipe]);

  const handleDragEnd = (_: unknown, info: { offset: { x: number; y: number } }) => {
    if (!currentCard) return;
    if (info.offset.x > 120) {
      recordSwipe(currentCard.id, 'like');
    } else if (info.offset.x < -120) {
      recordSwipe(currentCard.id, 'pass');
    } else if (info.offset.y < -100) {
      recordSwipe(currentCard.id, 'super');
    }
  };

  if (isLoading && feed.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <div className="w-14 h-14 rounded-2xl bg-surface border border-border flex items-center justify-center text-terracotta mb-3 animate-spin shadow-soft">
          <Sparkles className="w-6 h-6" />
        </div>
        <h3 className="text-base font-serif text-ink-heading font-medium">Discovering Campus Connections...</h3>
        <p className="text-xs text-ink-muted mt-1 max-w-xs leading-relaxed">
          Loading student profiles, campus prompt answers, and shared university circles.
        </p>
      </div>
    );
  }

  // Empty state
  if (!currentCard) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[65vh] text-center p-6 max-w-md mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-surface-sand border border-border flex items-center justify-center text-terracotta mb-4 shadow-soft">
          <Sparkles className="w-7 h-7" />
        </div>
        <h3 className="text-2xl font-serif text-ink-heading font-normal tracking-tight">
          You&apos;re All Caught Up
        </h3>
        <p className="text-xs text-ink-muted mt-2 leading-relaxed max-w-sm">
          You have reviewed all student profiles matching your current filters. Broaden your criteria or refresh to see who joined recently.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 mt-6 w-full">
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-surface hover:bg-surface-sand text-ink border border-border text-xs font-medium flex items-center justify-center gap-2 transition shadow-soft"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-terracotta" />
            Adjust Filters
          </button>

          <button
            onClick={refreshData}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white text-xs font-medium flex items-center justify-center gap-2 shadow-soft transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh Discovery
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-md mx-auto flex flex-col items-center py-2 sm:py-6 px-3">
      {/* Cards Container */}
      <div className="relative w-full h-[600px] flex items-center justify-center">
        {/* Underneath Card Preview */}
        {nextCard && (
          <div className="absolute inset-0 scale-[0.96] translate-y-3 opacity-60 pointer-events-none filter blur-[0.5px] transition-all">
            <ProfileCard profile={nextCard} onSwipe={() => {}} />
          </div>
        )}

        {/* Top Draggable Card */}
        <motion.div
          key={currentCard.id}
          style={{ x, y, rotate, opacity }}
          drag
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          dragElastic={0.7}
          onDragEnd={handleDragEnd}
          className="absolute inset-0 cursor-grab active:cursor-grabbing touch-none z-30"
        >
          {/* LIKE Stamp */}
          <motion.div
            style={{ opacity: likeOpacity }}
            className="absolute top-10 left-6 z-40 border-2 border-terracotta text-terracotta font-serif font-bold text-2xl uppercase tracking-widest px-4 py-1 rounded-xl rotate-[-12deg] pointer-events-none shadow-soft bg-paper/95 backdrop-blur-sm"
          >
            LIKE
          </motion.div>

          {/* NOPE Stamp */}
          <motion.div
            style={{ opacity: nopeOpacity }}
            className="absolute top-10 right-6 z-40 border-2 border-ink-muted text-ink-muted font-serif font-bold text-2xl uppercase tracking-widest px-4 py-1 rounded-xl rotate-[12deg] pointer-events-none shadow-soft bg-paper/95 backdrop-blur-sm"
          >
            PASS
          </motion.div>

          {/* SUPER LIKE Stamp */}
          <motion.div
            style={{ opacity: superOpacity }}
            className="absolute top-16 inset-x-12 z-40 border-2 border-campus-gold text-campus-gold font-serif font-bold text-lg uppercase tracking-widest text-center py-1.5 rounded-xl pointer-events-none shadow-soft bg-paper/95 backdrop-blur-sm"
          >
            SUPER-LIKE ⭐
          </motion.div>

          <ProfileCard
            profile={currentCard}
            onSwipe={(action) => recordSwipe(currentCard.id, action)}
            onRewind={rewindSwipe}
          />
        </motion.div>
      </div>

      {/* Keyboard Shortcut & Swipe Hint */}
      <div className="mt-4 flex items-center gap-4 text-[11px] text-ink-muted bg-surface/90 backdrop-blur-sm px-4 py-2 rounded-full border border-border shadow-soft">
        <div className="flex items-center gap-1.5">
          <Keyboard className="w-3.5 h-3.5 text-terracotta" />
          <span className="hidden sm:inline font-medium text-ink">Shortcuts:</span>
        </div>
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-surface-sand border border-border-subtle text-[10px] font-mono text-ink">←</kbd> Pass
        </span>
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-surface-sand border border-border-subtle text-[10px] font-mono text-ink">→</kbd> Like
        </span>
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-surface-sand border border-border-subtle text-[10px] font-mono text-ink">↑</kbd> Super
        </span>
      </div>
    </div>
  );
};
