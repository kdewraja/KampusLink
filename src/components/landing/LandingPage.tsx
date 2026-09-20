import React from 'react';
import { useApp } from '../../context/AppContext';
import { KampusLinkHero3D, Hero3DFallback } from '../three/KampusLinkHero3D';
import {
  ArrowRight,
  Coffee,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  MessageSquare,
  Wand2,
  Lock,
  Compass,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const LandingPage: React.FC = () => {
  const { setActiveTab, setIsOnboardingOpen, setIsAuthModalOpen, isAuthenticated } = useApp();

  return (
    <div className="w-full text-ink bg-paper overflow-hidden">
      {/* ================= 01 — HERO ================= */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Editorial Headline & Minimal Action */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-terracotta-700 bg-terracotta-50 px-3 py-1 rounded-full border border-terracotta-200 inline-block">
              Modern College Romance
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-ink-heading leading-[1.12]">
              Dating made for <br />
              <span className="italic font-normal text-terracotta-700">conversation,</span> not catalog browsing.
            </h1>

            <p className="text-base sm:text-lg text-ink-muted max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Most dating apps feel like a retail catalog. Kampu$Link pairs the swift rhythm of swiping with the depth of editorial prompts, spontaneous same-night coffee dates, and an intelligent writing assistant.
            </p>

            {/* Clear Primary & Secondary CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => setActiveTab('discover')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-terracotta-600 hover:bg-terracotta-700 text-surface font-semibold text-xs transition shadow-soft hover:shadow-hover flex items-center justify-center gap-2 active:scale-98"
              >
                <span>Explore Campus Stack</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  if (isAuthenticated) {
                    setActiveTab('free_tonight');
                  } else {
                    setIsAuthModalOpen(true);
                  }
                }}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-surface hover:bg-surface-elevated text-ink-heading border border-border text-xs font-semibold transition shadow-soft flex items-center justify-center gap-2"
              >
                <Clock className="w-4 h-4 text-amber-600" />
                <span>See Who&apos;s Free Tonight</span>
              </button>
            </div>

            {/* Subtle trust markers */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-ink-muted">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-campus-sage" />
                Verified collegiate network
              </span>
              <span className="flex items-center gap-1.5">
                <Coffee className="w-4 h-4 text-terracotta-600" />
                Public campus meetup spots
              </span>
            </div>
          </div>

          {/* Right Column: Refined Editorial Profile Card Preview */}
          <div className="lg:col-span-5 flex justify-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-sm rounded-3xl overflow-hidden bg-surface border border-border shadow-modal"
            >
              <div className="relative aspect-[4/5] bg-surface-sand overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
                  alt="Rhea Sen"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-heading/85 via-ink-heading/15 to-transparent" />

                {/* Quiet Verified Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-surface/90 text-ink-heading text-[11px] font-semibold border border-border backdrop-blur-md flex items-center gap-1 shadow-soft">
                    <CheckCircle2 className="w-3.5 h-3.5 text-campus-sage" />
                    IIT Bombay · Verified
                  </span>
                </div>

                {/* Name & Subtitle */}
                <div className="absolute bottom-4 inset-x-4 text-white space-y-1">
                  <h3 className="text-2xl font-serif font-bold text-white">Rhea Sen, 20</h3>
                  <p className="text-xs text-white/80 font-medium">Design &amp; HCI · Class of &apos;27</p>
                  <p className="text-[11px] text-white/60">Dating &amp; Romance · Chai over coffee</p>
                </div>
              </div>

              {/* Hinge-style Prompt Snippet */}
              <div className="p-4 bg-surface border-t border-border flex items-center justify-between gap-3">
                <div className="text-xs text-ink-muted min-w-0">
                  <span className="font-semibold text-ink-heading block truncate">My favorite campus escape</span>
                  <span className="italic text-[11px] truncate block">&ldquo;Library courtyard under the jacaranda trees&rdquo;</span>
                </div>
                <button
                  onClick={() => setActiveTab('discover')}
                  className="px-3.5 py-1.5 rounded-full bg-terracotta-50 hover:bg-terracotta-100 text-terracotta-700 text-xs font-semibold border border-terracotta-200 transition shrink-0"
                >
                  Reply
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= 02 — THE DIFFERENCE ================= */}
      <section className="py-20 bg-surface border-y border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-16">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-ink-muted">
              Why Kampu$Link
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-ink-heading tracking-tight">
              A dating app designed to be deleted after midterms.
            </h2>
            <p className="text-sm text-ink-muted leading-relaxed">
              We asked students why modern dating apps feel draining. The answers were universal: too many strangers with nothing to say, weeks of circular texting, and zero shared context.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            {/* The Old Way */}
            <div className="p-8 rounded-3xl bg-paper border border-border space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-ink-muted block">
                The Conventional Experience
              </span>
              <h3 className="text-xl font-serif font-bold text-ink-heading">
                Endless small talk with no destination.
              </h3>
              <ul className="space-y-3 text-xs text-ink-muted leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <span className="text-ink-muted font-bold">—</span>
                  <span><strong>Zero collegiate context:</strong> Matching with strangers miles away who have no connection to your daily routine.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-ink-muted font-bold">—</span>
                  <span><strong>Shallow picture judgment:</strong> Bios stripped of humor, interests, and actual intellectual spark.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-ink-muted font-bold">—</span>
                  <span><strong>Conversational dead-ends:</strong> Exchanging &ldquo;hey&rdquo; for two weeks until both people lose momentum.</span>
                </li>
              </ul>
            </div>

            {/* The Kampu$Link Way */}
            <div className="p-8 rounded-3xl bg-surface border border-terracotta-200 shadow-soft space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-terracotta-700 block">
                The Kampu$Link Standard
              </span>
              <h3 className="text-xl font-serif font-bold text-ink-heading">
                Intentional prompts and same-night coffee.
              </h3>
              <ul className="space-y-3 text-xs text-ink leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <span className="text-terracotta-600 font-bold">✓</span>
                  <span><strong>Verified institutional scholars:</strong> Filter by major, batch year, and campus property.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-terracotta-600 font-bold">✓</span>
                  <span><strong>Hinge-depth prompt comments:</strong> Like a specific response or photograph with an immediate opener.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-terracotta-600 font-bold">✓</span>
                  <span><strong>Spontaneous &ldquo;Free Tonight&rdquo;:</strong> Meet up at the campus courtyard for chai tonight instead of next month.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 03 — 3D SIGNATURE EXPERIENCE ================= */}
      <section className="py-20 bg-paper">
        <KampusLinkHero3D />
      </section>

      {/* ================= 04 & 05 — DISCOVER & CONNECT ================= */}
      <section className="py-20 bg-surface border-y border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-5">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-terracotta-700 bg-terracotta-50 px-3 py-1 rounded-full border border-terracotta-200 inline-block">
                Interaction Design
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-ink-heading tracking-tight">
                Swift like Tinder. <br />
                Thoughtful like Hinge.
              </h2>
              <p className="text-sm text-ink-muted leading-relaxed">
                We believe you shouldn&apos;t have to sacrifice speed for depth. Move smoothly through student profiles with hardware-accelerated 3D perspective gestures, or pause on an answer that resonates to leave an authentic note.
              </p>

              <div className="space-y-3 pt-2">
                <div className="p-4 rounded-2xl bg-paper border border-border">
                  <span className="text-xs font-bold text-ink-heading block">3D Perspective Tilt Physics</span>
                  <p className="text-xs text-ink-muted mt-0.5">
                    Cards naturally follow your touch or cursor with subtle specular depth, making digital profiles feel tangible.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-paper border border-border">
                  <span className="text-xs font-bold text-ink-heading block">Comment-Driven Matchmaking</span>
                  <p className="text-xs text-ink-muted mt-0.5">
                    Profiles that receive a comment on a specific prompt convert into conversations at a 3.4x higher rate than blind swipes.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 flex justify-center">
              <div className="w-full max-w-sm p-6 rounded-3xl bg-paper border border-border shadow-soft space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border text-xs text-ink-muted font-medium">
                  <span>Prompt Interaction</span>
                  <span className="text-terracotta-700 font-semibold">Step into Chat</span>
                </div>

                <div className="p-4 rounded-2xl bg-surface border border-border space-y-2">
                  <span className="text-[10px] font-bold text-terracotta-700 uppercase tracking-wider block">
                    Campus Prompt
                  </span>
                  <h4 className="text-xs font-bold text-ink-heading">
                    &ldquo;My typical Sunday on campus looks like...&rdquo;
                  </h4>
                  <p className="text-xs text-ink-muted italic bg-paper p-2.5 rounded-xl border border-border">
                    &ldquo;Finding an empty seminar hall to sketch, then grabbing iced chai at the night canteen.&rdquo;
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-terracotta-50 border border-terracotta-200 text-xs text-ink space-y-1">
                  <span className="text-[10px] font-bold text-terracotta-700 uppercase block">Your Comment</span>
                  <p className="text-xs font-medium text-ink-heading">
                    &ldquo;Which canteen has the best bun-maska? I keep hearing mixed reviews!&rdquo;
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('discover')}
                  className="w-full py-2.5 rounded-full bg-terracotta-600 hover:bg-terracotta-700 text-surface font-semibold text-xs transition shadow-soft"
                >
                  Try Specific Prompt Likes
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 06 & 07 — FREE TONIGHT & DATE PLANNING ================= */}
      <section className="py-20 bg-paper">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-soft space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-ink-heading">Available Tonight</span>
                  </div>
                  <span className="text-xs text-ink-muted">7:30 PM — 10:30 PM</span>
                </div>

                <div className="p-4 rounded-2xl bg-paper border border-border space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-ink-heading flex items-center gap-1.5">
                      <Coffee className="w-4 h-4 text-terracotta-600" />
                      Cafe &amp; Study Session
                    </span>
                    <span className="text-[10px] font-semibold text-terracotta-700 bg-terracotta-50 px-2 py-0.5 rounded-full border border-terracotta-200">
                      Central Campus
                    </span>
                  </div>
                  <p className="text-xs text-ink-muted">
                    Looking for someone to grab iced latte and review project slides.
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-ink-muted">
                  <span>Location: Public Library Cafe</span>
                  <button
                    onClick={() => setActiveTab('free_tonight')}
                    className="text-xs font-semibold text-terracotta-700 hover:text-terracotta-800 underline underline-offset-4"
                  >
                    View Tonight&apos;s Grid →
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 order-1 lg:order-2 space-y-5">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 inline-block">
                Spontaneous Campus Life
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-ink-heading tracking-tight">
                No awkward planning. <br />
                Just &ldquo;Free Tonight.&rdquo;
              </h2>
              <p className="text-sm text-ink-muted leading-relaxed">
                Sometimes you have two free hours after your late lecture and simply want someone to grab coffee with. Signal your availability, choose your activity, and see who on your campus is ready to meet right now.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setActiveTab('dates')}
                  className="px-6 py-2.5 rounded-full bg-surface hover:bg-surface-elevated text-ink-heading border border-border text-xs font-semibold transition shadow-soft"
                >
                  Explore Date Planning
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 08 — AI WRITING ASSISTANT ================= */}
      <section className="py-20 bg-surface border-y border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-5">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-terracotta-700 bg-terracotta-50 px-3 py-1 rounded-full border border-terracotta-200 inline-block">
                Thoughtful Writing
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-ink-heading tracking-tight">
                An assistant that helps you sound like yourself.
              </h2>
              <p className="text-sm text-ink-muted leading-relaxed">
                We all second-guess our openers. Built directly into the chat input, our tone assistant reviews your draft without altering your personality. Adjust for confidence, friendly warmth, or conciseness with one tap.
              </p>

              <div className="space-y-2 pt-1 text-xs text-ink-muted">
                <p>✓ <strong>Zero auto-sending:</strong> You always inspect, edit, or dismiss suggestions.</p>
                <p>✓ <strong>Private &amp; server-side:</strong> Strict zero-log retention policy.</p>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="p-6 rounded-3xl bg-paper border border-border shadow-soft space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <span className="text-xs font-bold text-ink-heading flex items-center gap-1.5">
                    <Wand2 className="w-4 h-4 text-terracotta-600" />
                    Tone Adjustment Preview
                  </span>
                  <span className="text-[10px] uppercase font-bold text-terracotta-700 bg-terracotta-50 px-2 py-0.5 rounded-full border border-terracotta-200">
                    Friendly Tone
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-2xl bg-surface border border-border">
                    <span className="text-[10px] font-bold text-ink-faint uppercase block mb-1">Original Draft</span>
                    <p className="text-ink-muted line-through">&ldquo;hey u wanna get coffe or somethin?&rdquo;</p>
                  </div>

                  <div className="p-3 rounded-2xl bg-terracotta-50 border border-terracotta-200">
                    <span className="text-[10px] font-bold text-terracotta-700 uppercase block mb-1">Polished Suggestion</span>
                    <p className="text-ink-heading font-medium">
                      &ldquo;Hey! Would you like to grab coffee at the library cafe sometime?&rdquo;
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <span className="text-[11px] text-ink-muted">User Controls:</span>
                  <span className="text-xs font-semibold text-terracotta-700 bg-surface px-2.5 py-1 rounded-lg border border-border shadow-soft">
                    Accept
                  </span>
                  <span className="text-xs font-semibold text-ink-muted bg-surface px-2.5 py-1 rounded-lg border border-border shadow-soft">
                    Edit
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 09 — SAFETY & PRIVACY ================= */}
      <section className="py-20 bg-paper">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-5">
          <div className="w-12 h-12 rounded-2xl bg-surface border border-border text-campus-sage flex items-center justify-center mx-auto shadow-soft">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-ink-heading">
            Dignity, Discretion &amp; Campus Safety
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted max-w-xl mx-auto leading-relaxed">
            All dates are proposed at public, monitored campus landmarks. Private phone numbers remain private. Unmatching permanently removes history from both devices with zero drama.
          </p>
        </div>
      </section>

      {/* ================= 10 — FINAL CALL TO ACTION ================= */}
      <section className="py-20 max-w-4xl mx-auto px-4 text-center">
        <div className="p-8 sm:p-14 rounded-4xl bg-surface border border-border shadow-modal space-y-6">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-terracotta-700 bg-terracotta-50 px-3 py-1 rounded-full border border-terracotta-200 inline-block">
            Join the Campus
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-ink-heading tracking-tight">
            Stop swiping in circles. <br />
            Start talking.
          </h2>

          <p className="text-xs sm:text-sm text-ink-muted max-w-md mx-auto leading-relaxed">
            Join verified collegiate students who value authentic conversation, spontaneous coffee dates, and intentional relationships.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('discover')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-terracotta-600 hover:bg-terracotta-700 text-surface font-semibold text-xs transition shadow-soft hover:shadow-hover active:scale-98"
            >
              Start Exploring Profiles
            </button>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-paper hover:bg-surface text-ink-heading border border-border font-semibold text-xs transition"
            >
              Sign In to Account
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-surface py-12 text-xs text-ink-muted">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-ink-heading text-sm">Kampu$Link</span>
            <span>· Intentional College Romance</span>
          </div>

          <div className="flex items-center gap-6">
            <span>Verified Student Network</span>
            <span>Public Campus Dates</span>
            <span>Privacy Standard</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
