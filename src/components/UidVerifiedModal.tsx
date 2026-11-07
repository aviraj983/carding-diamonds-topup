import React from 'react';
import { PlayerProfile } from '../types';
import { CheckCircle2, ShieldCheck, ArrowRight, User, Globe, Trophy, X, Sparkles } from 'lucide-react';

interface UidVerifiedModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: PlayerProfile | null;
  onProceed?: () => void;
}

export const UidVerifiedModal: React.FC<UidVerifiedModalProps> = ({
  isOpen,
  onClose,
  profile,
  onProceed,
}) => {
  if (!isOpen || !profile) return null;

  const handleConfirm = () => {
    onClose();
    if (onProceed) {
      onProceed();
    } else {
      const section = document.getElementById('step-2-select-diamonds') || document.getElementById('select-diamonds-section');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-sm rounded-2xl bg-gradient-to-b from-[#181C26] via-[#12151D] to-[#0D0F14] border border-emerald-500/40 p-5 sm:p-6 shadow-[0_0_50px_rgba(16,185,129,0.25)] overflow-hidden text-center animate-success-pop"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3.5 right-3.5 w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer z-20"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Ambient Glows */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-36 h-36 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* ─── Engaging Animated Green Tick Header ─── */}
        <div className="relative mx-auto mb-3.5 w-20 h-20 flex items-center justify-center">
          {/* Concentric pulsing ripple rings */}
          <div className="absolute inset-0 rounded-full bg-emerald-500/25 animate-success-ripple pointer-events-none" />
          <div className="absolute -inset-1.5 rounded-full border border-emerald-400/30 animate-pulse pointer-events-none" />

          {/* Core Green Check Badge */}
          <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 p-[2.5px] shadow-[0_0_35px_rgba(16,185,129,0.55)]">
            <div className="w-full h-full rounded-full bg-[#0D1117] flex items-center justify-center">
              <svg
                className="w-10 h-10 text-emerald-400"
                viewBox="0 0 52 52"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Animated Outer Circle */}
                <circle
                  cx="26"
                  cy="26"
                  r="23"
                  stroke="#10B981"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  className="animate-checkmark-circle"
                />
                {/* Animated Checkmark Line */}
                <path
                  d="M15 27L22.5 34.5L37 19"
                  stroke="#10B981"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="animate-checkmark-draw"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Status Pill Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/35 text-emerald-400 text-[11px] font-black uppercase tracking-wider font-heading mb-2 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Player UID Verified</span>
          <Sparkles className="w-3 h-3 text-emerald-300" />
        </div>

        {/* Requested Headline: PLAYER VERIFIED */}
        <h3 className="text-xl sm:text-2xl font-black font-heading tracking-wider uppercase text-white drop-shadow-[0_2px_12px_rgba(16,185,129,0.35)]">
          Player Verified
        </h3>
        <p className="text-xs text-gray-300/80 mt-1 max-w-[280px] mx-auto leading-relaxed">
          Official in-game Free Fire profile confirmed & ready for instant top-up.
        </p>

        {/* Player Profile Details Card */}
        <div className="mt-4 p-3.5 rounded-xl bg-black/60 border border-white/10 text-left space-y-2.5 backdrop-blur-sm">
          {/* IGN */}
          <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-2.5">
            <span className="text-[11px] text-gray-400 flex items-center gap-1.5 font-semibold">
              <User className="w-3.5 h-3.5 text-amber-400" />
              In-Game Name (IGN)
            </span>
            <span className="text-sm font-black text-amber-400 font-heading tracking-wide truncate max-w-[170px] bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
              {profile.ign}
            </span>
          </div>

          {/* Player UID */}
          <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-2.5">
            <span className="text-[11px] text-gray-400 flex items-center gap-1.5 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Player UID
            </span>
            <span className="text-xs font-mono font-bold text-white tracking-wider">
              {profile.uid}
            </span>
          </div>

          {/* Region / Server */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] text-gray-400 flex items-center gap-1.5 font-semibold">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              Region / Server
            </span>
            <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
              <Trophy className="w-3 h-3 text-yellow-400" />
              {profile.region || 'Free Fire Global'}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-4 pt-1">
          <button
            onClick={handleConfirm}
            className="group w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-black text-xs sm:text-sm uppercase tracking-wider font-heading flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Confirm & Choose Diamonds</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};
