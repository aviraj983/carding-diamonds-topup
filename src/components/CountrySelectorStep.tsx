import React from 'react';
import { CountryCode } from '../types';
import { Globe, Check } from 'lucide-react';

interface CountrySelectorStepProps {
  selectedCountry: CountryCode;
  onSelectCountry: (country: CountryCode) => void;
}

export const CountrySelectorStep: React.FC<CountrySelectorStepProps> = ({
  selectedCountry,
  onSelectCountry,
}) => {
  return (
    <div className="bg-[#16181F] rounded-2xl border border-white/5 p-4 shadow-lg space-y-3.5" id="step-0-country-select">
      {/* Section Header */}
      <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-black font-black text-xs flex items-center justify-center shadow-md shadow-amber-500/25 border border-amber-300/40 shrink-0 font-heading">
            1
          </span>
          <h2 className="text-base font-black font-heading text-white tracking-wider uppercase">
            Select Country
          </h2>
        </div>

        <div className="flex items-center gap-1 bg-black/40 border border-white/10 px-2 py-0.5 rounded-lg text-[10px] font-bold text-amber-400 font-heading uppercase">
          <Globe className="w-3 h-3 text-amber-400" />
          <span>Regional Server</span>
        </div>
      </div>

      {/* Two Country Options: India & Bangladesh */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* India Option */}
        <button
          type="button"
          onClick={() => onSelectCountry('IN')}
          className={`relative rounded-xl p-3 text-left transition-all duration-200 border cursor-pointer flex flex-col justify-between ${
            selectedCountry === 'IN'
              ? 'bg-[#1A1D24] border-2 border-amber-500 shadow-md shadow-amber-500/20 ring-1 ring-amber-500/30'
              : 'bg-black/40 border-white/10 hover:border-amber-500/40 hover:bg-white/5'
          }`}
          id="country-opt-india"
        >
          {/* Active / Top Row */}
          <div className="flex items-center justify-between mb-2">
            {/* India Flag SVG */}
            <div className="w-9 h-6 rounded-md overflow-hidden border border-white/20 shadow-sm flex flex-col shrink-0">
              <div className="h-2 bg-[#FF9933] w-full" />
              <div className="h-2 bg-white w-full flex items-center justify-center relative">
                <div className="w-1.5 h-1.5 rounded-full border border-[#000080] flex items-center justify-center">
                  <div className="w-0.5 h-0.5 bg-[#000080] rounded-full" />
                </div>
              </div>
              <div className="h-2 bg-[#128807] w-full" />
            </div>

            <div
              className={`w-4 h-4 rounded-full flex items-center justify-center border transition-colors ${
                selectedCountry === 'IN'
                  ? 'bg-amber-500 border-amber-500 text-black'
                  : 'border-white/20 bg-black/40'
              }`}
            >
              {selectedCountry === 'IN' && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
          </div>

          {/* Country Name & Currency Details */}
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-extrabold text-sm text-white tracking-wide">
                India
              </span>
              <span className="text-xs">🇮🇳</span>
            </div>
            <div className="mt-0.5 flex items-center gap-1.5">
              <span className="text-[11px] font-mono font-bold text-amber-400">
                INR (₹)
              </span>
              <span className="text-[9px] text-gray-400">• UPI Pay</span>
            </div>
          </div>
        </button>

        {/* Bangladesh Option */}
        <button
          type="button"
          onClick={() => onSelectCountry('BD')}
          className={`relative rounded-xl p-3 text-left transition-all duration-200 border cursor-pointer flex flex-col justify-between ${
            selectedCountry === 'BD'
              ? 'bg-[#1A1D24] border-2 border-amber-500 shadow-md shadow-amber-500/20 ring-1 ring-amber-500/30'
              : 'bg-black/40 border-white/10 hover:border-amber-500/40 hover:bg-white/5'
          }`}
          id="country-opt-bangladesh"
        >
          {/* Active / Top Row */}
          <div className="flex items-center justify-between mb-2">
            {/* Bangladesh Flag SVG */}
            <div className="w-9 h-6 rounded-md overflow-hidden border border-white/20 shadow-sm bg-[#006A4E] relative flex items-center justify-center shrink-0">
              <div className="w-3.5 h-3.5 rounded-full bg-[#F42A41] -translate-x-[2px]" />
            </div>

            <div
              className={`w-4 h-4 rounded-full flex items-center justify-center border transition-colors ${
                selectedCountry === 'BD'
                  ? 'bg-amber-500 border-amber-500 text-black'
                  : 'border-white/20 bg-black/40'
              }`}
            >
              {selectedCountry === 'BD' && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
          </div>

          {/* Country Name & Currency Details */}
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-extrabold text-sm text-white tracking-wide">
                Bangladesh
              </span>
              <span className="text-xs">🇧🇩</span>
            </div>
            <div className="mt-0.5 flex items-center gap-1.5">
              <span className="text-[11px] font-mono font-bold text-emerald-400">
                BDT (৳)
              </span>
              <span className="text-[9px] text-gray-400">• bKash Pay</span>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};
