import React, { useState, useEffect } from 'react';
import { CurrencyCode, PaymentMethod, PlayerProfile, PromoCode, TopupProduct } from '../types';
import { CURRENCIES } from '../data/mockData';
import {
  X,
  ShieldCheck,
  Zap,
  Flame,
  ExternalLink,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerUid: string;
  playerProfile: PlayerProfile | null;
  product: TopupProduct;
  paymentMethod: PaymentMethod;
  currency: CurrencyCode;
  promo: PromoCode | null;
  onSaveOrder: (orderData: any) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  playerUid,
  playerProfile,
  product,
  paymentMethod,
  currency,
  promo,
}) => {
  const [stage, setStage] = useState<'redirecting' | 'error' | 'success'>('redirecting');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  const curr = CURRENCIES[currency] || CURRENCIES.INR;

  // Price calculations
  const baseUSD = product.basePriceUSD;
  const regularBonus = product.bonusDiamonds || 0;
  const promoBonus = promo ? promo.bonusDiamonds : 0;
  const totalDiamonds = product.diamonds + regularBonus + promoBonus;

  let paymentDiscountUSD = 0;
  if (paymentMethod.discountPercent) {
    paymentDiscountUSD = (baseUSD * paymentMethod.discountPercent) / 100;
  }

  let promoDiscountUSD = 0;
  if (promo) {
    promoDiscountUSD = Math.min((baseUSD * promo.discountPercent) / 100, promo.maxDiscountUSD);
  }

  const finalUSD = Math.max(0, baseUSD - paymentDiscountUSD - promoDiscountUSD);
  const finalPrice = Math.max(1, Math.round(finalUSD * curr.rate));

  const formatMoney = (amount: number) => {
    return `${curr.symbol}${amount}`;
  };

  // Initiate WatchPays Order Creation and Gateway Redirect
  const initiateWatchPaysPayment = async () => {
    setStage('redirecting');
    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: finalPrice,
          playerUid: playerUid,
          diamonds: totalDiamonds,
        }),
      });

      const data = await response.json();

      if (data.success && data.paymentUrl) {
        setPaymentUrl(data.paymentUrl);
        // Instant direct redirection to WatchPays Payment Gateway
        window.location.href = data.paymentUrl;
      } else {
        setErrorMessage(data.error || 'Failed to initialize payment gateway. Please try again.');
        setStage('error');
      }
    } catch (err: any) {
      console.error('WatchPays payment error:', err);
      setErrorMessage(err.message || 'Network error connecting to WatchPays Gateway');
      setStage('error');
    } finally {
      setLoading(false);
    }
  };

  // Trigger redirection automatically on modal open
  useEffect(() => {
    if (isOpen) {
      initiateWatchPaysPayment();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#16181F] border border-white/10 rounded-2xl w-full max-w-[400px] shadow-2xl relative overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#0F1115] px-4 py-3 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            <h3 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
              WatchPays Payment Gateway
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 text-center">
          {/* Order Snapshot */}
          <div className="bg-black/40 rounded-xl p-3 border border-white/5 flex items-center justify-between text-xs text-left">
            <div>
              <span className="text-gray-400 block text-[10px]">Free Fire UID:</span>
              <span className="font-bold text-amber-400 font-mono text-xs">
                {playerUid} {playerProfile ? `(${playerProfile.ign})` : ''}
              </span>
            </div>
            <div className="text-right">
              <span className="text-gray-400 block text-[10px]">Payable Amount:</span>
              <span className="font-bold text-emerald-400 font-display text-base">
                {formatMoney(finalPrice)}
              </span>
            </div>
          </div>

          {/* REDIRECTING STATE */}
          {stage === 'redirecting' && (
            <div className="py-6 space-y-4">
              <div className="relative w-16 h-16 mx-auto">
                <div className="w-16 h-16 rounded-full border-3 border-amber-500/20 border-t-amber-500 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-amber-400 fill-amber-400" />
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="text-base font-black font-heading text-white uppercase tracking-wider">
                  Redirecting to WatchPays Gateway...
                </h4>
                <p className="text-xs text-gray-400 max-w-[280px] mx-auto">
                  Connecting to 100% secure encrypted payment portal. Please do not refresh.
                </p>
              </div>

              {paymentUrl && (
                <div className="pt-2">
                  <a
                    href={paymentUrl}
                    className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-heading font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                  >
                    <span>Click Here if Not Redirected</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>
          )}

          {/* ERROR STATE */}
          {stage === 'error' && (
            <div className="py-4 space-y-4">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
                <AlertCircle className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <h4 className="text-base font-black font-heading text-white uppercase tracking-wider">
                  Connection Error
                </h4>
                <p className="text-xs text-rose-400/90 max-w-[280px] mx-auto">
                  {errorMessage || 'Unable to communicate with WatchPays gateway.'}
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={initiateWatchPaysPayment}
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>Retry Payment</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-heading font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Security guarantee */}
          <div className="pt-2 border-t border-white/5 flex items-center justify-center gap-1.5 text-[11px] text-emerald-400/90 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>256-Bit SSL Encrypted WatchPays Official Gateway</span>
          </div>
        </div>
      </div>
    </div>
  );
};