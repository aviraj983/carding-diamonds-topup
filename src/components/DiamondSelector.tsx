import React from 'react';
import { CurrencyCode, TopupProduct } from '../types';
import { TOPUP_PRODUCTS, CURRENCIES } from '../data/mockData';
import { Sparkles, Check } from 'lucide-react';

interface DiamondSelectorProps {
  selectedProduct: TopupProduct | null;
  onSelectProduct: (product: TopupProduct) => void;
  currency: CurrencyCode;
}

export const DiamondSelector: React.FC<DiamondSelectorProps> = ({
  selectedProduct,
  onSelectProduct,
  currency,
}) => {
  const curr = CURRENCIES[currency] || CURRENCIES.INR;

  const formatPrice = (baseUSD: number) => {
    const raw = baseUSD * curr.rate;
    if (curr.code === 'IDR') {
      return `${curr.symbol} ${Math.round(raw / 1000) * 1000}`;
    }
    if (raw < 10) {
      return `${curr.symbol}${raw.toFixed(2)}`;
    }
    return `${curr.symbol}${Math.round(raw)}`;
  };

  // Only Diamond Packs
  const diamondProducts = TOPUP_PRODUCTS.filter((p) => p.category === 'diamonds');

  return (
    <div className="bg-[#16181F] rounded-2xl border border-white/5 p-4 shadow-lg space-y-4" id="select-diamonds-section">
      {/* Section Header */}
      <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-black font-black text-xs flex items-center justify-center shadow-md shadow-amber-500/25 border border-amber-300/40 shrink-0 font-heading">
            2
          </span>
          <h2 className="text-base font-black font-heading text-white tracking-wider uppercase">
            Choose Diamond Pack
          </h2>
        </div>

        <div className="flex items-center gap-1 bg-black/40 border border-white/10 px-2 py-0.5 rounded-lg text-[10px] font-bold text-emerald-400 font-heading uppercase">
          <Sparkles className="w-3 h-3 fill-emerald-400 text-emerald-400" />
          <span>Auto Credit</span>
        </div>
      </div>

      {/* Products Grid: 2 Columns */}
      <div className="grid grid-cols-2 gap-2.5">
        {diamondProducts.map((product) => {
          const isSelected = selectedProduct?.id === product.id;
          const displayBonus = product.bonusDiamonds || 0;
          const totalDiamonds = product.diamonds + displayBonus;

          return (
            <div
              key={product.id}
              onClick={() => onSelectProduct(product)}
              className={`relative rounded-xl p-3 cursor-pointer transition-all duration-200 flex flex-col justify-between border ${
                isSelected
                  ? 'bg-[#1A1D24] border-2 border-amber-500 shadow-md shadow-amber-500/15 ring-1 ring-amber-500/30'
                  : 'bg-black/40 border-white/5 hover:border-amber-500/40 hover:bg-white/5'
              }`}
              id={`product-card-${product.id}`}
            >
              {/* Tag Badge */}
              {product.tag && (
                <div className="absolute -top-2 right-2">
                  <span
                    className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded-full tracking-wider font-heading shadow ${
                      product.tagColor === 'red'
                        ? 'bg-red-500 text-white'
                        : product.tagColor === 'emerald'
                        ? 'bg-emerald-500 text-black'
                        : 'bg-amber-500 text-black'
                    }`}
                  >
                    {product.tag}
                  </span>
                </div>
              )}

              {/* Top info */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-base">
                    💎
                  </div>

                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center border transition-colors ${
                      isSelected
                        ? 'bg-amber-500 border-amber-500 text-black'
                        : 'border-white/10 bg-black/40'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>

                {/* Title / Amount */}
                <h3 className="font-heading font-extrabold text-sm text-white tracking-wide leading-tight">
                  {product.title}
                </h3>

                {/* Diamonds & Bonus breakdown */}
                <div className="mt-1 flex items-baseline gap-1 flex-wrap">
                  <span className="text-lg font-black text-amber-500 font-display">
                    {totalDiamonds.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">💎</span>
                  {displayBonus > 0 && (
                    <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1 rounded border border-emerald-500/30">
                      +{displayBonus} Bonus
                    </span>
                  )}
                </div>
              </div>

              {/* Price Button / Bottom */}
              <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between">
                <div>
                  <span className="font-mono text-sm font-black text-white">
                    {formatPrice(product.basePriceUSD)}
                  </span>
                </div>

                <span
                  className={`text-[10px] font-bold font-heading uppercase px-2 py-0.5 rounded-md transition-colors ${
                    isSelected
                      ? 'bg-amber-500 text-black font-extrabold'
                      : 'bg-white/5 text-gray-400'
                  }`}
                >
                  {isSelected ? '✓ Selected' : 'Select'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};