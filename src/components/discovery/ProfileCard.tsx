import React, { useState, useRef } from 'react';
import { UserProfile } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  Heart,
  X,
  Star,
  RotateCcw,
  CheckCircle2,
  MapPin,
  Music,
  Compass,
  Sparkles,
  MessageSquare,
} from 'lucide-react';

interface ProfileCardProps {
  profile: UserProfile;
  onSwipe: (action: 'like' | 'pass' | 'super') => void;
  onRewind?: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onSwipe, onRewind }) => {
  const { setPromptLikeTarget } = useApp();
  const [photoIndex, setPhotoIndex] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D Perspective Tilt State
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glareX, setGlareX] = useState(50);
  const [glareY, setGlareY] = useState(50);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Gentle, restrained 3D tilt (max 4.5 degrees)
    const tiltX = ((y - centerY) / centerY) * -4.5;
    const tiltY = ((x - centerX) / centerX) * 4.5;

    setRotateX(tiltX);
    setRotateY(tiltY);
    setGlareX((x / rect.width) * 100);
    setGlareY((y / rect.height) * 100);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlareX(50);
    setGlareY(50);
  };

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotoIndex((prev) => (prev + 1) % profile.photos.length);
  };

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotoIndex((prev) => (prev - 1 + profile.photos.length) % profile.photos.length);
  };

  const handleLikePrompt = (e: React.MouseEvent, question: string, answer: string) => {
    e.stopPropagation();
    setPromptLikeTarget({
      targetProfile: profile,
      promptQuestion: question,
      promptAnswer: answer,
    });
  };

  const handleLikePhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPromptLikeTarget({
      targetProfile: profile,
      photoUrl: profile.photos[photoIndex],
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: 'transform 0.1s ease-out',
      }}
      className="w-full max-w-md bg-surface rounded-4xl overflow-hidden border border-border shadow-soft hover:shadow-hover flex flex-col relative select-none"
    >
      {/* Subtle Specular Sheen for 3D realism */}
      <div
        className="absolute inset-0 pointer-events-none z-30 opacity-40 mix-blend-soft-light transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.8) 0%, transparent 60%)`,
        }}
      />

      {/* Scrollable Editorial Profile Flow */}
      <div className="overflow-y-auto max-h-[540px] scrollbar-none space-y-4 p-4">
        {/* Full-bleed Portrait Container */}
        <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden bg-surface-sand shadow-soft">
          <img
            src={profile.photos[photoIndex]}
            alt={profile.name}
            className="w-full h-full object-cover pointer-events-none"
          />

          {/* Minimal progress dashes */}
          {profile.photos.length > 1 && (
            <div className="absolute top-3 inset-x-4 flex gap-1.5 z-20">
              {profile.photos.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1 flex-1 rounded-full transition-all ${
                    idx === photoIndex ? 'bg-surface shadow-soft' : 'bg-surface/35'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Touch tap zones for cycling photos */}
          <div onClick={prevPhoto} className="absolute left-0 top-0 bottom-16 w-1/3 z-10 cursor-pointer" />
          <div onClick={nextPhoto} className="absolute right-0 top-0 bottom-16 w-1/3 z-10 cursor-pointer" />

          {/* Quiet Verified Indicator */}
          {profile.isVerified && (
            <div className="absolute top-6 left-4 z-20">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface/90 backdrop-blur-md border border-border text-[11px] font-semibold text-ink-heading shadow-soft">
                <CheckCircle2 className="w-3.5 h-3.5 text-campus-sage" />
                <span>Verified Student</span>
              </span>
            </div>
          )}

          {/* Photo Heart / Comment Button */}
          <button
            onClick={handleLikePhoto}
            className="absolute bottom-4 right-4 z-20 w-11 h-11 rounded-full bg-surface hover:bg-paper text-terracotta-600 shadow-soft border border-border flex items-center justify-center transition active:scale-90 group"
            title="Comment on this photo"
          >
            <Heart className="w-5 h-5 group-hover:fill-terracotta-600 transition" />
          </button>

          {/* Natural Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink-heading/85 via-ink-heading/20 to-transparent pointer-events-none" />

          {/* Editorial Headline Overlay */}
          <div className="absolute bottom-4 left-4 right-16 z-20 text-white space-y-0.5">
            <h3 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-white">
              {profile.name}, {profile.age}
            </h3>
            <p className="text-xs text-white/85 font-medium">
              {profile.major} · {profile.campus}
            </p>
          </div>
        </div>

        {/* Quiet Intent & Campus Anchor Line */}
        <div className="px-1 py-1 flex items-center justify-between text-xs text-ink-muted">
          <span className="flex items-center gap-1.5 font-medium text-ink-heading">
            <MapPin className="w-3.5 h-3.5 text-terracotta-600" />
            {profile.hostel.split(',')[0]} Residence
          </span>
          <span className="font-semibold text-terracotta-700 bg-terracotta-50 px-2.5 py-0.5 rounded-full border border-terracotta-200 text-[11px]">
            {profile.relationshipIntent}
          </span>
        </div>

        {/* Short Bio (if present) */}
        {profile.bio && (
          <div className="p-4 rounded-2xl bg-paper border border-border space-y-1">
            <span className="text-[10px] uppercase font-bold text-ink-muted tracking-wider">
              About
            </span>
            <p className="text-xs text-ink-heading leading-relaxed font-normal">
              {profile.bio}
            </p>
          </div>
        )}

        {/* Hinge Prompts with Thoughtful Styling */}
        {profile.prompts.map((prompt, idx) => (
          <div
            key={idx}
            className="p-5 rounded-3xl bg-surface border border-border relative group shadow-soft hover:border-terracotta-300 transition duration-200"
          >
            <span className="text-[11px] font-serif font-bold text-terracotta-700 tracking-wide block mb-1">
              {prompt.question}
            </span>
            <p className="text-sm text-ink-heading font-normal leading-relaxed italic pr-12">
              &ldquo;{prompt.answer}&rdquo;
            </p>

            {/* Comment / Heart Button */}
            <button
              onClick={(e) => handleLikePrompt(e, prompt.question, prompt.answer)}
              className="absolute right-4 bottom-4 w-9 h-9 rounded-full bg-paper hover:bg-terracotta-50 text-ink-muted hover:text-terracotta-600 border border-border flex items-center justify-center transition active:scale-90"
              title="Reply to this prompt"
            >
              <Heart className="w-4 h-4 hover:fill-terracotta-600" />
            </button>
          </div>
        ))}

        {/* Second Photo (if available) */}
        {profile.photos.length > 1 && (
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-surface-sand border border-border shadow-soft">
            <img src={profile.photos[1]} alt="Campus life" className="w-full h-full object-cover" />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setPromptLikeTarget({ targetProfile: profile, photoUrl: profile.photos[1] });
              }}
              className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-surface hover:bg-paper text-terracotta-600 shadow-soft flex items-center justify-center transition active:scale-90 border border-border"
              title="Like this photo"
            >
              <Heart className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Favorite Campus Spot & Anthem */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="p-3.5 rounded-2xl bg-paper border border-border">
            <span className="text-[10px] text-ink-muted font-semibold flex items-center gap-1 mb-1">
              <Compass className="w-3.5 h-3.5 text-campus-gold" /> Favorite Spot
            </span>
            <p className="text-[11px] text-ink-heading font-medium leading-tight">
              {profile.favoriteCampusSpot}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-paper border border-border">
            <span className="text-[10px] text-ink-muted font-semibold flex items-center gap-1 mb-1">
              <Music className="w-3.5 h-3.5 text-terracotta-600" /> Campus Anthem
            </span>
            <p className="text-[11px] text-ink-heading font-medium leading-tight truncate">
              {profile.campusAnthem.title} · {profile.campusAnthem.artist}
            </p>
          </div>
        </div>

        {/* Interests & Society Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {profile.interests.map((item) => (
            <span
              key={item}
              className="px-2.5 py-1 rounded-full bg-paper border border-border text-ink-muted text-[11px] font-medium"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Tinder-Style Quick Actions Bar */}
      <div className="p-4 bg-surface border-t border-border flex items-center justify-center gap-5 z-20">
        {onRewind && (
          <button
            onClick={onRewind}
            className="w-11 h-11 rounded-full bg-paper hover:bg-surface-sand text-campus-gold flex items-center justify-center transition active:scale-90 border border-border shadow-soft"
            title="Rewind previous profile"
            aria-label="Undo previous swipe"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}

        {/* Pass Button */}
        <button
          onClick={() => onSwipe('pass')}
          className="w-13 h-13 rounded-full bg-surface hover:bg-paper text-ink-muted hover:text-ink-heading border border-border flex items-center justify-center transition active:scale-90 shadow-soft"
          title="Pass"
          aria-label="Pass"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Super Like Button */}
        <button
          onClick={() => onSwipe('super')}
          className="w-11 h-11 rounded-full bg-surface hover:bg-paper text-campus-gold border border-border flex items-center justify-center transition active:scale-90 shadow-soft"
          title="Super-Like"
          aria-label="Super-Like"
        >
          <Star className="w-5 h-5 fill-campus-gold" />
        </button>

        {/* Like Button */}
        <button
          onClick={() => onSwipe('like')}
          className="w-13 h-13 rounded-full bg-terracotta-600 hover:bg-terracotta-700 text-surface flex items-center justify-center transition active:scale-90 shadow-soft"
          title="Like"
          aria-label="Like"
        >
          <Heart className="w-6 h-6 fill-surface" />
        </button>
      </div>
    </div>
  );
};
