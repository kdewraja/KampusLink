import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Coffee, MapPin, Calendar, Clock, Check, X, ShieldCheck, Sparkles, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CampusDatePlannerModal: React.FC = () => {
  const { isDatePlannerOpen, setIsDatePlannerOpen, activeChat, proposeDate } = useApp();

  const [selectedSpot, setSelectedSpot] = useState('Central Library Cafe & Courtyard');
  const [selectedType, setSelectedType] = useState('Quiet & Aesthetic');
  const [selectedDay, setSelectedDay] = useState('Tomorrow');
  const [selectedTime, setSelectedTime] = useState('4:30 PM (Post-Lecture)');
  const [customNote, setCustomNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isDatePlannerOpen || !activeChat || !activeChat.otherUser) return null;

  const VERIFIED_SPOTS = [
    {
      name: 'Central Library Cafe & Courtyard',
      type: 'Quiet & Aesthetic',
      desc: 'Great iced matcha, outdoor benches under shade trees.',
      badge: 'High Safety Zone',
    },
    {
      name: 'Student Activity Center (SAC) Lawns',
      type: 'Lively & Casual',
      desc: 'Evening kullad chai, live acoustic buskers, open air.',
      badge: 'Public & Monitored',
    },
    {
      name: 'Design Department Ivy Courtyard',
      type: 'Artistic & Cozy',
      desc: 'Quiet corner, fairy lights, great for deep chats.',
      badge: 'Campus Monitored',
    },
    {
      name: 'Campus Night Canteen & Bun-Maska Stall',
      type: 'Casual Post-Dinner',
      desc: 'Warm butter toast, hot chai, and late night student energy.',
      badge: 'Hostel Hub',
    },
  ];

  const DAYS = ['Today', 'Tomorrow', 'This Friday', 'This Saturday'];
  const TIMES = ['1:00 PM (Lunch)', '4:30 PM (Post-Lecture)', '6:30 PM (Sunset Chai)', '8:30 PM (Post-Dinner)'];

  const handlePropose = async () => {
    if (!activeChat.otherUser) return;
    setIsSubmitting(true);
    const dateTime = `${selectedDay} at ${selectedTime}`;
    await proposeDate(
      activeChat.otherUser.id,
      selectedSpot,
      selectedType,
      dateTime,
      customNote.trim() || undefined
    );
    setIsSubmitting(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="bg-paper border border-border rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-modal p-6 text-ink relative"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-surface-sand text-terracotta border border-border-subtle">
                <Coffee className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-serif font-normal text-ink-heading">Campus Safe Date Planner</h3>
                <p className="text-xs text-ink-muted">
                  Suggest a verified collegiate spot with {activeChat.otherUser.name.split(' ')[0]}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsDatePlannerOpen(false)}
              className="p-1.5 rounded-full hover:bg-surface-sand text-ink-muted hover:text-ink transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="py-5 space-y-5">
            {/* Spot Selection */}
            <div>
              <label className="text-xs font-medium text-ink-heading uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-terracotta" />
                Select Verified Campus Spot
              </label>
              <div className="space-y-2">
                {VERIFIED_SPOTS.map((spot) => (
                  <div
                    key={spot.name}
                    onClick={() => {
                      setSelectedSpot(spot.name);
                      setSelectedType(spot.type);
                    }}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-start justify-between ${
                      selectedSpot === spot.name
                        ? 'bg-surface border-terracotta shadow-soft ring-1 ring-terracotta/30'
                        : 'bg-surface hover:bg-surface-sand border-border'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-serif font-medium text-ink-heading">{spot.name}</span>
                        <span className="px-2 py-0.5 rounded-full bg-surface-sand text-campus-sage border border-border-subtle text-[10px] font-medium font-sans">
                          {spot.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-ink-muted mt-0.5 leading-relaxed">{spot.desc}</p>
                    </div>
                    {selectedSpot === spot.name && (
                      <Check className="w-4 h-4 text-terracotta shrink-0 mt-0.5" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Day & Time Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-ink-heading uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-terracotta" />
                  Day
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {DAYS.map((d) => (
                    <button
                      key={d}
                      onClick={() => setSelectedDay(d)}
                      className={`px-2.5 py-2 rounded-xl text-xs font-medium border transition ${
                        selectedDay === d
                          ? 'bg-terracotta border-terracotta text-white shadow-soft'
                          : 'bg-surface hover:bg-surface-sand text-ink border-border'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-ink-heading uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-campus-gold" />
                  Time
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {TIMES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTime(t)}
                      className={`px-2 py-2 rounded-xl text-[11px] font-medium border transition truncate ${
                        selectedTime === t
                          ? 'bg-campus-gold border-campus-gold text-white shadow-soft'
                          : 'bg-surface hover:bg-surface-sand text-ink border-border'
                      }`}
                    >
                      {t.split(' ')[0]} {t.split(' ')[1]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Optional Note */}
            <div>
              <label className="text-xs font-medium text-ink-heading uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-terracotta" />
                Optional Note / Vibe
              </label>
              <input
                type="text"
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="e.g. Let's talk about architecture over iced tea!"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-xs text-ink placeholder-ink-faint focus:outline-none focus:border-terracotta transition"
              />
            </div>

            {/* Safety Assurance Note */}
            <div className="p-3.5 rounded-2xl bg-surface-sand/80 border border-border flex items-center gap-2.5 text-xs text-ink shadow-soft">
              <ShieldCheck className="w-4 h-4 text-campus-sage shrink-0" />
              <span className="text-ink-muted text-xs leading-relaxed">
                <strong className="text-ink font-medium">Safety Assured:</strong> All suggested date spots are on monitored campus grounds with active security.
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <button
              onClick={() => setIsDatePlannerOpen(false)}
              className="text-xs text-ink-muted hover:text-ink transition font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handlePropose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white font-medium text-xs shadow-soft transition flex items-center gap-2 disabled:opacity-50"
            >
              <Coffee className="w-4 h-4" />
              {isSubmitting ? 'Sending...' : 'Send Campus Date Invitation'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
