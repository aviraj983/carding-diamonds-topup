import React from 'react';
import { Lock, Server } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#050608] border-t border-white/10 pt-10 pb-8 text-gray-400 text-xs relative overflow-hidden" id="main-footer">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-white/5">
          
          {/* Col 1: Brand & Details */}
          <div className="md:col-span-6 space-y-3.5 pr-0 sm:pr-4">
            {/* Clean Logo: CARDING (White) DIAMONDS (Yellow) with matching font style */}
            <div className="flex items-center gap-1.5">
              <span className="font-display font-black text-2xl tracking-tight uppercase italic text-white">
                CARDING
              </span>
              <span className="font-display font-black text-2xl tracking-tight uppercase italic text-amber-400">
                DIAMONDS
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-400 text-xs leading-relaxed max-w-md">
              India's premier destination for instant Free Fire Diamond top-ups. We deliver lightning-fast processing, bank-grade security, and unmatched reliability for gamers nationwide.
            </p>
          </div>

          {/* Col 2: COMPANY */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-heading font-bold text-white text-xs sm:text-sm uppercase tracking-wider">
              COMPANY
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <a href="#about" className="hover:text-amber-400 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-amber-400 transition-colors">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-amber-400 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#refund" className="hover:text-amber-400 transition-colors">
                  Refund Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: SUPPORT */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-heading font-bold text-white text-xs sm:text-sm uppercase tracking-wider">
              SUPPORT
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <a href="#help" className="hover:text-amber-400 transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-amber-400 transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-amber-400 transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright & trust badges line */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <div className="text-center sm:text-left text-gray-400 text-[11px] whitespace-nowrap">
            © 2026 <strong className="text-white font-semibold">CARDING DIAMONDS</strong>. All rights reserved.
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 text-[11px]">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-emerald-400 font-medium whitespace-nowrap">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>256-Bit SSL Secured</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-amber-400 font-medium whitespace-nowrap">
              <Server className="w-3 h-3 text-amber-400" />
              <span>Garena UID Server</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};
