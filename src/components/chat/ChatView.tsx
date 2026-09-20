import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Send,
  Coffee,
  Sparkles,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  ChevronLeft,
  Shield,
  MoreVertical,
  Check,
  Flame,
  MessageSquare,
  Wand2,
  HeartHandshake,
  UserX,
  AlertTriangle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ChatView: React.FC = () => {
  const {
    currentUser,
    matches,
    conversations,
    activeChat,
    setActiveChat,
    sendMessage,
    updateDateStatus,
    setIsDatePlannerOpen,
    unmatch,
    reportUser,
    openAiModal,
    showToast,
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [showIcebreakers, setShowIcebreakers] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showReportConfirm, setShowReportConfirm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const ICEBREAKERS = [
    "What's your survival strategy for an 8 AM lecture on Monday? ☕",
    "Which campus mess/canteen has the best Maggi or coffee?",
    "If you could reserve one study spot permanently in the library, where would it be?",
    "Would you rather pull an all-nighter for a hackathon or a fest concert? 🎸",
    "What is the funniest campus rumor you heard this semester?",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeChat?.messages]);

  const handleSend = async () => {
    if (!inputMessage.trim()) return;
    const text = inputMessage.trim();
    setInputMessage('');
    setShowIcebreakers(false);
    await sendMessage(text, 'text');
  };

  const handleSendIcebreaker = async (question: string) => {
    setShowIcebreakers(false);
    await sendMessage(question, 'text');
  };

  const handleAiToneCheck = () => {
    const textToReview = inputMessage.trim() || "Hey, saw we matched! Would love to grab iced chai at the library cafe sometime.";
    openAiModal(textToReview, (improvedText) => {
      setInputMessage(improvedText);
      showToast('Message Refined', 'AI assistant enhanced your message tone', 'success');
    });
  };

  const handleUnmatch = async () => {
    if (!activeChat || !activeChat.otherUser) return;
    setShowOptionsMenu(false);
    await unmatch(activeChat.otherUser.id);
  };

  const handleReport = async () => {
    if (!activeChat || !activeChat.otherUser) return;
    setShowOptionsMenu(false);
    setShowReportConfirm(false);
    await reportUser(activeChat.otherUser.id, 'Safety concern or inappropriate behavior');
  };

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-6 h-[calc(100vh-120px)] flex flex-col">
      <div className="flex-1 bg-paper border border-border rounded-3xl overflow-hidden shadow-soft flex flex-col md:flex-row">
        {/* Left Sidebar: New Matches & Conversations List */}
        <div
          className={`w-full md:w-80 lg:w-96 border-r border-border flex flex-col bg-paper/70 ${
            activeChat ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Top Header */}
          <div className="p-4 border-b border-border">
            <h3 className="text-base font-serif font-normal text-ink-heading flex items-center justify-between">
              <span>Conversations</span>
              <span className="text-[11px] text-terracotta font-medium bg-surface-sand px-2.5 py-0.5 rounded-full border border-border-subtle">
                {matches.length} Matches
              </span>
            </h3>

            {/* Horizontal Match Avatars Tray */}
            {matches.length > 0 && (
              <div className="mt-3">
                <span className="text-[10px] uppercase font-medium text-ink-muted tracking-wider block mb-2">
                  New Mutual Sparks
                </span>
                <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
                  {matches.map((item) => (
                    <div
                      key={item.profile.id}
                      onClick={() => {
                        const conv = conversations.find((c) =>
                          c.participants.includes(item.profile.id)
                        );
                        if (conv) setActiveChat(conv);
                      }}
                      className="flex flex-col items-center gap-1 cursor-pointer group shrink-0"
                    >
                      <div className="relative">
                        <img
                          src={item.profile.photos[0]}
                          alt={item.profile.name}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-border group-hover:scale-105 transition shadow-soft"
                        />
                        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-campus-sage ring-2 ring-paper" />
                      </div>
                      <span className="text-[11px] font-sans font-medium text-ink-muted group-hover:text-ink truncate max-w-[56px]">
                        {item.profile.name.split(' ')[0]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto divide-y divide-border/60">
            {conversations.length === 0 ? (
              <div className="p-8 text-center text-ink-muted text-xs space-y-2">
                <MessageSquare className="w-7 h-7 text-ink-faint mx-auto mb-1 opacity-60" />
                <p className="font-serif text-sm text-ink-heading">No conversations yet</p>
                <p className="text-ink-muted">Comment on a prompt or swipe like on campus profiles to start chatting!</p>
              </div>
            ) : (
              conversations.map((conv) => {
                const other = conv.otherUser;
                const isSelected = activeChat?.id === conv.id;
                return (
                  <div
                    key={conv.id}
                    onClick={() => setActiveChat(conv)}
                    className={`p-3.5 sm:p-4 flex items-start gap-3 cursor-pointer transition ${
                      isSelected
                        ? 'bg-surface border-l-2 border-terracotta shadow-soft'
                        : 'hover:bg-surface-sand/50'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={other?.photos[0]}
                        alt={other?.name}
                        className="w-12 h-12 rounded-2xl object-cover ring-1 ring-border"
                      />
                      {other?.isVerified && (
                        <div className="w-3.5 h-3.5 rounded-full bg-campus-sage text-white flex items-center justify-center text-[9px] absolute -bottom-0.5 -right-0.5 ring-2 ring-paper">
                          ✓
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-serif font-medium text-ink-heading truncate flex items-center gap-1.5">
                          {other?.name}
                          <span className="text-[10px] text-terracotta font-sans font-medium bg-surface-sand px-1.5 py-0.2 rounded border border-border-subtle">
                            {conv.compatibilityScore || 94}% match
                          </span>
                        </h4>
                        <span className="text-[10px] text-ink-muted shrink-0">
                          {conv.lastMessageTimestamp}
                        </span>
                      </div>

                      <p className="text-[11px] text-ink-muted truncate mt-0.5">
                        {other?.major} · {other?.campus}
                      </p>

                      <p className={`text-xs truncate mt-1 ${conv.unread ? 'font-medium text-ink-heading' : 'text-ink-muted'}`}>
                        {conv.lastMessage}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Pane: Active Conversation Window */}
        {activeChat ? (
          <div className="flex-1 flex flex-col bg-paper">
            {/* Chat Top Bar */}
            <div className="p-3.5 sm:p-4 border-b border-border flex items-center justify-between gap-3 bg-surface/80 backdrop-blur-sm">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => setActiveChat(null)}
                  className="md:hidden p-1.5 rounded-xl hover:bg-surface-sand text-ink-muted transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="relative shrink-0">
                  <img
                    src={activeChat.otherUser?.photos[0]}
                    alt={activeChat.otherUser?.name}
                    className="w-10 h-10 rounded-2xl object-cover ring-1 ring-border"
                  />
                  <span className="w-2.5 h-2.5 rounded-full bg-campus-sage ring-2 ring-surface absolute bottom-0 right-0" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-serif font-medium text-ink-heading truncate">
                      {activeChat.otherUser?.name}, {activeChat.otherUser?.age}
                    </h4>
                    {activeChat.otherUser?.isVerified && (
                      <span className="text-[10px] bg-surface-sand text-campus-sage font-medium px-2 py-0.5 rounded border border-border-subtle">
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-ink-muted truncate">
                    {activeChat.otherUser?.major} · {activeChat.otherUser?.campus}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 relative">
                <button
                  onClick={() => setIsDatePlannerOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-surface hover:bg-surface-sand text-ink border border-border text-xs font-medium flex items-center gap-1.5 transition shadow-soft"
                  title="Suggest campus date"
                >
                  <Coffee className="w-3.5 h-3.5 text-terracotta" />
                  <span className="hidden sm:inline">Propose Campus Date</span>
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShowOptionsMenu(!showOptionsMenu)}
                    className="p-2 rounded-xl hover:bg-surface-sand text-ink-muted hover:text-ink transition"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {showOptionsMenu && (
                    <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-paper border border-border shadow-modal p-1.5 z-30 text-xs space-y-1">
                      <button
                        onClick={handleUnmatch}
                        className="w-full text-left px-3 py-2 rounded-xl text-ink-muted hover:text-ink hover:bg-surface-sand flex items-center gap-2 font-medium transition"
                      >
                        <UserX className="w-4 h-4 text-ink-muted" />
                        Unmatch Student
                      </button>
                      <button
                        onClick={() => {
                          setShowOptionsMenu(false);
                          setShowReportConfirm(true);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium transition"
                      >
                        <Shield className="w-4 h-4 text-rose-500" />
                        Report &amp; Block Profile
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {/* Campus Intro banner */}
              <div className="p-3 rounded-2xl bg-surface-sand/80 border border-border text-center max-w-md mx-auto text-xs text-ink shadow-soft">
                <Flame className="w-3.5 h-3.5 text-terracotta mx-auto mb-1 inline" /> Matched on{' '}
                <strong className="text-ink-heading font-medium">{activeChat.otherUser?.campus}</strong> · Verified Student
              </div>

              {activeChat.messages.map((msg) => {
                const isMe = msg.senderId === currentUser?.id;

                // Prompt comment snippet
                if (msg.promptCommentData) {
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div className="max-w-[85%] sm:max-w-[70%] p-4 rounded-2xl bg-surface border border-border shadow-soft space-y-2">
                        <div className="text-[11px] font-medium text-terracotta flex items-center gap-1 uppercase tracking-wider">
                          <Sparkles className="w-3 h-3" /> Replied to Prompt
                        </div>
                        {msg.promptCommentData.promptQuestion && (
                          <div className="p-3 rounded-xl bg-surface-sand/60 border border-border-subtle text-xs">
                            <span className="font-sans font-medium text-ink-heading block">{msg.promptCommentData.promptQuestion}</span>
                            <span className="text-ink-muted text-xs font-serif italic mt-0.5 block">&ldquo;{msg.promptCommentData.promptAnswer}&rdquo;</span>
                          </div>
                        )}
                        <p className="text-xs text-ink leading-relaxed font-normal">
                          {msg.promptCommentData.comment}
                        </p>
                      </div>
                      <span className="text-[10px] text-ink-muted mt-1 px-1">
                        {msg.timestamp}
                      </span>
                    </div>
                  );
                }

                // Date proposal message format
                if (msg.type === 'date_proposal' || msg.datePlanId) {
                  const plan = activeChat.datePlans?.find((p) => p.id === msg.datePlanId);
                  const isAccepted = plan?.status === 'accepted' || plan?.status === 'confirmed';

                  return (
                    <div key={msg.id} className="flex justify-center my-3">
                      <div className="max-w-md w-full p-5 rounded-2xl bg-surface border border-border shadow-soft space-y-3">
                        <div className="flex items-center justify-between text-xs font-serif font-medium text-ink-heading">
                          <span className="flex items-center gap-1.5">
                            <Coffee className="w-4 h-4 text-terracotta" />
                            Campus Safe Date Invitation
                          </span>
                          {plan && (
                            <span className="text-[10px] font-sans px-2.5 py-0.5 rounded-full bg-surface-sand text-terracotta border border-border-subtle uppercase tracking-wider font-medium">
                              {plan.status}
                            </span>
                          )}
                        </div>

                        <div className="p-3 rounded-xl bg-surface-sand/70 border border-border-subtle space-y-1.5 text-xs">
                          <div className="flex items-center gap-2 text-ink font-medium">
                            <MapPin className="w-4 h-4 text-terracotta shrink-0" />
                            <span>{plan?.venueName || 'Campus Spot'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-ink-muted">
                            <Clock className="w-4 h-4 text-campus-gold shrink-0" />
                            <span>{plan?.dateTime || 'Scheduled Time'}</span>
                          </div>
                        </div>

                        {/* Status / Actions */}
                        {isAccepted ? (
                          <div className="p-2.5 rounded-xl bg-surface-sand border border-border text-campus-sage font-medium text-xs flex items-center justify-center gap-1.5">
                            <Check className="w-4 h-4 text-campus-sage" />
                            Campus Meetup Confirmed! Have fun!
                          </div>
                        ) : plan && plan.recipientId === currentUser?.id ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateDateStatus(plan.id, 'accepted')}
                              className="flex-1 py-2 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white font-medium text-xs shadow-soft transition flex items-center justify-center gap-1.5"
                            >
                              <Check className="w-4 h-4" />
                              Accept Date
                            </button>
                            <button
                              onClick={() => updateDateStatus(plan.id, 'cancelled')}
                              className="py-2 px-3 rounded-xl bg-surface hover:bg-surface-sand text-ink-muted border border-border text-xs font-medium transition"
                            >
                              Reschedule
                            </button>
                          </div>
                        ) : (
                          <p className="text-[11px] text-ink-muted italic text-center">
                            Date invitation sent. Waiting for partner response...
                          </p>
                        )}
                      </div>
                    </div>
                  );
                }

                // Regular chat message bubble
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[80%] sm:max-w-[70%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                        isMe
                          ? 'bg-terracotta text-white rounded-tr-none shadow-soft font-normal'
                          : 'bg-surface text-ink rounded-tl-none border border-border shadow-soft font-normal'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-ink-muted mt-1 px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Icebreaker drawer popover */}
            {showIcebreakers && (
              <div className="p-3.5 bg-surface border-t border-border space-y-2 shadow-soft">
                <span className="text-[11px] font-medium text-terracotta flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Campus Conversation Starters:
                </span>
                <div className="flex flex-wrap gap-2">
                  {ICEBREAKERS.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendIcebreaker(prompt)}
                      className="px-3 py-1.5 rounded-xl bg-surface hover:bg-surface-sand text-ink text-xs text-left transition border border-border shadow-soft"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Chat Input Bar */}
            <div className="p-3 sm:p-4 border-t border-border bg-surface/80 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                {/* Icebreaker button */}
                <button
                  onClick={() => setShowIcebreakers(!showIcebreakers)}
                  className={`p-2.5 rounded-xl border transition ${
                    showIcebreakers
                      ? 'bg-surface-sand border-terracotta text-terracotta'
                      : 'bg-surface border-border text-ink-muted hover:text-ink hover:bg-surface-sand'
                  }`}
                  title="Campus Icebreaker Prompts"
                >
                  <Sparkles className="w-4 h-4" />
                </button>

                {/* AI Assistant Wand */}
                <button
                  onClick={handleAiToneCheck}
                  className="p-2.5 rounded-xl bg-surface-sand hover:bg-surface border border-border text-ink hover:text-ink-heading transition flex items-center gap-1.5 text-xs font-medium shadow-soft"
                  title="AI Grammar & Tone Assistant"
                >
                  <Wand2 className="w-3.5 h-3.5 text-terracotta" />
                  <span className="hidden sm:inline text-[11px]">AI Tone</span>
                </button>

                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type a message or college reference..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-surface border border-border text-xs text-ink placeholder-ink-faint focus:outline-none focus:border-terracotta transition"
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />

                <button
                  onClick={handleSend}
                  disabled={!inputMessage.trim()}
                  className="p-2.5 rounded-xl bg-terracotta hover:bg-terracotta-600 disabled:opacity-40 text-white transition shadow-soft active:scale-95"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Empty Chat Selection Screen (Desktop) */
          <div className="hidden md:flex flex-1 flex-col items-center justify-center p-8 text-center bg-paper">
            <div className="w-14 h-14 rounded-2xl bg-surface-sand border border-border flex items-center justify-center text-terracotta mb-4 shadow-soft">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-serif font-normal text-ink-heading">Campus Conversations</h3>
            <p className="text-xs text-ink-muted max-w-sm mt-1.5 leading-relaxed">
              Select a matched student to chat, refine your opener with the AI tone assistant, or propose a safe campus coffee date.
            </p>
          </div>
        )}
      </div>

      {/* Safety Report Dialog */}
      <AnimatePresence>
        {showReportConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-paper border border-border rounded-3xl max-w-md w-full p-6 space-y-4 shadow-modal"
            >
              <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-serif font-normal text-ink-heading">Report &amp; Block Profile</h3>
                <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                  Are you sure you want to block {activeChat?.otherUser?.name}? They will not be able to contact you, your chat history will be removed, and our campus moderation team will review this report.
                </p>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowReportConfirm(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-ink-muted hover:text-ink transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReport}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium shadow-soft transition"
                >
                  Block &amp; Submit Report
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
