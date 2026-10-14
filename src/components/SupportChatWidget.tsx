import React from 'react';

export const SupportChatWidget: React.FC = () => {
  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50">
      <a
        href="https://t.me/+XMWXoHtXyYs4NGQ1"
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center justify-center w-14 h-14 group cursor-pointer"
        id="telegram-support-fab"
        title="Telegram Support"
        aria-label="Telegram Support"
      >
        {/* Subtle Outer Glowing Ripple Ring */}
        <span className="absolute inset-[-4px] rounded-full border-2 border-[#0088cc]/30 shadow-[0_0_18px_rgba(0,136,204,0.35)] pointer-events-none" />
        <span className="absolute inset-[-4px] rounded-full bg-[#0088cc]/15 animate-ping pointer-events-none" />

        {/* Circular Blue Action Button */}
        <div className="relative w-14 h-14 rounded-full bg-[#0088cc] hover:bg-[#0077b3] flex items-center justify-center shadow-[0_4px_25px_rgba(0,136,204,0.55)] group-hover:scale-105 active:scale-95 transition-all duration-300">
          {/* Inner White Circle */}
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md">
            {/* Blue Telegram Airplane Logo */}
            <svg
              className="w-4.5 h-4.5 fill-[#0088cc] -translate-x-[1px] translate-y-[0.5px] transition-transform duration-300 group-hover:scale-110"
              viewBox="0 0 24 24"
            >
              <path d="M20.665 3.717l-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l-.313 4.672c.46 0 .664-.211.921-.46l2.211-2.15 4.599 3.397c.848.467 1.457.227 1.668-.785l3.019-14.228c.309-1.239-.473-1.8-1.282-1.411z" />
            </svg>
          </div>
        </div>
      </a>
    </div>
  );
};
