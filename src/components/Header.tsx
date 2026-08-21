import React from 'react';
import { CurrencyCode } from '../types';
import { Flame, Search, HelpCircle, ShieldCheck, Zap } from 'lucide-react';

interface HeaderProps {
  currentCurrency?: CurrencyCode;
  onCurrencyChange?: (currency: CurrencyCode) => void;
  onOpenLuckySpin?: () => void;
  onOpenOrderTracker: () => void;
  onOpenUidGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenOrderTracker,
  onOpenUidGuide,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0F1115]/95 backdrop-blur-md border-b border-white/5 w-full">
      {/* Professional Top Flash Drop Marquee Bar */}
      <div className="bg-gradient-to-r from-[#12141A] via-[#161922] to-[#12141A] border-b border-amber-500/20 text-gray-300 text-[11px] py-1.5 px-2 flex items-center gap-2 overflow-hidden shadow-inner" id="top-flash-drop-header">
        {/* Left Badge */}
        <div className="flex items-center gap-1 bg-amber-500 text-black px-2 py-0.5 rounded font-heading font-black text-[9px] uppercase tracking-wider shrink-0 shadow-sm shadow-amber-500/20">
          <Zap className="w-2.5 h-2.5 fill-black" />
          <span>FLASH DROP</span>
        </div>

        {/* Marquee Container with subtle gradient edge fades */}
        <div className="relative flex-1 overflow-hidden mask-fade-edges whitespace-nowrap">
          <div className="animate-marquee flex items-center gap-6 text-[10.5px] font-heading font-bold tracking-wider text-gray-200 uppercase">
            <span className="flex items-center gap-1.5 text-amber-400 font-extrabold">
              <Flame className="w-3 h-3 text-amber-500 fill-amber-500 inline" />
              FREE FIRE CHEAP DIAMOND TOP-UP
            </span>
            <span className="text-gray-500">•</span>
            <span className="text-emerald-400 flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-3 h-3 inline" /> 100% INSTANT UID CREDIT
            </span>
            <span className="text-gray-500">•</span>
            <span className="text-white font-bold flex items-center gap-1">
              💎 CHEAPEST RATES GUARANTEED
            </span>
            <span className="text-gray-500">•</span>
            <span className="text-amber-400 font-extrabold flex items-center gap-1">
              ⚡ 5-SEC AUTO DELIVERY
            </span>
            <span className="text-gray-500">•</span>
            {/* Duplicated for smooth infinite loop */}
            <span className="flex items-center gap-1.5 text-amber-400 font-extrabold">
              <Flame className="w-3 h-3 text-amber-500 fill-amber-500 inline" />
              FREE FIRE CHEAP DIAMOND TOP-UP
            </span>
            <span className="text-gray-500">•</span>
            <span className="text-emerald-400 flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-3 h-3 inline" /> 100% INSTANT UID CREDIT
            </span>
            <span className="text-gray-500">•</span>
            <span className="text-white font-bold flex items-center gap-1">
              💎 CHEAPEST RATES GUARANTEED
            </span>
            <span className="text-gray-500">•</span>
            <span className="text-amber-400 font-extrabold flex items-center gap-1">
              ⚡ 5-SEC AUTO DELIVERY
            </span>
            <span className="text-gray-500">•</span>
          </div>
        </div>

        {/* Live Status indicator */}
        <div className="shrink-0 hidden xs:flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-1.5 py-0.5 rounded text-[9px] font-bold font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
          <span>LIVE</span>
        </div>
      </div>

      <div className="px-3.5 sm:px-4 py-2.5">
        <div className="flex items-center justify-between gap-2">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group shrink-0">
            <div className="w-9 h-9 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20 transform group-hover:scale-105 transition-all">
              <span className="font-heading font-black text-base text-black tracking-tighter leading-none select-none">
                CD
              </span>
            </div>
            <div className="flex flex-col justify-center -space-y-0.5">
              <div className="flex items-center gap-1 leading-none">
                <span className="font-display font-black text-lg sm:text-xl tracking-tight uppercase italic text-white">
                  CARDING
                </span>
                <span className="font-display font-black text-lg sm:text-xl tracking-tight uppercase italic text-amber-400">
                  DIAMONDS
                </span>
              </div>
              <span className="text-[7.5px] font-mono tracking-widest text-emerald-400 uppercase font-semibold leading-none pt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                SERVER ACTIVE
              </span>
            </div>
          </a>

          {/* Quick Actions & Currency */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Track Order Button */}
            <button
              onClick={onOpenOrderTracker}
              className="p-2 rounded-lg bg-[#16181D] hover:bg-white/10 border border-white/10 text-gray-300 transition-colors cursor-pointer"
              title="Track Order Status"
              id="track-order-header-btn"
            >
              <Search className="w-3.5 h-3.5 text-amber-500" />
            </button>

            {/* INR Currency Fixed Badge */}
            <div
              className="bg-[#16181D] border border-amber-500/30 text-amber-400 text-[11px] font-bold py-1.5 px-2.5 rounded-lg flex items-center gap-1 font-mono shadow-inner select-none"
              title="Currency: Indian Rupee (INR)"
              id="currency-badge-inr"
            >
              <span className="text-white font-extrabold">₹</span>
              <span>INR</span>
            </div>

            {/* Help / UID Guide */}
            <button
              onClick={onOpenUidGuide}
              className="p-2 rounded-lg bg-[#16181D] hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
              title="How to find your Free Fire UID?"
              id="uid-guide-header-btn"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
