import React, { useState } from 'react';
import { FAQS } from '../data/mockData';
import { ChevronDown, HelpCircle, ShieldCheck, Zap, Lock } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIdx(openIdx === index ? null : index);
  };

  return (
    <div className="bg-[#16181F] rounded-2xl border border-white/5 p-4 shadow-xl space-y-4" id="faq-section">
      <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
            <HelpCircle className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <h2 className="text-sm font-bold font-heading text-white tracking-wide uppercase">
              Frequently Asked Questions
            </h2>
            <p className="text-[10px] text-gray-400">
              Recharge & delivery help
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {FAQS.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'bg-black/50 border-amber-500/40 shadow-md'
                  : 'bg-black/30 hover:bg-black/40 border-white/5'
              }`}
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-3 text-left flex items-center justify-between gap-2 font-heading font-bold text-xs text-white tracking-wide uppercase cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-amber-500 transition-transform duration-200 shrink-0 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-3 pb-3 pt-0.5 text-[11px] text-gray-300 border-t border-white/5 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
