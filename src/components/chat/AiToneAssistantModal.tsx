import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { ToneType } from '../../types';
import { Sparkles, Check, X, Wand2, ShieldCheck, ArrowRight, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AiToneAssistantModal: React.FC = () => {
  const { isAiModalOpen, aiModalInitialText, closeAiModal, aiAcceptCallback, showToast } = useApp();

  const [currentText, setCurrentText] = useState('');
  const [suggestedText, setSuggestedText] = useState('');
  const [rationale, setRationale] = useState('');
  const [selectedMode, setSelectedMode] = useState<'grammar' | ToneType>('friendly');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAiModalOpen) {
      setCurrentText(aiModalInitialText);
      setSuggestedText('');
      setRationale('');
      if (aiModalInitialText.trim()) {
        runEnhancement(aiModalInitialText, 'friendly');
      }
    }
  }, [isAiModalOpen, aiModalInitialText]);

  const runEnhancement = async (text: string, mode: 'grammar' | ToneType) => {
    if (!text.trim()) return;
    setIsLoading(true);
    try {
      if (mode === 'grammar') {
        const res = await api.checkGrammar(text);
        if (res.success && res.result) {
          setSuggestedText(res.result.corrected);
          setRationale(
            res.result.wasCorrected
              ? `Fixed ${res.result.corrections.length} grammar/spelling issues.`
              : 'Grammar and spelling look clean!'
          );
        }
      } else {
        const res = await api.adjustTone(text, mode);
        if (res.success && res.result) {
          setSuggestedText(res.result.improved);
          setRationale(res.result.rationale);
        }
      }
    } catch {
      showToast('AI Service', 'Could not process tone check', 'alert');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectMode = (mode: 'grammar' | ToneType) => {
    setSelectedMode(mode);
    runEnhancement(currentText, mode);
  };

  const handleAccept = () => {
    const textToUse = suggestedText || currentText;
    if (aiAcceptCallback) {
      aiAcceptCallback(textToUse);
    }
    showToast('Tone Applied', 'Updated your chat draft.', 'info');
    closeAiModal();
  };

  if (!isAiModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="bg-paper border border-border rounded-3xl max-w-lg w-full shadow-modal p-6 text-ink relative overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-surface-sand text-terracotta flex items-center justify-center border border-border-subtle">
                <Wand2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-serif font-normal text-ink-heading">Campus Tone Assistant</h3>
                <p className="text-[11px] text-ink-muted">Clarity, warmth, and conversation flow</p>
              </div>
            </div>
            <button
              onClick={closeAiModal}
              className="p-1.5 rounded-full hover:bg-surface-sand text-ink-muted hover:text-ink transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="py-4 space-y-4">
            {/* Tone Selector Tabs */}
            <div>
              <label className="text-[11px] font-medium text-ink-heading uppercase tracking-wider block mb-2">
                Choose Refinement Style
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'grammar', label: 'Check Polish' },
                  { id: 'friendly', label: 'Warm & Friendly' },
                  { id: 'confident', label: 'Confident' },
                  { id: 'natural', label: 'Campus Natural' },
                  { id: 'less_awkward', label: 'Less Awkward' },
                  { id: 'concise', label: 'Concise' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelectMode(item.id as 'grammar' | ToneType)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition border ${
                      selectedMode === item.id
                        ? 'bg-terracotta text-white border-terracotta shadow-soft'
                        : 'bg-surface hover:bg-surface-sand text-ink border-border'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Original Draft Box */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-medium text-ink-heading uppercase tracking-wider">Original Message</span>
                <span className="text-[10px] text-ink-faint">Editable</span>
              </div>
              <textarea
                rows={2}
                value={currentText}
                onChange={(e) => setCurrentText(e.target.value)}
                placeholder="Type or paste your message here..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-xs text-ink placeholder-ink-faint focus:outline-none focus:border-terracotta transition"
              />
            </div>

            {/* Suggested Version */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-medium text-terracotta uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> AI Suggestion
                </span>
                {isLoading && <span className="text-[10px] text-terracotta animate-pulse">Refining tone...</span>}
              </div>

              <div className="p-3.5 rounded-xl bg-surface border border-border text-xs text-ink leading-relaxed min-h-[60px] flex items-center shadow-soft">
                {isLoading ? (
                  <div className="flex items-center gap-2 text-ink-muted text-xs">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-terracotta" /> Polishing suggestion...
                  </div>
                ) : (
                  <textarea
                    rows={2}
                    value={suggestedText || currentText}
                    onChange={(e) => setSuggestedText(e.target.value)}
                    className="w-full bg-transparent border-none text-xs text-ink-heading font-serif italic focus:outline-none resize-none"
                  />
                )}
              </div>

              {rationale && (
                <p className="text-[11px] text-ink-muted mt-1.5 italic leading-relaxed">
                  &ldquo;{rationale}&rdquo;
                </p>
              )}
            </div>

            {/* Privacy notice */}
            <div className="p-2.5 rounded-xl bg-surface-sand border border-border-subtle flex items-center gap-2 text-[11px] text-ink-muted">
              <ShieldCheck className="w-4 h-4 text-campus-sage shrink-0" />
              <span>
                Zero log retention: Message refinement runs in-memory and is never stored on campus databases.
              </span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <button
              onClick={closeAiModal}
              className="text-xs text-ink-muted hover:text-ink font-medium px-2 py-1 transition"
            >
              Dismiss
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleAccept}
                disabled={isLoading || (!suggestedText && !currentText)}
                className="px-5 py-2.5 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white font-medium text-xs transition shadow-soft flex items-center gap-1.5 disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>Accept &amp; Use in Chat</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
