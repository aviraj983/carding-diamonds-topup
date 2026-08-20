import React from 'react';
import { PaymentMethod } from '../types';
import { PAYMENT_METHODS } from '../data/mockData';
import { ShieldCheck, Check, Zap, Percent } from 'lucide-react';

interface PaymentMethodStepProps {
  selectedPayment: PaymentMethod | null;
  onSelectPayment: (method: PaymentMethod) => void;
}

export const PaymentMethodStep: React.FC<PaymentMethodStepProps> = ({
  selectedPayment,
  onSelectPayment,
}) => {
  const upiMethod = PAYMENT_METHODS[0];
  const isSelected = selectedPayment?.id === upiMethod?.id;

  return (
    <div className="bg-[#16181F] rounded-2xl border border-white/5 p-4 shadow-lg space-y-3.5" id="payment-method-section">
      {/* Section Header */}
      <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-black font-black text-xs flex items-center justify-center shadow-md shadow-amber-500/25 border border-amber-300/40 shrink-0 font-heading">
            3
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

      {/* Single UPI Payment Option */}
      <div
        onClick={() => onSelectPayment(upiMethod)}
        className={`relative rounded-xl p-3.5 cursor-pointer transition-all duration-200 border ${
          isSelected
            ? 'bg-[#1A1D24] border-2 border-amber-500 shadow-md shadow-amber-500/15 ring-1 ring-amber-500/30'
            : 'bg-black/40 border-white/5 hover:border-amber-500/40 hover:bg-white/5'
        }`}
        id="payment-method-upi-instant"
      >
        {/* Discount / Offer Tag */}
        {upiMethod.discountPercent && (
          <div className="absolute -top-2.5 right-3">
            <span className="bg-emerald-500 text-black text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider font-heading flex items-center gap-0.5 shadow">
              <Percent className="w-2.5 h-2.5 stroke-[3]" />
              {upiMethod.discountPercent}% OFF • INSTANT
            </span>
          </div>
        )}

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
                  // Fallback to high-quality SVG rendering if external CDN blocks
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
                  FASTEST
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
    </div>
  );
};