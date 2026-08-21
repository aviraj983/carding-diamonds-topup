import React, { useState } from 'react';
import { PlayerProfile } from '../types';
import { SAMPLE_PLAYERS } from '../data/mockData';
import { User, CheckCircle2, AlertCircle, HelpCircle, Loader2, Sparkles, Trophy, Flame, Shield, Globe } from 'lucide-react';
import { UidVerifiedModal } from './UidVerifiedModal';

interface PlayerIdStepProps {
  playerUid: string;
  onUidChange: (uid: string) => void;
  playerProfile: PlayerProfile | null;
  onProfileVerified: (profile: PlayerProfile | null) => void;
  onOpenUidGuide: () => void;
}

export const PlayerIdStep: React.FC<PlayerIdStepProps> = ({
  playerUid,
  onUidChange,
  playerProfile,
  onProfileVerified,
  onOpenUidGuide,
}) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showVerifiedModal, setShowVerifiedModal] = useState(false);

  const handleVerify = async (uidToVerify = playerUid) => {
    const cleanUid = uidToVerify.trim();
    if (!cleanUid) {
      setErrorMessage('Please enter your Free Fire Player ID (UID)');
      onProfileVerified(null);
      return;
    }

    if (!/^\d{5,14}$/.test(cleanUid)) {
      setErrorMessage('Player ID must be 5 to 14 numerical digits.');
      onProfileVerified(null);
      return;
    }

    setErrorMessage(null);
    setIsVerifying(true);

    try {
      // Call our backend RapidAPI proxy
      const res = await fetch(`/api/verify-uid?uid=${encodeURIComponent(cleanUid)}`);
      const resData = await res.json().catch(() => null);

      if (res.ok && resData && !resData.error && resData.data?.username) {
        const verifiedData = resData.data;
        const profile: PlayerProfile = {
          uid: verifiedData.id || cleanUid,
          ign: verifiedData.username,
          level: 65,
          rank: 'Grandmaster',
          avatarUrl: '/player-avatar.svg',
          region: 'Free Fire Global',
          guild: '★ELITE_CLAN★',
          likes: 9999,
          verified: true,
        };

        onProfileVerified(profile);
        setShowVerifiedModal(true);
      } else if (res.ok && resData && !resData.error && resData.username) {
        // Direct response format variant
        const profile: PlayerProfile = {
          uid: resData.id || cleanUid,
          ign: resData.username,
          level: resData.level || 65,
          rank: 'Heroic',
          avatarUrl: '/player-avatar.svg',
          region: 'Free Fire Global',
          guild: '★ELITE_CLAN★',
          likes: 8888,
          verified: true,
        };

        onProfileVerified(profile);
        setShowVerifiedModal(true);
      } else {
        // Invalid or fake UID: API did not find a valid player username
        onProfileVerified(null);
        setShowVerifiedModal(false);
        setErrorMessage('Please enter correct uid and try again');
      }
    } catch (err) {
      console.error('RapidAPI verification error:', err);
      onProfileVerified(null);
      setShowVerifiedModal(false);
      setErrorMessage('Please enter correct uid and try again');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="bg-[#16181F] rounded-2xl border border-white/5 p-4 shadow-lg relative overflow-hidden" id="step-1-player-id">
      {/* Section Header */}
      <div className="flex items-center justify-between gap-2 mb-3.5 border-b border-white/5 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-black font-black text-xs flex items-center justify-center shadow-md shadow-amber-500/25 border border-amber-300/40 shrink-0 font-heading">
            1
          </span>
          <h2 className="text-base font-black font-heading text-white tracking-wider uppercase">
            Enter Player ID (UID)
          </h2>
        </div>

        <button
          onClick={onOpenUidGuide}
          className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10 transition-colors cursor-pointer"
          title="Where to find UID"
        >
          <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
          <span>Find UID</span>
        </button>
      </div>

      {/* Input Form */}
      <div className="space-y-2.5">
        <div>
          <div className="flex items-center justify-between mb-1.5 text-[11px]">
            <label className="font-bold uppercase tracking-wider text-gray-400 font-heading">
              Free Fire Numeric UID <span className="text-amber-500">*</span>
            </label>
            <span className="flex items-center gap-1 text-emerald-400 font-semibold font-heading uppercase text-[10px]">
              <Globe className="w-3 h-3" /> Global Direct Server
            </span>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              <User className="w-4 h-4 text-amber-500" />
            </div>
            <input
              type="text"
              value={playerUid}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 12);
                onUidChange(val);
                if (playerProfile) onProfileVerified(null);
                setErrorMessage(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleVerify();
              }}
              placeholder="e.g. 123456789"
              maxLength={12}
              className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-9 pr-24 text-white font-mono text-sm focus:outline-none focus:border-amber-500 transition-colors placeholder:text-gray-600 font-bold tracking-wider"
              id="player-uid-input"
            />

            {/* Verify Button inside Input */}
            <button
              onClick={() => handleVerify()}
              disabled={isVerifying || !playerUid}
              className="absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-[11px] uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 shadow cursor-pointer"
              id="verify-uid-btn"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Checking</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3 h-3 fill-black" />
                  <span>Verify</span>
                </>
              )}
            </button>
          </div>

          {errorMessage && (
            <p className="mt-1.5 text-[11px] text-red-400 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errorMessage}
            </p>
          )}
        </div>
      </div>

      {/* Verified Account Preview Card */}
      {playerProfile && (
        <div className="mt-3.5 p-3 rounded-xl bg-black/50 border border-emerald-500/30 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <img
                src="/player-avatar.svg"
                alt="Player Profile Avatar"
                className="w-11 h-11 rounded-xl object-contain bg-white border-2 border-amber-400 shadow-md shadow-amber-500/20 p-0.5"
                referrerPolicy="no-referrer"
              />
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-black rounded-full p-0.5 shadow-md">
                <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-400 text-black" />
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-black text-sm text-amber-400 tracking-wide truncate">
                  {playerProfile.ign}
                </span>
                <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[9px] uppercase font-black px-2 py-0.5 rounded-full shrink-0 flex items-center gap-0.5">
                  <Shield className="w-2.5 h-2.5" />
                  Verified
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                <span>UID: <strong className="font-mono text-white tracking-wider">{playerProfile.uid}</strong></span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold">{playerProfile.region || 'Free Fire Global'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Verification Success Popup Modal */}
      <UidVerifiedModal
        isOpen={showVerifiedModal}
        onClose={() => setShowVerifiedModal(false)}
        profile={playerProfile}
      />
    </div>
  );
};
