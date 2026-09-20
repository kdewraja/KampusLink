import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, SlidersHorizontal, Check, ShieldCheck, GraduationCap, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const FilterModal: React.FC = () => {
  const { isFilterModalOpen, setIsFilterModalOpen, filterState, setFilterState } = useApp();

  if (!isFilterModalOpen) return null;

  const CAMPUSES = [
    'all',
    'IIT Bombay',
    'IIT Delhi',
    'BITS Pilani',
    'Delhi University',
    'St. Stephen\'s College',
    'Ashoka University',
  ];

  const MAJORS = [
    'all',
    'Computer Science',
    'Design',
    'Economics',
    'Literature',
    'BioTechnology',
    'Mechanical',
  ];

  const BATCHES = ['all', 'Class of \'25', 'Class of \'26', 'Class of \'27', 'Class of \'28'];

  const INTENTS = [
    'all',
    'Dating & Romance',
    'Study Date Buddy',
    'Campus Hangouts',
    'Serious Relationship',
  ];

  const handleReset = () => {
    setFilterState({
      campus: 'all',
      major: 'all',
      batch: 'all',
      gender: 'all',
      intent: 'all',
      verifiedOnly: false,
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="bg-paper border border-border rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-modal p-6 relative text-ink"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-surface-sand text-terracotta border border-border-subtle">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-serif font-normal text-ink-heading">Campus Discovery Filters</h3>
                <p className="text-xs text-ink-muted">Tailor student profiles and campus circles</p>
              </div>
            </div>
            <button
              onClick={() => setIsFilterModalOpen(false)}
              className="p-1.5 rounded-full hover:bg-surface-sand text-ink-muted hover:text-ink transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="py-5 space-y-6">
            {/* Campus Selector */}
            <div>
              <label className="text-xs font-medium text-ink-heading uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-terracotta" />
                Target University Campus
              </label>
              <div className="flex flex-wrap gap-2">
                {CAMPUSES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setFilterState((prev) => ({ ...prev, campus: c }))}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition border ${
                      filterState.campus === c
                        ? 'bg-terracotta border-terracotta text-white shadow-soft'
                        : 'bg-surface hover:bg-surface-sand text-ink-muted hover:text-ink border-border'
                    }`}
                  >
                    {c === 'all' ? 'All Campuses' : c}
                  </button>
                ))}
              </div>
            </div>

            {/* Major / Academic Field */}
            <div>
              <label className="text-xs font-medium text-ink-heading uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-terracotta" />
                Academic Major / Department
              </label>
              <div className="flex flex-wrap gap-2">
                {MAJORS.map((m) => (
                  <button
                    key={m}
                    onClick={() => setFilterState((prev) => ({ ...prev, major: m }))}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition border ${
                      filterState.major === m
                        ? 'bg-terracotta border-terracotta text-white shadow-soft'
                        : 'bg-surface hover:bg-surface-sand text-ink-muted hover:text-ink border-border'
                    }`}
                  >
                    {m === 'all' ? 'All Majors' : m}
                  </button>
                ))}
              </div>
            </div>

            {/* Batch / Graduation Year */}
            <div>
              <label className="text-xs font-medium text-ink-heading uppercase tracking-wider mb-2.5 block">
                Graduation Class / Year
              </label>
              <div className="flex flex-wrap gap-2">
                {BATCHES.map((b) => (
                  <button
                    key={b}
                    onClick={() => setFilterState((prev) => ({ ...prev, batch: b }))}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition border ${
                      filterState.batch === b
                        ? 'bg-terracotta border-terracotta text-white shadow-soft'
                        : 'bg-surface hover:bg-surface-sand text-ink-muted hover:text-ink border-border'
                    }`}
                  >
                    {b === 'all' ? 'Any Class' : b}
                  </button>
                ))}
              </div>
            </div>

            {/* Intent */}
            <div>
              <label className="text-xs font-medium text-ink-heading uppercase tracking-wider mb-2.5 block">
                Relationship &amp; Connection Intent
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {INTENTS.map((intent) => (
                  <button
                    key={intent}
                    onClick={() => setFilterState((prev) => ({ ...prev, intent }))}
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-medium text-left transition border flex items-center justify-between ${
                      filterState.intent === intent
                        ? 'bg-surface border-terracotta text-ink-heading shadow-soft ring-1 ring-terracotta/30'
                        : 'bg-surface hover:bg-surface-sand text-ink-muted border-border'
                    }`}
                  >
                    <span>{intent === 'all' ? 'Open to All Intents' : intent}</span>
                    {filterState.intent === intent && <Check className="w-3.5 h-3.5 text-terracotta" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Verified Student Only Toggle */}
            <div className="p-4 rounded-2xl bg-surface border border-border flex items-center justify-between gap-4 shadow-soft">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-surface-sand text-campus-sage border border-border-subtle">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-medium text-ink-heading">Verified Students Only</h4>
                  <p className="text-[11px] text-ink-muted">Only display students with authenticated university credentials</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterState.verifiedOnly}
                  onChange={(e) => setFilterState((prev) => ({ ...prev, verifiedOnly: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-surface-sand border border-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-terracotta"></div>
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <button
              onClick={handleReset}
              className="text-xs text-ink-muted hover:text-ink transition font-medium"
            >
              Reset to Defaults
            </button>
            <button
              onClick={() => setIsFilterModalOpen(false)}
              className="px-5 py-2.5 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white font-medium text-xs transition shadow-soft"
            >
              Apply Filters
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
