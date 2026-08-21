import React, { useState, useEffect } from 'react';
import { Flame, Clock, Zap, ShieldCheck, Star } from 'lucide-react';

export const HeroBanner: React.FC<{ onExploreOffers: () => void }> = ({ onExploreOffers }) => {
  // Countdown timer for Flash Double Bonus Carnival
  const [timeLeft, setTimeLeft] = useState({
    hours: 5,
    minutes: 42,
    seconds: 19,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#12141A] to-[#0D0F14] border-b border-white/5 px-3.5 sm:px-4 py-5">
      {/* Background ambient glow effect */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-4">
        {/* Event Tag */}
        <div className="flex items-center justify-start">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-black tracking-widest uppercase">
            <span className="flex h-1.5 w-1.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
            </span>
            <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
            <span>TOP-UP CARNIVAL</span>
          </div>
        </div>

        {/* Hero Heading */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-black italic uppercase leading-none tracking-tight text-white font-display">
            REFUEL YOUR <span className="text-amber-500">DIAMOND</span> VAULT
          </h1>
          <p className="text-gray-400 text-xs mt-1.5 leading-relaxed">
            Direct in-game delivery by numeric UID. Safe, authorized with guaranteed bonus diamonds.
          </p>
        </div>

        {/* Feature Highlights Row */}
        <div className="grid grid-cols-3 gap-2">
          {/* Tab 1: 5s Delivery */}
          <div
            id="badge-fast-delivery"
            className="flex items-center justify-center gap-2 p-2 sm:py-2.5 sm:px-3 rounded-xl bg-[#151821]/90 hover:bg-[#1A1F2C] border border-amber-500/25 hover:border-amber-500/50 transition-all group shadow-sm shadow-black/40"
          >
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center shrink-0 shadow-md shadow-amber-500/30 border border-amber-300/40 group-hover:scale-105 transition-transform">
              <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black fill-black" />
            </div>
            <span className="text-[11px] sm:text-xs font-black text-white font-heading uppercase tracking-wider whitespace-nowrap group-hover:text-amber-400 transition-colors">
              5s Delivery
            </span>
          </div>

          {/* Tab 2: No Password */}
          <div
            id="badge-no-password"
            className="flex items-center justify-center gap-2 p-2 sm:py-2.5 sm:px-3 rounded-xl bg-[#151821]/90 hover:bg-[#1A1F2C] border border-emerald-500/25 hover:border-emerald-500/50 transition-all group shadow-sm shadow-black/40"
          >
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/30 border border-emerald-300/40 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black stroke-[2.5]" />
            </div>
            <span className="text-[11px] sm:text-xs font-black text-white font-heading uppercase tracking-wider whitespace-nowrap group-hover:text-emerald-400 transition-colors">
              No Password
            </span>
          </div>

          {/* Tab 3: 4.9★ Rating */}
          <div
            id="badge-top-rating"
            className="flex items-center justify-center gap-2 p-2 sm:py-2.5 sm:px-3 rounded-xl bg-[#151821]/90 hover:bg-[#1A1F2C] border border-yellow-500/25 hover:border-yellow-500/50 transition-all group shadow-sm shadow-black/40"
          >
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-gradient-to-br from-yellow-300 via-amber-400 to-amber-500 flex items-center justify-center shrink-0 shadow-md shadow-yellow-500/30 border border-yellow-200/50 group-hover:scale-105 transition-transform">
              <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black fill-black" />
            </div>
            <span className="text-[11px] sm:text-xs font-black text-white font-heading uppercase tracking-wider whitespace-nowrap group-hover:text-yellow-400 transition-colors">
              4.9★ Rating
            </span>
          </div>
        </div>

        {/* Flash Event Card & Timer */}
        <div className="rounded-xl bg-[#16181F] p-3.5 border border-white/10 shadow-lg relative">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-2 font-medium">
            <span className="flex items-center gap-1 text-amber-400 font-bold uppercase tracking-wider text-[10px]">
              <Clock className="w-3 h-3 text-amber-400" />
              Flash Drop Ends In:
            </span>
            <span className="text-emerald-400 font-bold text-[10px]">Active Now</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center font-mono">
            <div className="bg-black/50 rounded-lg p-1.5 border border-white/5">
              <span className="text-xl font-black text-amber-500 font-display">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <div className="text-[9px] text-gray-500 uppercase tracking-wider font-heading">Hours</div>
            </div>
            <div className="bg-black/50 rounded-lg p-1.5 border border-white/5">
              <span className="text-xl font-black text-amber-500 font-display">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <div className="text-[9px] text-gray-500 uppercase tracking-wider font-heading">Mins</div>
            </div>
            <div className="bg-black/50 rounded-lg p-1.5 border border-white/5">
              <span className="text-xl font-black text-amber-500 font-display">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <div className="text-[9px] text-gray-500 uppercase tracking-wider font-heading">Secs</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
