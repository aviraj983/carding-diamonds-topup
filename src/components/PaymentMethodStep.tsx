import React from 'react';
import { CountryCode, PaymentMethod } from '../types';
import { PAYMENT_METHODS_IN, PAYMENT_METHODS_BD } from '../data/mockData';
import { BKASH_LOGO, NAGAD_LOGO } from '../data/paymentLogos';
import { ShieldCheck, Check, Zap } from 'lucide-react';

interface PaymentMethodStepProps {
  selectedPayment: PaymentMethod | null;
  onSelectPayment: (method: PaymentMethod) => void;
  country?: CountryCode;
  stepNumber?: number;
}

/* ─── bKash Logo (uploaded image) ─── */
const BkashLogo = () => (
  <div className="w-12 h-11 rounded-xl overflow-hidden shadow-md shadow-black/50 border border-white/20 shrink-0">
    <img src={BKASH_LOGO} alt="bKash" className="w-full h-full object-cover" />
  </div>
);

/* ─── Nagad Logo (uploaded image – white bg) ─── */
const NagadLogo = () => (
  <div className="w-12 h-11 rounded-xl bg-white p-1 flex items-center justify-center shadow-md shadow-black/50 border border-white/20 shrink-0">
    <img src={NAGAD_LOGO} alt="Nagad" className="w-full h-full object-contain" />
  </div>
);

/* ─── Online Banking Logo (SVG inline – blue bank icon) ─── */
const BankLogo = () => (
  <div className="w-12 h-11 rounded-xl bg-white p-1.5 flex items-center justify-center shadow-md shadow-black/50 border border-white/20 shrink-0">
    <svg className="w-full h-full" viewBox="0 0 48 48" fill="none">
      {/* Bank building icon */}
      <path d="M24 4L4 16H44L24 4Z" fill="#1E3A8A"/>
      <rect x="4" y="16" width="40" height="3" fill="#2563EB"/>
      <rect x="8" y="21" width="5" height="14" rx="1" fill="#1E3A8A"/>
      <rect x="17" y="21" width="5" height="14" rx="1" fill="#1E3A8A"/>
      <rect x="26" y="21" width="5" height="14" rx="1" fill="#1E3A8A"/>
      <rect x="35" y="21" width="5" height="14" rx="1" fill="#1E3A8A"/>
      <rect x="4" y="36" width="40" height="4" rx="1" fill="#2563EB"/>
      <rect x="2" y="40" width="44" height="3" rx="1" fill="#1E3A8A"/>
    </svg>
  </div>
);

/* ─── Payment method card config for Bangladesh ─── */
const BD_CARD_CONFIG: Record<string, {
  Logo: React.FC;
  tagBg: string;
  tagText: string;
  tagLabel: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  badgeLabel: string;
  subtitle: string;
}> = {
  bkash: {
    Logo: BkashLogo,
    tagBg: 'bg-[#E2136E]',
    tagText: 'text-white',
    tagLabel: 'BKASH INSTANT • 0% FEE',
    badgeBg: 'bg-[#E2136E]/20',
    badgeBorder: 'border-[#E2136E]/40',
    badgeText: 'text-[#ff4081]',
    badgeLabel: 'BANGLADESH',
    subtitle: 'Pay Using BKASH App',
  },
  nagad: {
    Logo: NagadLogo,
    tagBg: 'bg-[#F7941D]',
    tagText: 'text-black',
    tagLabel: 'NAGAD INSTANT • 0% FEE',
    badgeBg: 'bg-[#F7941D]/20',
    badgeBorder: 'border-[#F7941D]/40',
    badgeText: 'text-[#FFB74D]',
    badgeLabel: 'BANGLADESH',
    subtitle: 'Pay Using Nagad App',
  },
  bank: {
    Logo: BankLogo,
    tagBg: 'bg-[#2563EB]',
    tagText: 'text-white',
    tagLabel: 'ONLINE BANKING • 0% FEE',
    badgeBg: 'bg-[#2563EB]/20',
    badgeBorder: 'border-[#2563EB]/40',
    badgeText: 'text-[#60A5FA]',
    badgeLabel: 'BD BANKS',
    subtitle: 'City Bank • BRAC Bank • DBBL • EBL & More',
  },
};

export const PaymentMethodStep: React.FC<PaymentMethodStepProps> = ({
  selectedPayment,
  onSelectPayment,
  country = 'IN',
  stepNumber = 4,
}) => {
  const isBangladesh = country === 'BD';
  const indiaMethods = PAYMENT_METHODS_IN;
  const bdMethods = PAYMENT_METHODS_BD;

  return (
    <div className="bg-[#16181F] rounded-2xl border border-white/5 p-4 shadow-lg space-y-3.5" id="payment-method-section">
      {/* Section Header */}
      <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-black font-black text-xs flex items-center justify-center shadow-md shadow-amber-500/25 border border-amber-300/40 shrink-0 font-heading">
            {stepNumber}
          </span>
          <h2 className="text-base font-black font-heading text-white tracking-wider uppercase">
            Select Payment Method
          </h2>
        </div>

        <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-lg">
          <ShieldCheck className="w-3 h-3" />
          <span>0% Fee</span>
        </div>
      </div>

      {isBangladesh ? (
        /* ── Bangladesh Payment Options (bKash / Nagad / Online Banking) ── */
        <div className="space-y-3">
          {bdMethods.map((method) => {
            const config = BD_CARD_CONFIG[method.id];
            if (!config) return null;
            const { Logo, tagBg, tagText, tagLabel, badgeBg, badgeBorder, badgeText, badgeLabel, subtitle } = config;
            const isSelected = selectedPayment?.id === method.id;

            return (
              <div
                key={method.id}
                onClick={() => onSelectPayment(method)}
                className={`relative rounded-xl p-3.5 cursor-pointer transition-all duration-200 border ${
                  isSelected
                    ? 'bg-[#1A1D24] border-2 border-amber-500 shadow-md shadow-amber-500/15 ring-1 ring-amber-500/30'
                    : 'bg-black/40 border-white/5 hover:border-amber-500/40 hover:bg-white/5'
                }`}
                id={`payment-method-${method.id}`}
              >
                {/* Instant Tag */}
                <div className="absolute -top-2.5 right-3">
                  <span className={`${tagBg} ${tagText} text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider font-heading flex items-center gap-0.5 shadow`}>
                    <Zap className="w-2.5 h-2.5 fill-current" />
                    {tagLabel}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Logo />

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-heading font-bold text-sm text-white leading-tight">
                          {method.name}
                        </h4>
                        <span className={`px-1.5 py-0.2 rounded ${badgeBg} border ${badgeBorder} ${badgeText} font-mono text-[9px] font-bold`}>
                          {badgeLabel}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {subtitle}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors shrink-0 ${
                      isSelected
                        ? 'bg-amber-500 border-amber-500 text-black shadow'
                        : 'border-white/20 bg-black/40'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>

                {/* Info Row */}
                <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1 text-emerald-400 font-medium">
                    <Zap className="w-3 h-3 fill-emerald-400" />
                    <span>{method.instantBonusText || 'Instant Auto-Credit'} (0% Fee)</span>
                  </div>
                  <span className={isSelected ? 'text-amber-400 font-bold' : 'text-gray-400'}>
                    {isSelected ? '✓ Selected' : 'Select'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ── UPI Payment Option for India ── */
        (() => {
          const method = indiaMethods[0];
          const isSelected = selectedPayment?.id === method?.id;
          return (
            <div
              onClick={() => onSelectPayment(method)}
              className={`relative rounded-xl p-3.5 cursor-pointer transition-all duration-200 border ${
                isSelected
                  ? 'bg-[#1A1D24] border-2 border-amber-500 shadow-md shadow-amber-500/15 ring-1 ring-amber-500/30'
                  : 'bg-black/40 border-white/5 hover:border-amber-500/40 hover:bg-white/5'
              }`}
              id="payment-method-upi-instant"
            >
              {/* Instant Tag */}
              <div className="absolute -top-2.5 right-3">
                <span className="bg-emerald-500 text-black text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider font-heading flex items-center gap-0.5 shadow">
                  <Zap className="w-2.5 h-2.5 fill-black" />
                  FASTEST • 0% FEE
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {/* Authentic UPI Brand Logo Badge */}
                  <div className="w-12 h-11 rounded-xl bg-white p-1.5 flex items-center justify-center shadow-md shadow-black/50 border border-white/20 shrink-0">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg"
                      alt="UPI Unified Payments Interface"
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent && !parent.querySelector('.upi-fallback')) {
                          const fallback = document.createElement('div');
                          fallback.className = 'upi-fallback font-black text-xs text-[#097939] tracking-tighter italic';
                          fallback.innerHTML = '<span style="color:#097939">UP</span><span style="color:#00B259">I</span>';
                          parent.appendChild(fallback);
                        }
                      }}
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-heading font-bold text-sm text-white leading-tight">
                        UPI / QR Code
                      </h4>
                      <span className="px-1.5 py-0.2 rounded bg-amber-500/15 border border-amber-500/30 text-amber-400 font-mono text-[9px] font-bold">
                        INDIA
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Google Pay • PhonePe • Paytm • BHIM • Cred & Any Bank UPI
                    </p>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors shrink-0 ${
                    isSelected
                      ? 'bg-amber-500 border-amber-500 text-black shadow'
                      : 'border-white/20 bg-black/40'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>

              {/* UPI Apps Row */}
              <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1 text-emerald-400 font-medium">
                  <Zap className="w-3 h-3 fill-emerald-400" />
                  <span>Instant Auto-Credit (0% Fee)</span>
                </div>
                <span className={isSelected ? 'text-amber-400 font-bold' : 'text-gray-400'}>
                  {isSelected ? '✓ Selected' : 'Select'}
                </span>
              </div>
            </div>
          );
        })()
      )}
    </div>
  );
};
