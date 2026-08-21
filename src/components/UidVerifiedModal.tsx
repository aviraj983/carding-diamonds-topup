import React from 'react';
import { PlayerProfile } from '../types';
import { CheckCircle2, ShieldCheck, Flame, ArrowRight, User, Globe, Trophy } from 'lucide-react';

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
      const section = document.getElementById('select-diamonds-section');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-sm rounded-2xl bg-[#151821] border border-emerald-500/40 p-5 shadow-2xl shadow-emerald-500/20 overflow-hidden text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow background decoration */}
        <div className="absolute -top-16 -left-16 w-36 h-36 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-36 h-36 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Player Profile Avatar */}
        <div className="relative mx-auto mb-3.5 w-18 h-18 flex items-center justify-center">
          <img
            src="/player-avatar.svg"
            alt="Player Profile Avatar"
            className="w-16 h-16 rounded-2xl object-contain bg-white border-2 border-amber-400 shadow-xl shadow-amber-500/25 p-1"
            referrerPolicy="no-referrer"
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-black text-xs font-black shadow-lg border border-black/30">
            ✓
          </div>
        </div>

        {/* Status Title */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-wider font-heading mb-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Player UID Verified</span>
        </div>

        <h3 className="text-lg font-black text-white font-heading tracking-wide uppercase">
          Free Fire Account Found
        </h3>
        <p className="text-xs text-gray-400 mt-0.5">
          Your in-game identity has been validated successfully.
        </p>

        {/* Account Details Box */}
        <div className="mt-4 p-3.5 rounded-xl bg-black/60 border border-white/10 text-left space-y-2.5">
          {/* IGN */}
          <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-2">
            <span className="text-[11px] text-gray-400 flex items-center gap-1 font-semibold">
              <User className="w-3.5 h-3.5 text-amber-400" />
              In-Game Name (IGN)
            </span>
            <span className="text-sm font-black text-amber-400 font-heading tracking-wide truncate max-w-[180px]">
              {profile.ign}
            </span>
          </div>

          {/* UID */}
          <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-2">
            <span className="text-[11px] text-gray-400 flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
              Player UID
            </span>
            <span className="text-xs font-mono font-bold text-white tracking-wider">
              {profile.uid}
            </span>
          </div>

          {/* Server / Region */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] text-gray-400 flex items-center gap-1 font-semibold">
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              Region / Server
            </span>
            <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
              <Trophy className="w-3 h-3 text-yellow-400" />
              {profile.region || 'Free Fire Global'}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-5 space-y-2">
          <button
            onClick={handleConfirm}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-black text-xs uppercase tracking-wider font-heading flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Confirm & Choose Diamonds</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
