import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FreeTonightStatus, UserProfile } from '../../types';
import {
  Moon,
  Coffee,
  Footprints,
  BookOpen,
  Utensils,
  Sparkles,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  SlidersHorizontal,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const FreeTonightView: React.FC = () => {
  const {
    currentUser,
    freeTonightProfiles,
    toggleFreeTonight,
    setIsDatePlannerOpen,
    setActiveChat,
    conversations,
    setActiveTab,
  } = useApp();

  const [isEditingMyStatus, setIsEditingMyStatus] = useState(false);
  const [timeWindow, setTimeWindow] = useState(currentUser?.freeTonight?.timeWindow || 'Tonight 8:00 PM - 10:30 PM');
  const [dateType, setDateType] = useState<FreeTonightStatus['dateType']>(
    currentUser?.freeTonight?.dateType || 'Cafe & Coffee'
  );
  const [area, setArea] = useState(currentUser?.freeTonight?.area || 'Central Campus Library');
  const [note, setNote] = useState(currentUser?.freeTonight?.note || '');

  const DATE_TYPES: Array<{ type: FreeTonightStatus['dateType']; icon: React.ReactNode; label: string }> = [
    { type: 'Cafe & Coffee', icon: <Coffee className="w-4 h-4" />, label: 'Cafe & Coffee' },
    { type: 'Campus Walk', icon: <Footprints className="w-4 h-4" />, label: 'Campus Walk' },
    { type: 'Study Date', icon: <BookOpen className="w-4 h-4" />, label: 'Study Date' },
    { type: 'Casual Food', icon: <Utensils className="w-4 h-4" />, label: 'Casual Food' },
    { type: 'Event Hangout', icon: <Sparkles className="w-4 h-4" />, label: 'Event Hangout' },
  ];

  const CAMPUS_AREAS = [
    'Central Campus Library',
    'Design Courtyard',
    'Student Activity Center (SAC)',
    'Main Canteen & Cafe Hub',
    'Campus Amphitheatre',
  ];

  const handleToggleMyStatus = async () => {
    await toggleFreeTonight({
      isActive: !currentUser?.freeTonight?.isActive,
      timeWindow,
      dateType,
      area,
      note,
    });
    setIsEditingMyStatus(false);
  };

  const handleUpdateDetails = async () => {
    await toggleFreeTonight({
      isActive: true,
      timeWindow,
      dateType,
      area,
      note,
    });
    setIsEditingMyStatus(false);
  };

  const handleAskOut = (student: UserProfile) => {
    const conv = conversations.find((c) => c.participants.includes(student.id));
    if (conv) {
      setActiveChat(conv);
      setActiveTab('matches');
    } else {
      setIsDatePlannerOpen(true);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 text-ink">
      {/* Title & Introduction */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-sand border border-border-subtle text-terracotta text-xs font-serif italic mb-2.5">
          <Moon className="w-3.5 h-3.5" /> Spontaneous Evening Encounters
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-normal tracking-tight text-ink-heading">
          Free Tonight?
        </h2>
        <p className="text-xs sm:text-sm text-ink-muted mt-2 leading-relaxed">
          Skip days of endless texting. Signal that you are free for coffee, a courtyard stroll, or a study session tonight, and discover fellow students ready to connect.
        </p>
      </div>

      {/* User's Own Status Card */}
      <div className="bg-paper border border-border rounded-3xl p-6 sm:p-7 shadow-soft mb-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div className="flex items-center gap-3.5">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border transition ${
              currentUser?.freeTonight?.isActive 
                ? 'bg-terracotta text-white border-terracotta shadow-soft' 
                : 'bg-surface-sand text-ink-muted border-border'
            }`}>
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-serif font-normal text-ink-heading flex items-center gap-2">
                <span>Your Evening Signal:</span>
                <span className={`text-[11px] font-sans font-medium px-2.5 py-0.5 rounded-full border ${
                  currentUser?.freeTonight?.isActive
                    ? 'bg-surface text-campus-sage border-border'
                    : 'bg-surface-sand text-ink-muted border-border-subtle'
                }`}>
                  {currentUser?.freeTonight?.isActive ? 'Active Tonight' : 'Inactive'}
                </span>
              </h3>
              <p className="text-xs text-ink-muted mt-0.5">
                {currentUser?.freeTonight?.isActive
                  ? `${currentUser.freeTonight.dateType} · ${currentUser.freeTonight.timeWindow}`
                  : 'Turn on your signal to let peers know you are open to meeting up tonight.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {currentUser?.freeTonight?.isActive && (
              <button
                onClick={() => setIsEditingMyStatus(!isEditingMyStatus)}
                className="px-3.5 py-2 rounded-xl bg-surface hover:bg-surface-sand border border-border text-xs font-medium text-ink transition shadow-soft"
              >
                {isEditingMyStatus ? 'Close Editor' : 'Edit Details'}
              </button>
            )}

            <button
              onClick={handleToggleMyStatus}
              className={`px-5 py-2.5 rounded-xl text-xs font-medium transition shadow-soft ${
                currentUser?.freeTonight?.isActive
                  ? 'bg-surface hover:bg-surface-sand text-ink-muted border border-border'
                  : 'bg-terracotta hover:bg-terracotta-600 text-white'
              }`}
            >
              {currentUser?.freeTonight?.isActive ? 'Turn Off Signal' : "I'm Free Tonight"}
            </button>
          </div>
        </div>

        {/* Edit Details Drawer */}
        {isEditingMyStatus && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="pt-5 space-y-4"
          >
            {/* Date Type Selector */}
            <div>
              <label className="text-[11px] font-medium text-ink-heading uppercase tracking-wider block mb-2">
                What are you in the mood for?
              </label>
              <div className="flex flex-wrap gap-2">
                {DATE_TYPES.map((dt) => (
                  <button
                    key={dt.type}
                    onClick={() => setDateType(dt.type)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-medium border flex items-center gap-2 transition ${
                      dateType === dt.type
                        ? 'bg-terracotta text-white border-terracotta shadow-soft'
                        : 'bg-surface hover:bg-surface-sand text-ink border-border'
                    }`}
                  >
                    {dt.icon}
                    <span>{dt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Window & Meeting Area */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-medium text-ink-heading uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-terracotta" />
                  Time Window
                </label>
                <input
                  type="text"
                  value={timeWindow}
                  onChange={(e) => setTimeWindow(e.target.value)}
                  placeholder="e.g. Tonight 7:30 PM - 10:00 PM"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-xs text-ink placeholder-ink-faint focus:outline-none focus:border-terracotta transition"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-ink-heading uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-terracotta" />
                  Preferred Campus Area
                </label>
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-xs text-ink focus:outline-none focus:border-terracotta transition"
                >
                  {CAMPUS_AREAS.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Short Note */}
            <div>
              <label className="text-[11px] font-medium text-ink-heading uppercase tracking-wider block mb-1.5">
                Thought or context (e.g. &ldquo;Taking a breather after studio review!&rdquo;)
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Share a quick note..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-xs text-ink placeholder-ink-faint focus:outline-none focus:border-terracotta transition"
              />
            </div>

            <button
              onClick={handleUpdateDetails}
              className="px-5 py-2.5 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white font-medium text-xs transition shadow-soft"
            >
              Save Tonight&apos;s Signal
            </button>
          </motion.div>
        )}
      </div>

      {/* Other Students Free Tonight Section */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-serif font-normal text-ink-heading flex items-center gap-2.5">
            <span>Students Available Tonight</span>
            <span className="text-xs font-sans font-medium px-2.5 py-0.5 rounded-full bg-surface-sand border border-border-subtle text-ink-muted">
              {freeTonightProfiles.length} active
            </span>
          </h3>
        </div>

        {freeTonightProfiles.length === 0 ? (
          <div className="p-12 text-center bg-paper rounded-3xl border border-border text-ink-muted text-xs shadow-soft">
            <Moon className="w-7 h-7 mx-auto mb-2 text-ink-faint" />
            <p className="font-serif text-sm text-ink-heading">No other students marked for tonight yet</p>
            <p className="mt-1 max-w-sm mx-auto leading-relaxed">
              Activate your status above to inspire fellow students across your campus to step out.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {freeTonightProfiles.map((student) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-paper rounded-3xl overflow-hidden border border-border shadow-soft flex flex-col justify-between hover:shadow-hover transition duration-300 group"
              >
                <div>
                  {/* Photo & Date Type Banner */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-sand">
                    <img
                      src={student.photos[0]}
                      alt={student.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent" />

                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-paper/90 backdrop-blur-md text-[11px] font-medium text-terracotta border border-border-subtle shadow-soft flex items-center gap-1.5">
                      <Coffee className="w-3.5 h-3.5" />
                      <span>{student.freeTonight?.dateType}</span>
                    </div>

                    <div className="absolute bottom-3 left-3 text-white">
                      <h4 className="text-lg font-serif font-normal leading-tight flex items-center gap-1.5 text-white">
                        {student.name}, {student.age}
                        {student.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-campus-sage fill-current" />}
                      </h4>
                      <p className="text-[11px] text-paper/90 font-sans mt-0.5">
                        {student.major} · {student.campus}
                      </p>
                    </div>
                  </div>

                  {/* Plan Details */}
                  <div className="p-5 space-y-2.5 text-xs">
                    <div className="flex items-center gap-2 text-ink">
                      <Clock className="w-3.5 h-3.5 text-terracotta shrink-0" />
                      <span>{student.freeTonight?.timeWindow}</span>
                    </div>

                    <div className="flex items-center gap-2 text-ink-muted">
                      <MapPin className="w-3.5 h-3.5 text-campus-gold shrink-0" />
                      <span className="truncate">{student.freeTonight?.area}</span>
                    </div>

                    {student.freeTonight?.note && (
                      <p className="p-3 rounded-xl bg-surface-sand/70 text-xs text-ink font-serif italic border border-border-subtle mt-2 leading-relaxed">
                        &ldquo;{student.freeTonight.note}&rdquo;
                      </p>
                    )}
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="p-5 pt-0">
                  <button
                    onClick={() => handleAskOut(student)}
                    className="w-full py-2.5 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition shadow-soft"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Ask Out for Tonight</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
