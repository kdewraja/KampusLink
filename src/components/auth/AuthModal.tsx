import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, setIsOnboardingOpen, login, showToast } = useApp();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Please provide both your university email and password.');
      return;
    }

    if (mode === 'signup') {
      // Transition to full multi-step onboarding wizard
      setIsAuthModalOpen(false);
      setIsOnboardingOpen(true);
      return;
    }

    setIsLoading(true);
    const success = await login(email.trim(), password.trim());
    setIsLoading(false);

    if (!success) {
      setError('We could not verify those credentials. You can use the quick student sign-in below.');
    }
  };

  const handleQuickLogin = async (demoEmail: string) => {
    setIsLoading(true);
    setError(null);
    await login(demoEmail, 'password123');
    setIsLoading(false);
  };

  const handleForgotPassword = () => {
    showToast('Reset Link Dispatched', 'A recovery link was sent to your registered college email.', 'info');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-ink-heading/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-4xl w-full rounded-3xl sm:rounded-4xl overflow-hidden bg-surface border border-border shadow-modal grid grid-cols-1 md:grid-cols-12 min-h-[540px] text-ink select-none"
        >
          {/* Close button */}
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-surface/80 hover:bg-surface-elevated text-ink-muted hover:text-ink transition border border-border"
            aria-label="Close Authentication"
          >
            <X className="w-4 h-4" />
          </button>

          {/* ================= LEFT PANEL: EDITORIAL IMAGERY & STATEMENT ================= */}
          <div className="hidden md:flex md:col-span-5 relative bg-surface-sand p-8 flex-col justify-between overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80"
              alt="Editorial College Portrait"
              className="absolute inset-0 w-full h-full object-cover grayscale-[25%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-heading/90 via-ink-heading/40 to-ink-heading/20" />

            {/* Top Brand Mark */}
            <div className="relative z-10">
              <span className="font-serif font-bold text-lg text-white tracking-tight">
                Kampu$Link
              </span>
            </div>

            {/* Bottom Statement */}
            <div className="relative z-10 text-white space-y-2">
              <p className="font-serif text-xl font-medium leading-snug text-white">
                &ldquo;Where college connections start with genuine conversation.&rdquo;
              </p>
              <span className="text-[11px] text-white/70 uppercase tracking-wider block">
                Exclusive Institutional Network
              </span>
            </div>
          </div>

          {/* ================= RIGHT PANEL: ELEGANT AUTHENTICATION FORM ================= */}
          <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-between bg-surface">
            <div>
              {/* Header Title */}
              <div className="mb-6">
                <span className="text-[11px] font-bold uppercase tracking-widest text-terracotta-700 bg-terracotta-50 px-2.5 py-0.5 rounded-full border border-terracotta-200 inline-block mb-2">
                  Student Verification
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-ink-heading">
                  {mode === 'signin' ? 'Welcome back' : 'Join Kampu$Link'}
                </h2>
                <p className="text-xs sm:text-sm text-ink-muted mt-1">
                  {mode === 'signin'
                    ? 'Enter your university credentials to access your campus stack.'
                    : 'Create your verified student profile and start talking.'}
                </p>
              </div>

              {/* Mode Toggle (Sign In / Register) */}
              <div className="flex rounded-full bg-paper p-1 border border-border mb-5">
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className={`flex-1 py-1.5 rounded-full text-xs font-semibold transition ${
                    mode === 'signin'
                      ? 'bg-surface text-ink-heading shadow-soft'
                      : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className={`flex-1 py-1.5 rounded-full text-xs font-semibold transition ${
                    mode === 'signup'
                      ? 'bg-surface text-ink-heading shadow-soft'
                      : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* Error Message banner */}
              {error && (
                <div className="p-3 mb-4 rounded-2xl bg-terracotta-50 border border-terracotta-200 text-xs text-terracotta-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-terracotta-600 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-ink-heading uppercase tracking-wider block mb-1.5">
                    University Email (.edu / .ac.in)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-ink-muted absolute left-3.5 top-3" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@campus.edu"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-paper border border-border text-xs text-ink-heading placeholder-ink-muted focus:outline-none focus:border-terracotta-600 transition"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-bold text-ink-heading uppercase tracking-wider">
                      Password
                    </label>
                    {mode === 'signin' && (
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-[11px] text-terracotta-700 hover:text-terracotta-800 font-medium"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-ink-muted absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-paper border border-border text-xs text-ink-heading placeholder-ink-muted focus:outline-none focus:border-terracotta-600 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-ink-muted hover:text-ink"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-full bg-terracotta-600 hover:bg-terracotta-700 text-surface font-semibold text-xs transition shadow-soft flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading
                    ? 'Authenticating...'
                    : mode === 'signin'
                    ? 'Sign In to Kampu$Link'
                    : 'Proceed to Profile Setup'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Quick Demo Sign-in for Instant Verification */}
            <div className="pt-6 mt-6 border-t border-border">
              <span className="text-[10px] font-bold text-ink-muted uppercase tracking-wider block mb-2 text-center">
                Fast Review · Verified Demo Accounts
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('aarav.sharma@iitd.ac.in')}
                  className="p-2.5 rounded-xl bg-paper hover:bg-surface-sand border border-border text-left transition text-xs"
                >
                  <div className="font-bold text-ink-heading truncate">Aarav Sharma</div>
                  <div className="text-[10px] text-ink-muted truncate">B.Tech CS · Class of &apos;26</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('rhea.sengupta@iitd.ac.in')}
                  className="p-2.5 rounded-xl bg-paper hover:bg-surface-sand border border-border text-left transition text-xs"
                >
                  <div className="font-bold text-ink-heading truncate">Rhea Sen</div>
                  <div className="text-[10px] text-ink-muted truncate">Design &amp; HCI · Class of &apos;27</div>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
