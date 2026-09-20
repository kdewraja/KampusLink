import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { UserProfile } from '../../types';
import {
  User,
  GraduationCap,
  Building2,
  CheckCircle2,
  Shield,
  Music,
  MapPin,
  Clock,
  Sparkles,
  Save,
  Mail,
  Award,
  LogOut,
  Heart,
  BadgeCheck,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ProfileEditView: React.FC = () => {
  const { currentUser, showToast, verifyStudent, refreshData, logout } = useApp();

  const [name, setName] = useState(currentUser?.name || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [intent, setIntent] = useState(currentUser?.relationshipIntent || 'Dating & Romance');
  const [favoriteSpot, setFavoriteSpot] = useState(currentUser?.favoriteCampusSpot || '');
  const [twoAmCraving, setTwoAmCraving] = useState(currentUser?.twoAmCraving || '');
  const [anthemTitle, setAnthemTitle] = useState(currentUser?.campusAnthem?.title || '');
  const [anthemArtist, setAnthemArtist] = useState(currentUser?.campusAnthem?.artist || '');
  const [promptAnswer, setPromptAnswer] = useState(currentUser?.prompts?.[0]?.answer || '');

  // Verification Form State
  const [collegeEmail, setCollegeEmail] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Account Deletion State
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  if (!currentUser) return null;

  const handleSaveProfile = async () => {
    try {
      const res = await api.updateMyProfile({
        name,
        bio,
        relationshipIntent: intent as 'Dating & Romance',
        favoriteCampusSpot: favoriteSpot,
        twoAmCraving,
        campusAnthem: {
          title: anthemTitle,
          artist: anthemArtist,
          vibe: currentUser.campusAnthem?.vibe || 'Campus favorite',
        },
        prompts: [
          {
            question: currentUser.prompts[0]?.question || 'My ideal campus date is...',
            answer: promptAnswer,
          },
          ...(currentUser.prompts.slice(1) || []),
        ],
      });

      if (res.success) {
        showToast('Profile Updated', 'Your campus changes are saved!', 'success');
        await refreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!collegeEmail.trim()) return;
    setIsVerifying(true);
    const success = await verifyStudent(collegeEmail);
    setIsVerifying(false);
    if (success) {
      setCollegeEmail('');
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deletePassword || deleteConfirmation !== 'DELETE MY ACCOUNT') return;
    setIsDeleting(true);
    try {
      const res = await fetch('/api/auth/account', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: deletePassword, confirmation: deleteConfirmation }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Account Deleted', 'Your account and all data have been permanently removed.', 'success');
        logout();
      } else {
        showToast('Deletion Failed', data.error || 'Could not delete account', 'alert');
      }
    } catch {
      showToast('Error', 'Unable to delete account', 'alert');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      setDeletePassword('');
      setDeleteConfirmation('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 text-ink space-y-6">
      {/* Top Banner Profile Card */}
      <div className="bg-paper border border-border rounded-3xl p-6 sm:p-8 shadow-soft relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="relative">
              <img
                src={currentUser.photos[0]}
                alt={currentUser.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-1 ring-border shadow-soft"
              />
              {currentUser.isVerified && (
                <div className="w-6 h-6 rounded-full bg-campus-sage text-white flex items-center justify-center text-xs ring-4 ring-paper absolute -bottom-1 -right-1">
                  ✓
                </div>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-2xl sm:text-3xl font-serif font-normal text-ink-heading">
                  {currentUser.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-surface-sand text-campus-sage border border-border-subtle text-xs font-medium">
                  {currentUser.trustScore}% Trust Score
                </span>
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-ink-muted font-medium">
                <GraduationCap className="w-3.5 h-3.5 text-terracotta" />
                <span>{currentUser.major}</span>
                <span>·</span>
                <span>{currentUser.batch}</span>
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-ink-muted">
                <Building2 className="w-3.5 h-3.5 text-ink-muted" />
                <span>{currentUser.campus} ({currentUser.hostel})</span>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="px-4 py-2 rounded-xl bg-surface hover:bg-surface-sand text-ink-muted hover:text-rose-600 border border-border text-xs font-medium flex items-center gap-1.5 transition self-center sm:self-start shadow-soft"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Edit Profile Fields */}
        <div className="lg:col-span-7 bg-paper border border-border rounded-3xl p-6 shadow-soft space-y-5">
          <h3 className="text-base font-serif font-normal text-ink-heading pb-3 border-b border-border flex items-center gap-2">
            <User className="w-4 h-4 text-terracotta" />
            Edit Profile Details
          </h3>

          {/* Name & Intent */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-ink-heading uppercase tracking-wider mb-1.5 block">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-xs text-ink placeholder-ink-faint focus:outline-none focus:border-terracotta transition"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-ink-heading uppercase tracking-wider mb-1.5 block">
                Relationship Intent
              </label>
              <select
                value={intent}
                onChange={(e) => setIntent(e.target.value as UserProfile['relationshipIntent'])}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-xs text-ink focus:outline-none focus:border-terracotta transition"
              >
                <option value="Dating & Romance">Dating &amp; Romance</option>
                <option value="Study Date Buddy">Study Date Buddy</option>
                <option value="Campus Hangouts">Campus Hangouts</option>
                <option value="Serious Relationship">Serious Relationship</option>
              </select>
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="text-xs font-medium text-ink-heading uppercase tracking-wider mb-1.5 block">
              Campus Bio
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-xs text-ink placeholder-ink-faint focus:outline-none focus:border-terracotta transition"
            />
          </div>

          {/* Prompt 1 */}
          <div>
            <label className="text-xs font-medium text-terracotta uppercase tracking-wider mb-1.5 block">
              {currentUser.prompts[0]?.question || 'My ideal campus date is...'}
            </label>
            <textarea
              rows={2}
              value={promptAnswer}
              onChange={(e) => setPromptAnswer(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-xs text-ink font-serif italic focus:outline-none focus:border-terracotta transition"
            />
          </div>

          {/* Campus Anthem */}
          <div>
            <label className="text-xs font-medium text-ink-heading uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5 text-terracotta" />
              Campus Anthem (Track &amp; Artist)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={anthemTitle}
                onChange={(e) => setAnthemTitle(e.target.value)}
                placeholder="Track Title"
                className="w-full px-3.5 py-2 rounded-xl bg-surface border border-border text-xs text-ink placeholder-ink-faint focus:outline-none focus:border-terracotta transition"
              />
              <input
                type="text"
                value={anthemArtist}
                onChange={(e) => setAnthemArtist(e.target.value)}
                placeholder="Artist"
                className="w-full px-3.5 py-2 rounded-xl bg-surface border border-border text-xs text-ink placeholder-ink-faint focus:outline-none focus:border-terracotta transition"
              />
            </div>
          </div>

          {/* Favorite Campus Spot & 2 AM Craving */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-ink-heading uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-terracotta" />
                Favorite Campus Spot
              </label>
              <input
                type="text"
                value={favoriteSpot}
                onChange={(e) => setFavoriteSpot(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-surface border border-border text-xs text-ink placeholder-ink-faint focus:outline-none focus:border-terracotta transition"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-ink-heading uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-campus-gold" />
                2 AM Craving
              </label>
              <input
                type="text"
                value={twoAmCraving}
                onChange={(e) => setTwoAmCraving(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-surface border border-border text-xs text-ink placeholder-ink-faint focus:outline-none focus:border-terracotta transition"
              />
            </div>
          </div>

          <div className="pt-3">
            <button
              onClick={handleSaveProfile}
              className="w-full py-2.5 rounded-xl bg-terracotta hover:bg-terracotta-600 text-white font-medium text-xs shadow-soft transition flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Profile Changes
            </button>
          </div>
        </div>

        {/* Right Column: Student Verification Portal */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-paper border border-border rounded-3xl p-6 shadow-soft space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-surface-sand text-campus-sage border border-border-subtle">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-serif font-normal text-ink-heading">Campus Verification</h4>
                <p className="text-[11px] text-ink-muted">Exclusive Collegiate Student Authentication</p>
              </div>
            </div>

            {currentUser.isVerified ? (
              <div className="p-4 rounded-2xl bg-surface border border-border space-y-2 text-xs shadow-soft">
                <div className="flex items-center gap-2 text-campus-sage font-medium">
                  <CheckCircle2 className="w-4 h-4 text-campus-sage" />
                  Verified College Student Active
                </div>
                <p className="text-ink-muted text-[11px] leading-relaxed">
                  Your institutional credentials are confirmed. Your profile displays the verified badge and has priority matching on campus.
                </p>
              </div>
            ) : (
              <form onSubmit={handleVerify} className="space-y-3 pt-2">
                <p className="text-xs text-ink-muted leading-relaxed">
                  Verify your university affiliation with your accredited student email address (.edu or .ac.in).
                </p>

                <div>
                  <label className="text-[11px] font-medium text-ink-heading uppercase block mb-1">
                    University Email (.edu / college)
                  </label>
                  <input
                    type="email"
                    required
                    value={collegeEmail}
                    onChange={(e) => setCollegeEmail(e.target.value)}
                    placeholder="student@iitb.ac.in"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-xs text-ink placeholder-ink-faint focus:outline-none focus:border-terracotta transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full py-2.5 rounded-xl bg-campus-sage hover:bg-emerald-700 text-white font-medium text-xs transition shadow-soft flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Award className="w-4 h-4" />
                  {isVerifying ? 'Verifying Institution...' : 'Verify Campus Email'}
                </button>
              </form>
            )}

            {/* Verification Perks */}
            <div className="pt-3 border-t border-border space-y-1.5 text-[11px] text-ink-muted">
              <span className="text-ink-heading font-medium block">Kampu$Link Student Perks:</span>
              <div>✓ Official Verified Student badge on profile</div>
              <div>✓ Priority discovery in campus stacks</div>
              <div>✓ Access to &ldquo;Free Tonight&rdquo; instant evening meetups</div>
              <div>✓ Safe cafe date coordinates on verified grounds</div>
            </div>
          </div>
        </div>

        {/* Danger Zone: Delete Account */}
        <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 shadow-soft">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="p-2 rounded-xl bg-rose-100 text-rose-600 border border-rose-200">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-serif font-normal text-ink-heading">Danger Zone</h4>
              <p className="text-[11px] text-ink-muted">Permanently delete your account and all data</p>
            </div>
          </div>

          <p className="text-xs text-ink-muted mb-4 leading-relaxed">
            This action is irreversible. All your matches, conversations, date plans, photos, and profile data will be permanently removed.
            We do not keep backups of deleted accounts.
          </p>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full py-2.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 font-medium text-xs transition flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete My Account
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm"
          >
            <motion.div
              className="bg-paper border border-border rounded-3xl max-w-md w-full p-6 text-ink shadow-modal"
            >
              <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200 mx-auto mb-4">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="text-center mb-6">
                <h3 className="text-base font-serif font-normal text-ink-heading">Delete Account Permanently</h3>
                <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                  This cannot be undone. All your data will be permanently erased.
                </p>
              </div>

              <form onSubmit={handleDeleteAccount} className="space-y-4">
                <div>
                  <label className="text-[11px] font-medium text-ink-heading uppercase block mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-xs text-ink placeholder-ink-faint focus:outline-none focus:border-rose-500 transition"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-ink-heading uppercase block mb-1">
                    Type &ldquo;DELETE MY ACCOUNT&rdquo; to confirm
                  </label>
                  <input
                    type="text"
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                    required
                    placeholder="DELETE MY ACCOUNT"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-xs text-ink placeholder-ink-faint focus:outline-none focus:border-rose-500 transition font-mono"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => { setShowDeleteConfirm(false); setDeletePassword(''); setDeleteConfirmation(''); }}
                    className="flex-1 py-2.5 rounded-xl bg-surface hover:bg-surface-sand text-ink border border-border text-xs font-medium transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isDeleting}
                    className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs transition shadow-soft disabled:opacity-50"
                  >
                    {isDeleting ? 'Deleting...' : 'Permanently Delete Account'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
