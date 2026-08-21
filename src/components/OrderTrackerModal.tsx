import React, { useState } from 'react';
import { OrderItem } from '../types';
import { Search, X, CheckCircle2, Clock, AlertCircle, ShieldCheck, Flame } from 'lucide-react';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: OrderItem[];
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  isOpen,
  onClose,
  orders,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<OrderItem | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return;

    setSearched(true);
    const found = orders.find(
      (o) => o.orderNumber.toLowerCase() === q || o.uid.toLowerCase() === q
    );

    if (found) {
      setSearchedOrder(found);
    } else {
      // Mock lookup if user types standard format
      if (/^\d{6,12}$/.test(q)) {
        setSearchedOrder({
          id: 'sim_1',
          orderNumber: `FF-${Math.floor(100000 + Math.random() * 900000)}`,
          uid: q,
          ign: `★FF_WARRIOR_${q.slice(-3)}★`,
          product: {
            id: 'dia-2180',
            category: 'diamonds',
            title: '2,180 + 218 Diamonds',
            diamonds: 2180,
            bonusDiamonds: 218,
            basePriceUSD: 19.99,
            iconType: 'diamond',
          },
          quantity: 1,
          totalDiamonds: 2398,
          currency: 'INR',
          amountPaid: 1650,
          paymentMethod: 'UPI Instant QR',
          status: 'completed',
          timestamp: '2 mins ago',
          region: 'India / South Asia',
        });
      } else {
        setSearchedOrder(null);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#16181F] border border-white/10 rounded-2xl w-full max-w-[390px] max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl relative">
        
        {/* Header */}
        <div className="bg-[#0F1115] px-4 py-3 border-b border-white/5 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-amber-500" />
            <h3 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
              Track Order / UID Status
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Search Box */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 font-heading">
              Order No. (e.g. FF-829144) or UID
            </label>
            <div className="flex gap-1.5">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearch();
                }}
                placeholder="e.g. 123456789 or FF-849201"
                className="flex-1 bg-black/60 border border-white/10 focus:border-amber-500 rounded-xl py-2 px-3 text-xs text-white font-mono placeholder:font-sans placeholder:text-gray-600 focus:outline-none"
              />
              <button
                onClick={handleSearch}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider font-heading transition-colors cursor-pointer"
              >
                Track
              </button>
            </div>
          </div>

          {/* Results */}
          {searched && (
            <div>
              {searchedOrder ? (
                <div className="bg-black/40 rounded-xl p-4 border border-white/10 space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <div>
                      <span className="text-[10px] text-gray-500 font-heading uppercase block">
                        Order Number
                      </span>
                      <span className="font-mono font-bold text-amber-500 text-base">
                        {searchedOrder.orderNumber}
                      </span>
                    </div>
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase font-heading px-2.5 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Delivered
                    </span>
                  </div>

                  {/* Visual timeline */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2.5 text-emerald-400 font-medium">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Payment Verified via {searchedOrder.paymentMethod}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-emerald-400 font-medium">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Target UID Validated ({searchedOrder.uid} - {searchedOrder.ign})</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-emerald-400 font-medium">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>+{searchedOrder.totalDiamonds.toLocaleString()} Diamonds Delivered into Mailbox</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex justify-between text-xs text-gray-400">
                    <span>Processed At: <strong className="text-white">{searchedOrder.timestamp}</strong></span>
                    <span>Region: <strong className="text-white">{searchedOrder.region}</strong></span>
                  </div>
                </div>
              ) : (
                <div className="bg-black/40 rounded-xl p-4 border border-white/10 text-center space-y-2 text-xs">
                  <AlertCircle className="w-6 h-6 text-amber-500 mx-auto" />
                  <p className="text-gray-300 font-medium">
                    No active transaction found matching &quot;{searchQuery}&quot;.
                  </p>
                  <p className="text-gray-500 text-[11px]">
                    Orders are linked to your Free Fire UID. Enter your 6-12 digit numeric ID above to look up records.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Recent active orders in this session */}
          {orders.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-white/5">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 font-heading block">
                Your Recent Session Top-Ups:
              </span>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    onClick={() => {
                      setSearchedOrder(ord);
                      setSearched(true);
                    }}
                    className="p-2.5 rounded-lg bg-black/50 hover:bg-black/70 border border-white/5 cursor-pointer flex items-center justify-between text-xs transition-colors"
                  >
                    <div>
                      <span className="font-mono text-amber-500 font-bold">{ord.orderNumber}</span>
                      <span className="text-gray-400 ml-2">UID: {ord.uid}</span>
                    </div>
                    <span className="text-emerald-400 font-bold">+{ord.totalDiamonds} 💎</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
