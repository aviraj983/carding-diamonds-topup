import React, { useState } from 'react';
import { CurrencyCode, PaymentMethod, PlayerProfile, PromoCode, TopupProduct } from '../types';
import { CURRENCIES, PROMO_CODES } from '../data/mockData';
import { Sparkles, Tag, ArrowRight, ShieldCheck, Check, AlertCircle, Zap, Flame, Lock } from 'lucide-react';

interface CheckoutSummaryProps {
  playerUid: string;
  playerProfile: PlayerProfile | null;
  selectedProduct: TopupProduct | null;
  selectedPayment: PaymentMethod | null;
  currency: CurrencyCode;
  appliedPromo: PromoCode | null;
  onApplyPromo: (promo: PromoCode | null) => void;
  onInitiateCheckout: () => void;
}

export const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({
  playerUid,
  playerProfile,
  selectedProduct,
  selectedPayment,
  currency,
  appliedPromo,
  onApplyPromo,
  onInitiateCheckout,
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoSuccess, setPromoSuccess] = useState<string | null>(null);

  const curr = CURRENCIES[currency] || CURRENCIES.INR;

  const handleApplyPromoCode = () => {
    const clean = promoInput.trim().toUpperCase();
    if (!clean) return;

    // Check pre-defined promos or dynamic spin codes
    const found = PROMO_CODES.find((p) => p.code.toUpperCase() === clean);
    if (found) {
      onApplyPromo(found);
      setPromoSuccess(`Code ${found.code} applied! ${found.discountPercent}% OFF + ${found.bonusDiamonds} Bonus 💎`);
      setPromoError(null);
    } else if (clean === 'SPIN10') {
      const spinPromo: PromoCode = {
        code: 'SPIN10',
        discountPercent: 10,
        maxDiscountUSD: 5,
        bonusDiamonds: 25,
        description: 'Lucky Wheel 10% Discount Prize',
      };
      onApplyPromo(spinPromo);
      setPromoSuccess('Lucky Spin 10% OFF Voucher applied!');
      setPromoError(null);
    } else if (clean === 'SPIN25') {
      const spinPromo: PromoCode = {
        code: 'SPIN25',
        discountPercent: 25,
        maxDiscountUSD: 10,
        bonusDiamonds: 50,
        description: 'Lucky Wheel 25% Discount Prize',
      };
      onApplyPromo(spinPromo);
      setPromoSuccess('Lucky Spin 25% OFF Voucher applied!');
      setPromoError(null);
    } else if (clean === 'MEGASPIN50') {
      const spinPromo: PromoCode = {
        code: 'MEGASPIN50',
        discountPercent: 50,
        maxDiscountUSD: 20,
        bonusDiamonds: 100,
        description: 'Lucky Wheel 50% Mega Discount Prize',
      };
      onApplyPromo(spinPromo);
      setPromoSuccess('Lucky Spin 50% MEGA DISCOUNT applied!');
      setPromoError(null);
    } else {
      setPromoError('Invalid coupon code. Try BOOYAH50, BONUS100, or spin the Lucky Wheel!');
      setPromoSuccess(null);
    }
  };

  const handleRemovePromo = () => {
    onApplyPromo(null);
    setPromoSuccess(null);
    setPromoError(null);
    setPromoInput('');
  };

  // Calculations
  const baseUSD = selectedProduct ? selectedProduct.basePriceUSD : 0;
  const regularBonus = selectedProduct?.bonusDiamonds || 0;
  const promoBonus = appliedPromo ? appliedPromo.bonusDiamonds : 0;

  const totalDiamonds = (selectedProduct?.diamonds || 0) + regularBonus + promoBonus;

  // Pricing & Discounts
  const rawLocalPrice = baseUSD * curr.rate;
  
  let paymentDiscountUSD = 0;
  if (selectedPayment?.discountPercent && baseUSD > 0) {
    paymentDiscountUSD = (baseUSD * selectedPayment.discountPercent) / 100;
  }

  let promoDiscountUSD = 0;
  if (appliedPromo && baseUSD > 0) {
    promoDiscountUSD = Math.min((baseUSD * appliedPromo.discountPercent) / 100, appliedPromo.maxDiscountUSD);
  }

  const finalUSD = Math.max(0, baseUSD - paymentDiscountUSD - promoDiscountUSD);
  const finalLocalPrice = finalUSD * curr.rate;

  const formatMoney = (amount: number) => {
    if (curr.code === 'IDR') {
      return `${curr.symbol} ${Math.round(amount / 1000) * 1000}`;
    }
    if (amount < 10) {
      return `${curr.symbol}${amount.toFixed(2)}`;
    }
    return `${curr.symbol}${Math.round(amount)}`;
  };

  const canProceed = Boolean(playerUid && playerProfile?.verified && selectedProduct && selectedPayment);

  return (
    <div className="bg-[#16181F] rounded-2xl border border-white/5 p-4 shadow-lg space-y-4" id="order-summary-section">
      {/* Section Header */}
      <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-black font-black text-xs flex items-center justify-center shadow-md shadow-amber-500/25 border border-amber-300/40 shrink-0 font-heading">
            4
          </span>
          <h2 className="text-base font-black font-heading text-white tracking-wider uppercase">
            Order Summary
          </h2>
        </div>

        <div className="flex items-center gap-1 text-[10px] text-amber-500 font-semibold bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-lg">
          <Zap className="w-3 h-3 fill-amber-500" />
          <span>5-Sec Credit</span>
        </div>
      </div>

      <div className="space-y-3.5">
        {/* Promo Code Box */}
        <div className="bg-black/40 rounded-xl p-3 border border-white/10">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-1.5 font-heading flex items-center gap-1">
            <Tag className="w-3 h-3 text-amber-500" />
            Promo Code / Coupon
          </label>

          {appliedPromo ? (
            <div className="flex items-center justify-between bg-emerald-950/40 border border-emerald-500/40 rounded-lg p-2 text-xs text-emerald-300">
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <div>
                  <span className="font-mono font-bold text-white text-[11px]">{appliedPromo.code}</span>
                  <span className="ml-1 text-emerald-400 text-[10px]">
                    ({appliedPromo.discountPercent}% OFF + {appliedPromo.bonusDiamonds} 💎)
                  </span>
                </div>
              </div>
              <button
                onClick={handleRemovePromo}
                className="text-red-400 hover:text-red-300 text-[10px] font-bold uppercase font-heading ml-1 cursor-pointer"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="flex gap-1.5">
              <input
                type="text"
                value={promoInput}
                onChange={(e) => {
                  setPromoInput(e.target.value);
                  setPromoError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleApplyPromoCode();
                }}
                placeholder="e.g. BOOYAH50, BONUS100"
                className="flex-1 bg-black/60 border border-white/10 focus:border-amber-500 rounded-lg py-2 px-2.5 text-xs text-white font-mono uppercase font-bold placeholder:normal-case placeholder:font-normal placeholder:text-gray-600 focus:outline-none"
              />
              <button
                onClick={handleApplyPromoCode}
                className="px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider font-heading transition-colors"
              >
                Apply
              </button>
            </div>
          )}

          {promoSuccess && (
            <p className="mt-1 text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
              <Check className="w-3 h-3" />
              {promoSuccess}
            </p>
          )}

          {promoError && (
            <p className="mt-1 text-[11px] text-red-400 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3 h-3" />
              {promoError}
            </p>
          )}

          <div className="mt-2 flex items-center gap-1.5 text-[10px] text-gray-500">
            <span>Try:</span>
            <button
              onClick={() => {
                setPromoInput('BOOYAH50');
                onApplyPromo(PROMO_CODES[0]);
                setPromoSuccess('BOOYAH50 Applied (15% OFF + 50 💎)');
              }}
              className="text-amber-500 underline hover:text-amber-400 font-mono"
            >
              BOOYAH50
            </button>
            <span>•</span>
            <button
              onClick={() => {
                setPromoInput('BONUS100');
                onApplyPromo(PROMO_CODES[1]);
                setPromoSuccess('BONUS100 Applied (10% OFF + 100 💎)');
              }}
              className="text-amber-500 underline hover:text-amber-400 font-mono"
            >
              BONUS100
            </button>
          </div>
        </div>

        {/* UID & Account Summary Card */}
        <div className="bg-black/40 rounded-xl p-3 border border-white/10 space-y-1 text-xs">
          <div className="text-gray-400 font-semibold font-heading uppercase text-[10px] tracking-wide">
            Target Account:
          </div>
          {playerUid ? (
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-bold text-xs truncate max-w-[200px]">
                  {playerProfile ? playerProfile.ign : 'Free Fire Account'}
                </div>
                <div className="text-gray-400 font-mono text-[11px]">
                  UID: <span className="text-amber-500 font-bold">{playerUid}</span>
                </div>
              </div>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[9px] uppercase font-bold px-2 py-0.5 rounded-full font-heading">
                {playerProfile?.verified ? 'Verified' : 'Ready'}
              </span>
            </div>
          ) : (
            <div className="text-amber-500 font-medium flex items-center gap-1 text-[11px]">
              <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Enter Player ID in Step 1</span>
            </div>
          )}
        </div>

        {/* Breakdown Card */}
        <div className="bg-black/40 rounded-xl p-3.5 border border-white/10 space-y-2.5">
          {/* Diamonds calculation row */}
          <div className="space-y-1 text-xs text-gray-300">
            <div className="flex justify-between">
              <span className="text-gray-400">Pack:</span>
              <span className="font-semibold text-white truncate max-w-[200px]">
                {selectedProduct ? selectedProduct.title : 'None Selected'}
              </span>
            </div>

            {selectedProduct?.category === 'diamonds' && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-400">Base Diamonds:</span>
                  <span className="font-mono text-gray-200">
                    {selectedProduct.diamonds.toLocaleString()} 💎
                  </span>
                </div>

                {regularBonus > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold text-[11px]">
                    <span>Pack Bonus:</span>
                    <span className="font-mono">+{regularBonus.toLocaleString()} 💎</span>
                  </div>
                )}

                {promoBonus > 0 && (
                  <div className="flex justify-between text-amber-400 font-semibold text-[11px]">
                    <span>Promo Bonus:</span>
                    <span className="font-mono">+{promoBonus} 💎</span>
                  </div>
                )}

                <div className="flex justify-between pt-1.5 border-t border-white/5 text-xs font-bold text-amber-500">
                  <span>Total Diamonds:</span>
                  <span className="font-display text-base text-amber-500">
                    {totalDiamonds.toLocaleString()} 💎
                  </span>
                </div>
              </>
            )}

            {/* Price details */}
            <div className="pt-1.5 border-t border-white/5 space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-400">Price:</span>
                <span className="font-mono text-gray-200">{formatMoney(rawLocalPrice)}</span>
              </div>

              {paymentDiscountUSD > 0 && (
                <div className="flex justify-between text-emerald-400 text-[11px]">
                  <span>Gateway Discount:</span>
                  <span className="font-mono">-{formatMoney(paymentDiscountUSD * curr.rate)}</span>
                </div>
              )}

              {promoDiscountUSD > 0 && (
                <div className="flex justify-between text-emerald-400 text-[11px]">
                  <span>Coupon Savings:</span>
                  <span className="font-mono">-{formatMoney(promoDiscountUSD * curr.rate)}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-400 text-[11px]">
                <span>Processing Fee:</span>
                <span className="text-emerald-400 font-bold">FREE (0%)</span>
              </div>
            </div>
          </div>

          {/* Grand Total */}
          <div className="bg-black/60 p-3 rounded-xl border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-gray-400 block font-heading uppercase">
                Grand Total
              </span>
              <span className="text-2xl font-black font-display text-white">
                {formatMoney(finalLocalPrice)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-emerald-400 font-bold block">
                🛡️ 100% Guaranteed
              </span>
              <span className="text-[9px] text-gray-500">Direct In-Game</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div>
          <button
            onClick={onInitiateCheckout}
            disabled={!canProceed}
            className={`group w-full py-3.5 px-4 rounded-xl font-display font-extrabold text-lg uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-lg ${
              canProceed
                ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/25 active:scale-[0.99] cursor-pointer'
                : 'bg-white/5 text-gray-600 cursor-not-allowed opacity-60 border border-white/5'
            }`}
            id="instant-recharge-submit-btn"
          >
            <Zap className={`w-4 h-4 ${canProceed ? 'fill-black' : ''}`} />
            <span>PROCEED TO PAYMENT</span>
            <ArrowRight className={`w-5 h-5 transition-transform duration-300 ${canProceed ? 'group-hover:translate-x-1.5 animate-pulse' : ''}`} />
          </button>

          {!canProceed && (
            <p className="text-[10px] text-amber-500/90 text-center mt-1.5 font-medium">
              {!playerUid
                ? '⚠️ Enter your Player ID in Step 1'
                : !playerProfile?.verified
                ? '⚠️ Verify your Player UID in Step 1 first'
                : !selectedProduct
                ? '⚠️ Select a Diamond Pack in Step 2'
                : '⚠️ Choose a Payment Method in Step 3'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};