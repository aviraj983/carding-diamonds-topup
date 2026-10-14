import React, { useState } from 'react';
import { CurrencyCode, PaymentMethod, PlayerProfile, TopupProduct } from '../types';
import { CURRENCIES } from '../data/mockData';
import { ArrowRight, ShieldCheck, Zap, AlertCircle, Loader2 } from 'lucide-react';

interface CheckoutSummaryProps {
  playerUid: string;
  playerProfile: PlayerProfile | null;
  selectedProduct: TopupProduct | null;
  selectedPayment: PaymentMethod | null;
  currency: CurrencyCode;
  onInitiateCheckout?: () => void;
}

export const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({
  playerUid,
  playerProfile,
  selectedProduct,
  selectedPayment,
  currency,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const curr = CURRENCIES[currency] || CURRENCIES.INR;

  // Calculate Subtotal (price of selected product)
  const subtotal = selectedProduct
    ? (selectedProduct.inrPrice && curr.code === 'INR'
        ? selectedProduct.inrPrice
        : Math.round(selectedProduct.basePriceUSD * curr.rate))
    : 0;

  const totalDiamonds = (selectedProduct?.diamonds || 0) + (selectedProduct?.bonusDiamonds || 0);

  const formatMoney = (amount: number) => {
    if (curr.code === 'IDR') {
      return `${curr.symbol} ${Math.round(amount / 1000) * 1000}`;
    }
    if (amount < 10 && amount > 0) {
      return `${curr.symbol}${amount.toFixed(2)}`;
    }
    return `${curr.symbol}${Math.round(amount)}`;
  };

  const canProceed = Boolean(playerUid && playerProfile?.verified && selectedProduct && selectedPayment);

  const handleProceedToPayment = async () => {
    if (!canProceed || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(subtotal),
          playerUid: playerUid,
          diamonds: totalDiamonds,
        }),
      });

      const data = await response.json();
      if (data.success && (data.paymentUrl || data.checkoutUrl)) {
        window.location.href = data.paymentUrl || data.checkoutUrl;
      } else {
        setErrorMessage(data.error || 'Failed to initialize payment gateway. Please try again.');
      }
    } catch (err: any) {
      console.error('Payment gateway error:', err);
      setErrorMessage('Network error connecting to payment gateway');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#16181F] rounded-2xl border border-white/5 p-4 sm:p-5 shadow-lg space-y-3.5" id="checkout-section">
      {/* Subtotal Display Box */}
      <div className="bg-black/50 border border-white/10 rounded-xl p-4 flex items-center justify-between">
        <div>
          <span className="text-[11px] uppercase font-heading font-bold text-gray-400 tracking-wider block">
            Subtotal
          </span>
          <span className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight">
            {selectedProduct ? formatMoney(subtotal) : '—'}
          </span>
          <span className={`text-[11px] font-medium block mt-0.5 ${selectedProduct ? 'text-amber-400/90' : 'text-gray-400'}`}>
            {selectedProduct ? selectedProduct.title : 'Select a pack in Step 2'}
          </span>
        </div>

        <div className="text-right">
          <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% Guaranteed</span>
          </div>
          <span className="text-[10px] text-gray-400 block mt-1">
            Direct In-Game Top-Up
          </span>
        </div>
      </div>

      {/* Proceed to Payment Button */}
      <div>
        <button
          onClick={handleProceedToPayment}
          disabled={!canProceed || isSubmitting}
          className={`group w-full py-3.5 px-4 rounded-xl font-display font-extrabold text-base sm:text-lg uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-lg ${
            canProceed && !isSubmitting
              ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/25 active:scale-[0.99] cursor-pointer'
              : 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5 opacity-70'
          }`}
          id="proceed-to-payment-btn"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-black" />
              <span>REDIRECTING TO PAYMENT...</span>
            </>
          ) : (
            <>
              <Zap className={`w-4 h-4 ${canProceed ? 'fill-black' : ''}`} />
              <span>PROCEED TO PAYMENT</span>
              <ArrowRight className={`w-5 h-5 transition-transform duration-300 ${canProceed ? 'group-hover:translate-x-1' : ''}`} />
            </>
          )}
        </button>

        {errorMessage && (
          <p className="mt-2 text-xs text-red-400 flex items-center justify-center gap-1 font-medium">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{errorMessage}</span>
          </p>
        )}

        {!canProceed && !errorMessage && (
          <p className="text-[11px] text-amber-400/90 text-center mt-2 font-medium flex items-center justify-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>
              {!playerUid
                ? 'Enter your Player ID in Step 1 to continue'
                : !playerProfile?.verified
                ? 'Verify your Player UID in Step 1'
                : !selectedProduct
                ? 'Select a Diamond Pack in Step 2'
                : 'Choose a Payment Method in Step 3'}
            </span>
          </p>
        )}
      </div>
    </div>
  );
};
