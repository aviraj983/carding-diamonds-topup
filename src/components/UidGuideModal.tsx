import React from 'react';
import { X, Copy, User, HelpCircle, CheckCircle2 } from 'lucide-react';

interface UidGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UidGuideModal: React.FC<UidGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#16181F] border border-white/10 rounded-2xl w-full max-w-[380px] max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl relative">
        
        {/* Header */}
        <div className="bg-[#0F1115] px-4 py-3 border-b border-white/5 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-amber-500" />
            <h3 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
              Where to find UID?
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-3.5">
          <p className="text-[11px] text-gray-300">
            Follow these 3 simple steps inside Free Fire to locate your numeric Player ID:
          </p>

          <div className="space-y-2 text-xs">
            {/* Step 1 */}
            <div className="bg-black/40 rounded-xl p-2.5 border border-white/5 flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-amber-500 text-black font-extrabold flex items-center justify-center shrink-0 font-heading text-[11px]">
                1
              </div>
              <div>
                <h4 className="font-heading font-bold text-xs text-white uppercase">
                  Open Free Fire & Tap Profile
                </h4>
                <p className="text-gray-400 mt-0.5 text-[11px] leading-tight">
                  Launch Free Fire and tap on your <strong>Player Avatar banner</strong> in the top-left corner.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-black/40 rounded-xl p-2.5 border border-white/5 flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-amber-500 text-black font-extrabold flex items-center justify-center shrink-0 font-heading text-[11px]">
                2
              </div>
              <div>
                <h4 className="font-heading font-bold text-xs text-white uppercase">
                  Check &quot;Basic Info&quot; Tab
                </h4>
                <p className="text-gray-400 mt-0.5 text-[11px] leading-tight">
                  In your profile window, see your nickname and numeric Player ID under your banner.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-black/40 rounded-xl p-2.5 border border-white/5 flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-amber-500 text-black font-extrabold flex items-center justify-center shrink-0 font-heading text-[11px]">
                3
              </div>
              <div>
                <h4 className="font-heading font-bold text-xs text-white uppercase">
                  Click the Copy Icon
                </h4>
                <p className="text-gray-400 mt-0.5 text-[11px] leading-tight">
                  Tap the small <strong>[Copy]</strong> icon next to your UID and paste it here in Step 1.
                </p>
              </div>
            </div>
          </div>

          {/* Safety Reminder */}
          <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-2.5 text-[10px] text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>
              <strong>100% Safe:</strong> Only public numeric UID is needed. No password required.
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-heading font-extrabold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow"
          >
            Got It, Return to Top-Up
          </button>
        </div>
      </div>
    </div>
  );
};
