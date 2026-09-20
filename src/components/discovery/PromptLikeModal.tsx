import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Heart, Send, X, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const PromptLikeModal: React.FC = () => {
  const { promptLikeTarget, setPromptLikeTarget, recordSwipe } = useApp();
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!promptLikeTarget) return null;

  const { targetProfile, promptQuestion, promptAnswer, photoUrl } = promptLikeTarget;

  const handleSend = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    await recordSwipe(targetProfile.id, 'like', {
      comment: comment.trim() || undefined,
      targetPrompt: promptQuestion,
      targetPromptAnswer: promptAnswer,
      targetPhoto: photoUrl,
    });
    setIsSubmitting(false);
    setPromptLikeTarget(null);
    setComment('');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="bg-paper border border-border rounded-3xl max-w-md w-full shadow-modal p-6 text-ink relative"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-surface-sand text-terracotta flex items-center justify-center border border-border-subtle">
                <Heart className="w-3.5 h-3.5 fill-terracotta" />
              </div>
              <h3 className="text-sm font-serif font-normal text-ink-heading">
                Like {targetProfile.name}&apos;s {photoUrl ? 'Photo' : 'Prompt'}
              </h3>
            </div>
            <button
              onClick={() => setPromptLikeTarget(null)}
              className="p-1.5 rounded-full text-ink-muted hover:text-ink hover:bg-surface-sand transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="py-4 space-y-4">
            {/* Target Preview */}
            {photoUrl ? (
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-surface border border-border">
                <img src={photoUrl} alt="Target" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-surface border border-border space-y-1.5 shadow-soft">
                <span className="text-[11px] font-sans font-medium text-terracotta uppercase tracking-wider block">
                  {promptQuestion}
                </span>
                <p className="text-sm font-serif text-ink-heading leading-relaxed italic">
                  &ldquo;{promptAnswer}&rdquo;
                </p>
              </div>
            )}

            {/* Comment input */}
            <div>
              <label className="text-[11px] font-medium text-ink-muted uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <MessageCircle className="w-3 h-3 text-terracotta" />
                Add an opening note (optional)
              </label>
              <textarea
                rows={2}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={`Say something thoughtful to ${targetProfile.name.split(' ')[0]}...`}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-xs text-ink placeholder-ink-faint focus:outline-none focus:border-terracotta transition"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <button
              onClick={() => setPromptLikeTarget(null)}
              className="text-xs text-ink-muted hover:text-ink font-medium transition"
            >
              Cancel
            </button>

            <button
              onClick={handleSend}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white font-medium text-xs transition shadow-soft flex items-center gap-1.5 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{comment.trim() ? 'Send Note & Like' : 'Send Like'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
