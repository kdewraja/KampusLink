import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Layers, Sparkles, MessageSquare, Coffee, CheckCircle2, Sliders } from 'lucide-react';

export const Profile3DBreakdown: React.FC = () => {
  // Explosion separation amount (0 = flat assembled profile, 1 = fully exploded 3D layers)
  const [explosion, setExplosion] = useState<number>(0.65);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [activeLayer, setActiveLayer] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse tilt tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 180, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-18, 18]);
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [16, -16]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  // Layer Z offsets scaled by explosion value
  const z0 = 0;
  const z1 = Math.round(explosion * 45);  // Photography layer
  const z2 = Math.round(explosion * 95);  // Prompts & Voice layer
  const z3 = Math.round(explosion * 150); // Interaction & Comment Spark

  return (
    <div className="w-full max-w-5xl mx-auto py-8 sm:py-14 px-4">
      {/* Section Subtitle & Explanation */}
      <div className="text-center max-w-xl mx-auto mb-8 sm:mb-12 space-y-2">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-terracotta-700 bg-terracotta-50 px-3 py-1 rounded-full border border-terracotta-200 inline-flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5" />
          The Anatomy of a Profile
        </span>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-ink-heading tracking-tight">
          Deconstructed for Real Connection
        </h2>
        <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
          Unlike shallow swipe apps that reduce someone to a photograph, Kampu$Link layers identity, authentic voice, and conversation starters. Drag the scrubber to explode the profile in 3D.
        </p>
      </div>

      {/* Interactive Controls Bar */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
        <div className="flex items-center gap-3 bg-surface px-4 py-2 rounded-full border border-border shadow-soft">
          <span className="text-xs font-semibold text-ink-muted">Assembled</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={explosion}
            onChange={(e) => setExplosion(parseFloat(e.target.value))}
            className="w-32 sm:w-48 h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-terracotta-600"
            aria-label="Deconstruct 3D Layers"
          />
          <span className="text-xs font-semibold text-terracotta-700">Exploded 3D</span>
        </div>

        <button
          onClick={() => setExplosion((prev) => (prev > 0.4 ? 0 : 0.85))}
          className="px-4 py-2 rounded-full bg-surface hover:bg-surface-elevated text-xs font-semibold text-ink border border-border transition shadow-soft flex items-center gap-1.5"
        >
          <Sliders className="w-3.5 h-3.5 text-terracotta-600" />
          {explosion > 0.2 ? 'Recombine Profile' : 'Deconstruct in 3D'}
        </button>
      </div>

      {/* 3D Scene Viewport */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="relative h-[480px] sm:h-[540px] w-full flex items-center justify-center perspective-1200 cursor-grab active:cursor-grabbing select-none"
      >
        <motion.div
          style={{ rotateX, rotateY }}
          className="relative w-[300px] sm:w-[340px] h-[440px] sm:h-[480px] preserve-3d transition-transform duration-100 ease-out"
        >
          {/* ================= LAYER 0: BASE IDENTITY & ACADEMICS ================= */}
          <motion.div
            style={{
              transform: `translateZ(${z0}px)`,
            }}
            onMouseEnter={() => setActiveLayer(0)}
            className="absolute inset-0 rounded-3xl bg-surface border border-border shadow-soft p-5 flex flex-col justify-between preserve-3d transition-transform duration-300"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                  Layer 01 · Academic Base
                </span>
                <span className="w-2 h-2 rounded-full bg-campus-sage" />
              </div>

              <div>
                <span className="text-xs font-bold text-ink-heading block">IIT Bombay</span>
                <span className="text-[11px] text-ink-muted">Visual Design &amp; HCI · Class of &apos;27</span>
              </div>

              <div className="pt-2">
                <span className="text-[10px] uppercase font-bold text-ink-muted block mb-1">Intentions</span>
                <p className="text-xs font-semibold text-terracotta-700 bg-terracotta-50 p-2 rounded-xl border border-terracotta-200">
                  Looking for intentional romance &amp; creative spark
                </p>
              </div>

              <div className="pt-2">
                <span className="text-[10px] uppercase font-bold text-ink-muted block mb-1">Campus Spot</span>
                <p className="text-xs text-ink-muted italic">
                  &ldquo;Library courtyard under the jacaranda trees&rdquo;
                </p>
              </div>
            </div>

            <div className="text-[10px] text-ink-faint flex items-center justify-between pt-2 border-t border-border">
              <span>Verified Institutional Scholar</span>
              <span className="font-semibold text-campus-sage">95% Trust</span>
            </div>
          </motion.div>

          {/* ================= LAYER 1: EDITORIAL PHOTOGRAPHY ================= */}
          <motion.div
            style={{
              transform: `translateZ(${z1}px) translateY(${explosion * -15}px)`,
            }}
            onMouseEnter={() => setActiveLayer(1)}
            className="absolute inset-0 rounded-3xl overflow-hidden border border-border shadow-hover preserve-3d transition-transform duration-300"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
              alt="Rhea Sen"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-heading/85 via-ink-heading/20 to-transparent" />

            <div className="absolute top-4 left-4">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-surface/90 text-ink-heading backdrop-blur-sm border border-border flex items-center gap-1 shadow-soft">
                <CheckCircle2 className="w-3 h-3 text-campus-sage" />
                Rhea Sen, 20
              </span>
            </div>

            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/70 block">
                Layer 02 · Editorial Visual
              </span>
              <h3 className="text-xl font-serif font-bold text-white leading-tight">
                Rhea Sen
              </h3>
              <p className="text-xs text-white/80">
                Design Lead &amp; Matcha Enthusiast
              </p>
            </div>
          </motion.div>

          {/* ================= LAYER 2: AUTHENTIC PROMPT VOICE ================= */}
          <motion.div
            style={{
              transform: `translateZ(${z2}px) translateY(${explosion * 10}px) translateX(${explosion * 15}px)`,
            }}
            onMouseEnter={() => setActiveLayer(2)}
            className="absolute -right-4 sm:-right-8 top-16 w-56 sm:w-64 rounded-2xl bg-surface border border-border shadow-modal p-4 space-y-2 preserve-3d transition-transform duration-300"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-terracotta-700">
                Layer 03 · Hinge Voice Prompt
              </span>
              <Sparkles className="w-3 h-3 text-terracotta-600" />
            </div>

            <h4 className="text-xs font-serif font-bold text-ink-heading leading-snug">
              The quickest way to my heart is...
            </h4>

            <p className="text-[11px] text-ink-muted leading-relaxed italic bg-paper p-2.5 rounded-xl border border-border">
              &ldquo;Recommending an obscure indie acoustic track or explaining quantum computing without being condescending.&rdquo;
            </p>
          </motion.div>

          {/* ================= LAYER 3: CONVERSATIONAL SPARK / DATE PROPOSAL ================= */}
          <motion.div
            style={{
              transform: `translateZ(${z3}px) translateY(${explosion * 35}px) translateX(${explosion * -18}px)`,
            }}
            onMouseEnter={() => setActiveLayer(3)}
            className="absolute -left-4 sm:-left-8 bottom-10 w-60 sm:w-68 rounded-2xl bg-surface border border-terracotta-200 shadow-modal p-4 space-y-2.5 preserve-3d transition-transform duration-300"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-terracotta-700 flex items-center gap-1">
                <MessageSquare className="w-3 h-3" />
                Layer 04 · The Spark &amp; Date
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                Spontaneous
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-terracotta-50/70 border border-terracotta-100 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-ink-heading">
                <Coffee className="w-3.5 h-3.5 text-terracotta-600" />
                <span>Central Library Courtyard</span>
              </div>
              <p className="text-[11px] text-ink-muted">
                Tomorrow at 4:30 PM (Post-Lecture Chai)
              </p>
            </div>

            <p className="text-[10px] text-terracotta-700 italic font-medium">
              &ldquo;I noticed your music taste — let&apos;s grab iced matcha tomorrow?&rdquo;
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Narrative Guide Below */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-4xl mx-auto text-left">
        <div className="p-3.5 rounded-2xl bg-surface border border-border shadow-soft">
          <span className="text-[10px] font-bold text-terracotta-700 uppercase tracking-wider block">01 · Academic Base</span>
          <p className="text-xs font-bold text-ink-heading mt-0.5">Verified Identity</p>
          <p className="text-[11px] text-ink-muted mt-1">Real collegiate context, college major, and zero catfishing.</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-surface border border-border shadow-soft">
          <span className="text-[10px] font-bold text-terracotta-700 uppercase tracking-wider block">02 · Photography</span>
          <p className="text-xs font-bold text-ink-heading mt-0.5">Editorial Clarity</p>
          <p className="text-[11px] text-ink-muted mt-1">Full-bleed imagery that lets genuine personality breathe.</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-surface border border-border shadow-soft">
          <span className="text-[10px] font-bold text-terracotta-700 uppercase tracking-wider block">03 · Prompts &amp; Voice</span>
          <p className="text-xs font-bold text-ink-heading mt-0.5">Specific Openers</p>
          <p className="text-[11px] text-ink-muted mt-1">Thoughtful prompt answers give matches something real to comment on.</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-surface border border-border shadow-soft">
          <span className="text-[10px] font-bold text-terracotta-700 uppercase tracking-wider block">04 · Spontaneous Date</span>
          <p className="text-xs font-bold text-ink-heading mt-0.5">Verified Meetups</p>
          <p className="text-[11px] text-ink-muted mt-1">Direct transition to campus cafe dates and Free Tonight meetups.</p>
        </div>
      </div>
    </div>
  );
};
