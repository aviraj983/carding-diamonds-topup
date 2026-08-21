import React, { useState, useEffect } from 'react';
import { RECENT_TOPUPS_FEED } from '../data/mockData';
import { Zap, Shield, CheckCircle2 } from 'lucide-react';

export const LiveTicker: React.FC = () => {
  const [feed, setFeed] = useState(RECENT_TOPUPS_FEED);
  const [activeCount, setActiveCount] = useState(4829);

  // Rotate simulated feed items dynamically
  useEffect(() => {
    const interval = setInterval(() => {
      setFeed((prev) => {
        const first = prev[0];
        const rest = prev.slice(1);
        // randomize count slightly
        setActiveCount((c) => Math.floor(4800 + Math.random() * 250));
        return [...rest, { ...first, time: 'Just now' }];
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#0F1115] border-y border-white/5 py-2.5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-2">
        {/* Left Live Badge */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-bold uppercase tracking-widest text-gray-300 flex items-center gap-1.5 font-heading">
            <span className="text-emerald-400 font-mono font-bold">{activeCount.toLocaleString()}</span> Players Active
          </span>
          <div className="hidden sm:flex items-center gap-1 text-[11px] text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
            <Zap className="w-3 h-3 fill-amber-500" />
            <span>Avg. Delivery: 4.8s</span>
          </div>
        </div>

        {/* Scrolling / Animated Marquee */}
        <div className="flex-1 overflow-hidden relative">
          <div className="flex items-center gap-4 animate-none text-xs text-gray-300 font-medium whitespace-nowrap overflow-x-auto no-scrollbar py-0.5">
            {feed.slice(0, 4).map((item, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-2 bg-[#16181D] border border-white/5 px-3 py-1 rounded-lg text-xs"
              >
                <span className="text-gray-400 font-mono text-[11px]">{item.country}</span>
                <span className="text-gray-400 font-mono">{item.uid}</span>
                <span className="text-gray-500">purchased</span>
                <span className="text-emerald-400 font-bold">{item.pack}</span>
                <span className="text-[10px] text-gray-500 flex items-center gap-0.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Guarantee */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-gray-500 shrink-0">
          <Shield className="w-3.5 h-3.5 text-amber-500" />
          <span>256-Bit Encrypted Direct Ingress</span>
        </div>
      </div>
    </div>
  );
};
