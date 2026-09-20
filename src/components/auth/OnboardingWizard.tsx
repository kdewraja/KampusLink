import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  Camera,
  Coffee,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const OnboardingWizard: React.FC = () => {
  const { isOnboardingOpen, setIsOnboardingOpen, register } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [is18Plus, setIs18Plus] = useState(false);
  const [agreedToConduct, setAgreedToConduct] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState(20);
  const [gender, setGender] = useState<'female' | 'male' | 'non-binary'>('female');

  const [campus, setCampus] = useState('IIT Bombay');
  const [major, setMajor] = useState('Computer Science & Engineering');
  const [batch, setBatch] = useState("Class of '26");
  const [hostel, setHostel] = useState('Hostel 12');

  const [relationshipIntent, setRelationshipIntent] = useState<
    'Dating & Romance' | 'Study Date Buddy' | 'Campus Hangouts' | 'Serious Relationship'
  >('Dating & Romance');

  const [photoUrl, setPhotoUrl] = useState(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
  );
  const [prompt1Question, setPrompt1Question] = useState('My typical Sunday on campus looks like...');
  const [prompt1Answer, setPrompt1Answer] = useState('Finding an empty seminar room to study, then grabbing cold coffee at the night canteen.');
  const [prompt2Question, setPrompt2Question] = useState('The quickest way to my heart is...');
  const [prompt2Answer, setPrompt2Answer] = useState('Recommending an obscure indie acoustic track or explaining quantum computing without being condescending.');

  if (!isOnboardingOpen) return null;

  const handleNext = () => {
    setError(null);
    if (step === 1) {
      if (!is18Plus || !agreedToConduct) {
        setError('Please confirm you are at least 18 years old and agree to the community pledge.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!name.trim() || !email.trim() || !password.trim()) {
        setError('Please enter your full name, university email, and a password.');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    } else if (step === 4) {
      if (!prompt1Answer.trim() || !prompt2Answer.trim()) {
        setError('Please answer both prompts so your matches have something specific to reply to.');
        return;
      }
      setStep(5);
    }
  };

  const handleComplete = async () => {
    setError(null);
    setIsSubmitting(true);

    const success = await register({
      email: email.trim(),
      password: password.trim(),
      name: name.trim(),
      age: Number(age),
      gender,
      campus,
      major,
      batch,
      hostel,
      relationshipIntent,
      photos: [photoUrl],
      prompts: [
        { question: prompt1Question, answer: prompt1Answer },
        { question: prompt2Question, answer: prompt2Answer },
      ],
      bio: `${major} student at ${campus}. Love quiet coffee spots, late night walks, and deep discussions.`,
      interests: ['Iced Matcha', 'Acoustic Indie', 'Design Systems', 'Campus Biking'],
      clubs: ['Film & Media Club', 'Tech Council'],
      favoriteCampusSpot: 'Central Courtyard & Cafe',
      twoAmCraving: 'Kullad chai & hot bun maska',
      campusAnthem: {
        title: 'Midnight City',
        artist: 'M83',
        vibe: 'Chill Night Walks',
      },
    });

    setIsSubmitting(false);
    if (!success) {
      setError('Could not complete registration. That email may already be in use.');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-ink-heading/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="relative max-w-xl w-full rounded-3xl sm:rounded-4xl bg-surface border border-border p-6 sm:p-10 shadow-modal my-6 text-ink"
        >
          {/* Close button */}
          <button
            onClick={() => setIsOnboardingOpen(false)}
            className="absolute top-5 right-5 p-2 rounded-full hover:bg-surface-sand text-ink-muted hover:text-ink transition border border-border"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Subdued Progress Tracker */}
          <div className="mb-6 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-ink-muted">
              <span className="font-semibold text-terracotta-700">Step 0{step} of 05</span>
              <span className="capitalize">
                {step === 1 && 'Pledge & Eligibility'}
                {step === 2 && 'Academic Identity'}
                {step === 3 && 'Dating Intentions'}
                {step === 4 && 'Prompts & Story'}
                {step === 5 && 'Profile Review'}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                    step >= i ? 'bg-terracotta-600' : 'bg-surface-sand'
                  }`}
                />
              ))}
            </div>
          </div>

          {error && (
            <div className="p-3 mb-4 rounded-2xl bg-terracotta-50 border border-terracotta-200 text-xs text-terracotta-800">
              {error}
            </div>
          )}

          {/* ================= STEP 1: PLEDGE & 18+ ELIGIBILITY ================= */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-2xl font-serif font-bold text-ink-heading">
                  The Kampu$Link Standard
                </h3>
                <p className="text-xs sm:text-sm text-ink-muted mt-1 leading-relaxed">
                  Kampu$Link is a private, verified community reserved strictly for adult collegiate students who treat one another with respect.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-start gap-3 p-4 rounded-2xl bg-paper border border-border cursor-pointer hover:bg-surface-sand transition">
                  <input
                    type="checkbox"
                    checked={is18Plus}
                    onChange={(e) => setIs18Plus(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded text-terracotta-600 focus:ring-terracotta-500"
                  />
                  <div className="text-xs">
                    <strong className="text-ink-heading block">I am at least 18 years old</strong>
                    <span className="text-ink-muted">
                      Legally confirming adult status and current collegiate enrollment.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 rounded-2xl bg-paper border border-border cursor-pointer hover:bg-surface-sand transition">
                  <input
                    type="checkbox"
                    checked={agreedToConduct}
                    onChange={(e) => setAgreedToConduct(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded text-terracotta-600 focus:ring-terracotta-500"
                  />
                  <div className="text-xs">
                    <strong className="text-ink-heading block">Campus Conduct &amp; Safety Pledge</strong>
                    <span className="text-ink-muted">
                      I pledge to treat my campus peers with kindness, meet only in public verified areas, and never share private media without consent.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* ================= STEP 2: ACADEMIC CREDENTIALS ================= */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-serif font-bold text-ink-heading">Academic Roots</h3>
                <p className="text-xs sm:text-sm text-ink-muted mt-0.5">
                  Let your peers know who you are and where you study.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-ink-heading uppercase tracking-wider block mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Maya Patel"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-paper border border-border text-xs text-ink-heading focus:outline-none focus:border-terracotta-600"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-ink-heading uppercase tracking-wider block mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    min={18}
                    max={29}
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-paper border border-border text-xs text-ink-heading focus:outline-none focus:border-terracotta-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-ink-heading uppercase tracking-wider block mb-1">
                    University Campus
                  </label>
                  <select
                    value={campus}
                    onChange={(e) => setCampus(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-paper border border-border text-xs text-ink-heading focus:outline-none focus:border-terracotta-600"
                  >
                    <option value="IIT Bombay">IIT Bombay</option>
                    <option value="IIT Delhi">IIT Delhi</option>
                    <option value="BITS Pilani">BITS Pilani</option>
                    <option value="Delhi University">Delhi University</option>
                    <option value="St. Stephen's College">St. Stephen&apos;s College</option>
                    <option value="Ashoka University">Ashoka University</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-ink-heading uppercase tracking-wider block mb-1">
                    Major / Department
                  </label>
                  <input
                    type="text"
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                    placeholder="e.g. Visual Design & HCI"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-paper border border-border text-xs text-ink-heading focus:outline-none focus:border-terracotta-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-ink-heading uppercase tracking-wider block mb-1">
                    University Email (.edu / .ac.in)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@campus.edu"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-paper border border-border text-xs text-ink-heading focus:outline-none focus:border-terracotta-600"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-ink-heading uppercase tracking-wider block mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-paper border border-border text-xs text-ink-heading focus:outline-none focus:border-terracotta-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 3: INTENTIONS ================= */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-serif font-bold text-ink-heading">Dating Intentions</h3>
                <p className="text-xs sm:text-sm text-ink-muted mt-0.5">
                  Clear expectations prevent mismatched assumptions.
                </p>
              </div>

              <div className="space-y-2.5">
                {(
                  [
                    { id: 'Dating & Romance', desc: 'Looking for a genuine spark, romantic dinners, and campus dates' },
                    { id: 'Study Date Buddy', desc: 'Library grinds, cafe study sessions, and intellectual connection' },
                    { id: 'Campus Hangouts', desc: 'Casual fest companion, evening canteen walks, and making friends' },
                    { id: 'Serious Relationship', desc: 'Long-term committed partnership through college and beyond' },
                  ] as const
                ).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setRelationshipIntent(item.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                      relationshipIntent === item.id
                        ? 'bg-surface border-terracotta-600 shadow-soft ring-1 ring-terracotta-600/20'
                        : 'bg-paper hover:bg-surface-sand border-border'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold text-ink-heading block">{item.id}</span>
                      <span className="text-[11px] text-ink-muted">{item.desc}</span>
                    </div>
                    {relationshipIntent === item.id && (
                      <Check className="w-4 h-4 text-terracotta-600 shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= STEP 4: PROMPTS & STORY ================= */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-serif font-bold text-ink-heading">Photos &amp; Prompts</h3>
                <p className="text-xs sm:text-sm text-ink-muted mt-0.5">
                  Give your matches a specific hook to comment on.
                </p>
              </div>

              <div>
                <label className="text-[11px] font-bold text-ink-heading uppercase tracking-wider block mb-1">
                  Profile Photo URL
                </label>
                <input
                  type="url"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-paper border border-border text-xs text-ink-heading focus:outline-none focus:border-terracotta-600"
                />
              </div>

              <div className="space-y-3 pt-1">
                <div className="p-4 rounded-2xl bg-paper border border-border space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-terracotta-700 block">
                    Campus Prompt 01
                  </span>
                  <input
                    type="text"
                    value={prompt1Question}
                    onChange={(e) => setPrompt1Question(e.target.value)}
                    className="w-full font-serif font-bold text-xs bg-transparent border-b border-border pb-1 focus:outline-none text-ink-heading"
                  />
                  <textarea
                    rows={2}
                    value={prompt1Answer}
                    onChange={(e) => setPrompt1Answer(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-surface border border-border text-xs text-ink-heading placeholder-ink-muted focus:outline-none focus:border-terracotta-600"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-paper border border-border space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-terracotta-700 block">
                    Campus Prompt 02
                  </span>
                  <input
                    type="text"
                    value={prompt2Question}
                    onChange={(e) => setPrompt2Question(e.target.value)}
                    className="w-full font-serif font-bold text-xs bg-transparent border-b border-border pb-1 focus:outline-none text-ink-heading"
                  />
                  <textarea
                    rows={2}
                    value={prompt2Answer}
                    onChange={(e) => setPrompt2Answer(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-surface border border-border text-xs text-ink-heading placeholder-ink-muted focus:outline-none focus:border-terracotta-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 5: PREVIEW BEFORE PUBLISHING ================= */}
          {step === 5 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-serif font-bold text-ink-heading">Your Profile Preview</h3>
                <p className="text-xs sm:text-sm text-ink-muted mt-0.5">
                  This is exactly how your profile will look in the campus discovery stack.
                </p>
              </div>

              <div className="rounded-3xl overflow-hidden bg-paper border border-border shadow-soft">
                <div className="relative aspect-[16/10] bg-surface-sand overflow-hidden">
                  <img
                    src={photoUrl}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-heading/85 via-ink-heading/20 to-transparent" />
                  <div className="absolute bottom-3 inset-x-4 text-white">
                    <h4 className="text-xl font-serif font-bold">{name}, {age}</h4>
                    <p className="text-xs text-white/80">{major} · {campus}</p>
                  </div>
                </div>

                <div className="p-4 space-y-2 text-xs">
                  <div className="p-3 rounded-2xl bg-surface border border-border">
                    <span className="text-[10px] font-bold uppercase text-terracotta-700 block">{prompt1Question}</span>
                    <p className="text-ink-heading italic mt-1">&ldquo;{prompt1Answer}&rdquo;</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Controls Footer */}
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-border">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => (prev - 1) as 1 | 2 | 3 | 4 | 5)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-ink-muted hover:text-ink transition flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-full bg-terracotta-600 hover:bg-terracotta-700 text-surface font-semibold text-xs transition shadow-soft flex items-center gap-2"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleComplete}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-full bg-terracotta-600 hover:bg-terracotta-700 text-surface font-semibold text-xs transition shadow-soft flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? 'Publishing Profile...' : 'Launch Campus Profile'}
                <Sparkles className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
