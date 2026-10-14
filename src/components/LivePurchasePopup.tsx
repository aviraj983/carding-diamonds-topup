import React, { useState, useEffect } from 'react';
import { User, X } from 'lucide-react';

interface PurchaseItem {
  id: number;
  uid: string;
  diamonds: string;
}

const PURCHASES: PurchaseItem[] = [
  { id: 1, uid: '5271****23', diamonds: '13,550 Diamonds' },
  { id: 2, uid: '1894****71', diamonds: '3,410 Diamonds' },
  { id: 3, uid: '9420****33', diamonds: '7,480 Diamonds' },
  { id: 4, uid: '4819****95', diamonds: '20,700 Diamonds' },
  { id: 5, uid: '7302****16', diamonds: '33,499 Diamonds' },
  { id: 6, uid: '2651****89', diamonds: '93,999 Diamonds' },
  { id: 7, uid: '8392****40', diamonds: '13,550 Diamonds' },
  { id: 8, uid: '6145****08', diamonds: '7,480 Diamonds' },
  { id: 9, uid: '3920****52', diamonds: '20,700 Diamonds' },
];

export const LivePurchasePopup: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Initial delay before showing first popup
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(initialTimer);
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    // Keep visible for 4.5 seconds, then hide
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 4500);

    return () => clearTimeout(hideTimer);
  }, [isVisible, currentIndex]);

  useEffect(() => {
    if (isVisible || isDismissed) return;

    // When hidden, wait 4 seconds before showing next purchase item
    const nextTimer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % PURCHASES.length);
      setIsVisible(true);
    }, 4000);

    return () => clearTimeout(nextTimer);
  }, [isVisible, isDismissed]);

  const handleClose = () => {
    setIsVisible(false);
    // Temporary pause for 12 seconds when user manually closes
    setIsDismissed(true);
    setTimeout(() => {
      setIsDismissed(false);
    }, 12000);
  };

  const current = PURCHASES[currentIndex];

  return (
    <div
      className={`fixed bottom-5 left-4 sm:bottom-6 sm:left-6 z-40 transition-all duration-500 ease-out pointer-events-auto ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
      }`}
    >
      <div className="relative flex items-center gap-3 bg-[#16181F]/95 backdrop-blur-md border border-amber-500/35 rounded-2xl px-3.5 py-2.5 shadow-2xl shadow-black/90 ring-1 ring-amber-500/15 max-w-[280px] sm:max-w-[310px]">
        {/* Floating Amber Close Button */}
        <button
          onClick={handleClose}
          className="absolute -top-2.5 -right-2.5 w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black flex items-center justify-center shadow-md shadow-amber-500/30 border border-amber-300/50 transition-transform hover:scale-110 active:scale-90 cursor-pointer z-10"
          aria-label="Close notification"
        >
          <X className="w-3 h-3 stroke-[3] text-black" />
        </button>

        {/* Left Avatar Icon in Amber Theme */}
        <div className="w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-inner">
          <User className="w-4.5 h-4.5 text-amber-400" />
        </div>

        {/* Middle Details */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="font-heading font-extrabold text-white text-[13px] tracking-wide leading-tight truncate">
            {current.uid}
          </div>
          <div className="text-[12px] text-gray-300 font-medium leading-tight mt-0.5 truncate">
            bought <span className="text-amber-400 font-extrabold font-display">{current.diamonds}</span>
          </div>
        </div>

        {/* Right Green Status Dot */}
        <div className="shrink-0 flex items-center">
          <span className="w-2 h-2 rounded-full bg-[#00e676] shadow-[0_0_8px_#00e676]" />
        </div>
      </div>
    </div>
  );
};
