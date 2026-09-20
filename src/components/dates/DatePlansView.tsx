import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DatePlan } from '../../types';
import {
  Calendar,
  Clock,
  MapPin,
  Coffee,
  CheckCircle2,
  XCircle,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  HeartHandshake,
  Check,
  RotateCcw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const DatePlansView: React.FC = () => {
  const {
    currentUser,
    datePlans,
    updateDateStatus,
    setActiveChat,
    conversations,
    setActiveTab,
    setIsDatePlannerOpen,
  } = useApp();

  const [filterStatus, setFilterStatus] = useState<'all' | 'upcoming' | 'pending' | 'past'>('all');

  const filteredPlans = datePlans.filter((plan) => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'pending') return plan.status === 'pending' || plan.status === 'suggested';
    if (filterStatus === 'upcoming') return plan.status === 'accepted' || plan.status === 'confirmed';
    if (filterStatus === 'past') return plan.status === 'completed' || plan.status === 'cancelled';
    return true;
  });

  const getStatusBadge = (status: DatePlan['status']) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-sans font-medium bg-surface-sand text-ink border border-border-subtle flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-terracotta" />
            Invitation Pending
          </span>
        );
      case 'suggested':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-sans font-medium bg-surface-sand text-terracotta border border-border-subtle flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-terracotta" />
            Suggested Spot
          </span>
        );
      case 'accepted':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-sans font-medium bg-surface-sand text-campus-sage border border-border-subtle flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-campus-sage" />
            Date Accepted
          </span>
        );
      case 'confirmed':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-sans font-medium bg-surface-sand text-terracotta border border-border-subtle flex items-center gap-1.5">
            <HeartHandshake className="w-3 h-3 text-terracotta" />
            Both Confirmed
          </span>
        );
      case 'completed':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-sans font-medium bg-surface-sand text-ink-muted border border-border-subtle flex items-center gap-1.5">
            <Check className="w-3 h-3 text-ink-muted" />
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-sans font-medium bg-surface-sand text-ink-faint border border-border-subtle flex items-center gap-1.5">
            <XCircle className="w-3 h-3 text-ink-muted" />
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  const handleOpenChat = (partnerId?: string) => {
    if (!partnerId) return;
    const conv = conversations.find((c) => c.participants.includes(partnerId));
    if (conv) {
      setActiveChat(conv);
      setActiveTab('matches');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-surface-sand text-terracotta border border-border-subtle">
              Campus Encounters
            </span>
            <span className="text-xs text-ink-muted">Public, verified collegiate spaces</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-normal text-ink-heading tracking-tight">
            Date Plans &amp; Invitations
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted mt-1 leading-relaxed">
            Coordinate verified coffee meetups, library study dates, and evening walks with mutual matches.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-surface-sand rounded-xl border border-border-subtle self-start sm:self-auto">
          {(
            [
              { id: 'all', label: 'All' },
              { id: 'upcoming', label: 'Confirmed' },
              { id: 'pending', label: 'Pending' },
              { id: 'past', label: 'Past' },
            ] as const
          ).map((filter) => (
            <button
              key={filter.id}
              onClick={() => setFilterStatus(filter.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                filterStatus === filter.id
                  ? 'bg-surface text-ink-heading shadow-soft border border-border'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Safety Banner */}
      <div className="p-4 rounded-2xl bg-surface-sand/80 border border-border flex items-start gap-3.5 text-ink shadow-soft">
        <div className="p-2 rounded-xl bg-surface text-terracotta shadow-soft shrink-0 border border-border">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="text-xs sm:text-sm">
          <p className="font-serif font-medium text-ink-heading">Campus Safety Guarantee</p>
          <p className="text-ink-muted text-xs mt-0.5 leading-relaxed">
            Every suggested date spot is monitored by campus security, located in daylight or well-lit high-traffic student hubs.
            Never feel pressured — reschedule or cancel anytime with zero penalty.
          </p>
        </div>
      </div>

      {/* Date Plans List */}
      {filteredPlans.length === 0 ? (
        <div className="p-12 text-center bg-paper rounded-3xl border border-border shadow-soft space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-surface-sand border border-border text-terracotta flex items-center justify-center mx-auto shadow-soft">
            <Coffee className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-serif font-normal text-ink-heading">No Date Plans Yet</h3>
            <p className="text-xs sm:text-sm text-ink-muted max-w-sm mx-auto mt-1 leading-relaxed">
              When you or your matches invite each other to a campus spot, your upcoming plans and confirmation status will live here.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('matches')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white font-medium text-xs transition shadow-soft"
          >
            <MessageSquare className="w-4 h-4" />
            Open Matches &amp; Propose a Date
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filteredPlans.map((plan) => {
              const isInitiator = plan.initiatorId === currentUser?.id;
              const other = plan.otherUser;

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="p-5 sm:p-6 rounded-3xl bg-paper border border-border shadow-soft hover:shadow-hover transition duration-200 space-y-4"
                >
                  {/* Top Bar: Partner Details + Status */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={other?.photos[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'}
                          alt={other?.name}
                          className="w-12 h-12 rounded-2xl object-cover ring-1 ring-border shadow-soft"
                        />
                        {other?.isVerified && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-campus-sage text-white flex items-center justify-center text-[10px] ring-2 ring-paper">
                            ✓
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-serif font-medium text-ink-heading">
                            {other?.name || 'Campus Match'}
                          </h3>
                          <span className="text-xs text-ink-muted">
                            {other?.age ? `· ${other.age}` : ''}
                          </span>
                        </div>
                        <p className="text-xs text-ink-muted">
                          {other?.major || 'Student'} · {other?.campus || 'Campus'}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {getStatusBadge(plan.status)}
                    </div>
                  </div>

                  {/* Venue & Time Card */}
                  <div className="p-4 rounded-2xl bg-surface border border-border grid grid-cols-1 sm:grid-cols-2 gap-3 shadow-soft">
                    <div className="flex items-start gap-2.5">
                      <div className="p-2 rounded-xl bg-surface-sand text-terracotta shrink-0 border border-border-subtle">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-sans font-medium uppercase tracking-wider text-ink-muted block">
                          Meetup Spot
                        </span>
                        <p className="text-xs sm:text-sm font-serif font-medium text-ink-heading mt-0.5">
                          {plan.venueName}
                        </p>
                        <span className="text-[11px] text-terracotta font-sans font-medium">
                          {plan.venueType || 'Verified Campus Location'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <div className="p-2 rounded-xl bg-surface-sand text-campus-gold shrink-0 border border-border-subtle">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-sans font-medium uppercase tracking-wider text-ink-muted block">
                          Scheduled Time
                        </span>
                        <p className="text-xs sm:text-sm font-serif font-medium text-ink-heading mt-0.5">
                          {plan.dateTime}
                        </p>
                        <span className="text-[11px] text-ink-muted">
                          {isInitiator ? 'Suggested by you' : `Suggested by ${other?.name || 'match'}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Notes / Special Request */}
                  {plan.notes && (
                    <p className="text-xs text-ink bg-surface-sand/70 p-3 rounded-xl border border-border-subtle font-serif italic">
                      &ldquo;{plan.notes}&rdquo;
                    </p>
                  )}

                  {/* Action Buttons based on status */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-border">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenChat(other?.id)}
                        className="px-3.5 py-2 rounded-xl bg-surface hover:bg-surface-sand text-ink border border-border text-xs font-medium flex items-center gap-1.5 transition shadow-soft"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-terracotta" />
                        Chat with {other?.name?.split(' ')[0] || 'Partner'}
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* If pending and user is recipient */}
                      {!isInitiator && (plan.status === 'pending' || plan.status === 'suggested') && (
                        <>
                          <button
                            onClick={() => updateDateStatus(plan.id, 'cancelled')}
                            className="px-3 py-2 rounded-xl hover:bg-surface-sand text-ink-muted hover:text-ink text-xs font-medium transition"
                          >
                            Reschedule
                          </button>
                          <button
                            onClick={() => updateDateStatus(plan.id, 'accepted')}
                            className="px-4 py-2 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white text-xs font-medium flex items-center gap-1.5 shadow-soft transition"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Accept Date
                          </button>
                        </>
                      )}

                      {/* If user is initiator and still pending */}
                      {isInitiator && (plan.status === 'pending' || plan.status === 'suggested') && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-ink-muted italic">
                            Waiting for {other?.name?.split(' ')[0] || 'partner'} to accept...
                          </span>
                          <button
                            onClick={() => updateDateStatus(plan.id, 'cancelled')}
                            className="px-2.5 py-1.5 rounded-lg text-xs text-ink-muted hover:text-ink transition"
                          >
                            Cancel
                          </button>
                        </div>
                      )}

                      {/* If accepted, both can confirm attendance */}
                      {plan.status === 'accepted' && (
                        <>
                          <button
                            onClick={() => updateDateStatus(plan.id, 'cancelled')}
                            className="px-3 py-2 rounded-xl text-ink-muted hover:text-ink text-xs font-medium transition"
                          >
                            Cancel Plan
                          </button>
                          <button
                            onClick={() => updateDateStatus(plan.id, 'confirmed')}
                            className="px-4 py-2 rounded-xl bg-campus-sage hover:bg-emerald-700 text-white text-xs font-medium flex items-center gap-1.5 shadow-soft transition"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Confirm I&apos;m Going
                          </button>
                        </>
                      )}

                      {/* If confirmed, can mark completed */}
                      {plan.status === 'confirmed' && (
                        <button
                          onClick={() => updateDateStatus(plan.id, 'completed')}
                          className="px-4 py-2 rounded-xl bg-surface hover:bg-surface-sand text-ink border border-border text-xs font-medium flex items-center gap-1.5 transition shadow-soft"
                        >
                          <Check className="w-3.5 h-3.5 text-campus-sage" />
                          Mark as Completed
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
