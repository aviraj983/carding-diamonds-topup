import React, { useState } from 'react';
import { SPIN_PRIZES } from '../data/mockData';
import { SpinPrize, PromoCode } from '../types';
import confetti from 'canvas-confetti';
import { X, Gift, Sparkles, Trophy, Zap, ArrowRight, Check } from 'lucide-react';

interface LuckySpinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyPrizeCode: (promo: PromoCode) => void;
}

export const LuckySpinModal: React.FC<LuckySpinModalProps> = ({
  isOpen,
  onClose,
  onApplyPrizeCode,
}) => {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState<SpinPrize | null>(null);
  const [hasSpun, setHasSpun] = useState(false);

  const numSlices = SPIN_PRIZES.length;
  const sliceAngle = 360 / numSlices;

  const handleSpin = () => {
    if (spinning || hasSpun) return;

    setSpinning(true);
    setWonPrize(null);

    // Pick random prize index
    const randomIndex = Math.floor(Math.random() * numSlices);
    const prize = SPIN_PRIZES[randomIndex];

    // Calculate rotation: 5 full spins (1800 deg) + target angle
    // Note: Slice 0 is at top (270 deg)
    const targetSliceAngle = randomIndex * sliceAngle + sliceAngle / 2;
    const finalAngle = 360 * 6 + (360 - targetSliceAngle);

    setRotation(finalAngle);

    setTimeout(() => {
      setSpinning(false);
      setWonPrize(prize);
      setHasSpun(true);

      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {}

      // If discount prize with code, prepare promo
      if (prize.code) {
        onApplyPrizeCode({
          code: prize.code,
          discountPercent: prize.value,
          maxDiscountUSD: 10,
          bonusDiamonds: prize.value * 2,
          description: `Lucky Spin Prize: ${prize.name}`,
        });
      } else if (prize.type === 'diamonds') {
        onApplyPrizeCode({
          code: `SPIN${prize.value}`,
          discountPercent: 10,
          maxDiscountUSD: 5,
          bonusDiamonds: prize.value,
          description: `Won +${prize.value} Free Diamonds from Lucky Spin`,
        });
      }
    }, 4500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#16181F] border border-white/10 rounded-2xl w-full max-w-[380px] max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl relative">
        
        {/* Header */}
        <div className="bg-[#0F1115] px-4 py-3 border-b border-white/5 flex items-center justify-between text-white font-heading font-extrabold text-sm uppercase tracking-wider sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Gift className="w-4 h-4 text-amber-500" />
            <span>DAILY LUCKY WHEEL</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 text-center space-y-4">
          <p className="text-[11px] text-gray-300">
            Spin to win up to <strong className="text-amber-500">500 Free Diamonds</strong> or <strong className="text-emerald-400">50% MEGA Discounts</strong>!
          </p>

          {/* Wheel Container */}
          <div className="relative w-56 h-56 mx-auto flex items-center justify-center">
            {/* Top Pointer Indicator */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none drop-shadow-lg">
              <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[22px] border-t-amber-500 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
            </div>

            {/* Rotating SVG Wheel */}
            <div
              className="w-full h-full rounded-full border-4 border-amber-500/80 shadow-2xl shadow-amber-500/10 relative transition-all duration-[4500ms] ease-out overflow-hidden"
              style={{
                transform: `rotate(${rotation}deg)`,
              }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                {SPIN_PRIZES.map((prize, idx) => {
                  const startAngle = (idx * 360) / numSlices;
                  const endAngle = ((idx + 1) * 360) / numSlices;
                  const startRad = (startAngle * Math.PI) / 180;
                  const endRad = (endAngle * Math.PI) / 180;

                  const x1 = 50 + 50 * Math.cos(startRad);
                  const y1 = 50 + 50 * Math.sin(startRad);
                  const x2 = 50 + 50 * Math.cos(endRad);
                  const y2 = 50 + 50 * Math.sin(endRad);

                  const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;

                  return (
                    <g key={prize.id}>
                      <path d={pathData} fill={prize.color} stroke="#0A0B0D" strokeWidth="0.8" />
                    </g>
                  );
                })}
              </svg>

              {/* Text labels on slices */}
              <div className="absolute inset-0 pointer-events-none">
                {SPIN_PRIZES.map((prize, idx) => {
                  const angle = idx * sliceAngle + sliceAngle / 2;
                  return (
                    <div
                      key={prize.id}
                      className="absolute w-full h-full flex items-start justify-center pt-2"
                      style={{
                        transform: `rotate(${angle}deg)`,
                      }}
                    >
                      <span
                        className="text-[9px] font-extrabold uppercase font-heading tracking-tighter"
                        style={{ color: prize.textColor }}
                      >
                        {prize.name.split(' ')[0]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Center Hub */}
            <div className="absolute z-10 w-14 h-14 rounded-full bg-amber-500 p-1 shadow-lg shadow-black/60 flex items-center justify-center">
              <div className="w-full h-full bg-[#0A0B0D] rounded-full flex items-center justify-center font-display font-black text-amber-500 text-base">
                💎
              </div>
            </div>
          </div>

          {/* Winner Result Box */}
          {wonPrize && (
            <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-xl p-3.5 text-center animate-in zoom-in-95 duration-200">
              <div className="text-xs text-emerald-400 font-bold uppercase font-heading flex items-center justify-center gap-1">
                <Sparkles className="w-4 h-4" />
                CONGRATULATIONS!
              </div>
              <div className="text-xl font-display font-bold text-white mt-0.5">
                You Won: <span className="text-amber-500">{wonPrize.name}</span>
              </div>
              <p className="text-[11px] text-gray-300 mt-1">
                Prize coupon has been automatically applied to your checkout review!
              </p>
            </div>
          )}

          {/* Spin Button */}
          <div>
            <button
              onClick={handleSpin}
              disabled={spinning || hasSpun}
              className={`w-full py-3.5 px-6 rounded-xl font-heading font-extrabold text-lg uppercase tracking-wider transition-all cursor-pointer ${
                spinning
                  ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                  : hasSpun
                  ? 'bg-emerald-600 text-black cursor-default'
                  : 'bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/20'
              }`}
            >
              {spinning ? (
                'Spinning...'
              ) : hasSpun ? (
                <span className="flex items-center justify-center gap-1.5 font-bold text-black">
                  <Check className="w-5 h-5" /> Prize Claimed
                </span>
              ) : (
                'SPIN WHEEL NOW'
              )}
            </button>

            {hasSpun && (
              <button
                onClick={onClose}
                className="mt-3 text-xs text-amber-500 hover:text-amber-400 font-heading uppercase font-bold flex items-center justify-center gap-1 mx-auto cursor-pointer"
              >
                <span>Continue to Checkout with Discount</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
