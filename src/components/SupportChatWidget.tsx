import React from 'react';
import { Send } from 'lucide-react';

export const SupportChatWidget: React.FC = () => {
  return (
    <div className="fixed bottom-5 right-5 z-40">
      <a
        href="https://t.me/+XMWXoHtXyYs4NGQ1"
        target="_blank"
        rel="noopener noreferrer"
        className="relative px-4 py-3 rounded-full bg-[#0088cc] hover:bg-[#0077b3] text-white font-extrabold text-xs uppercase tracking-wider font-heading flex items-center gap-2 shadow-2xl shadow-cyan-500/30 hover:scale-105 transition-all group cursor-pointer border border-cyan-400/30"
        id="telegram-support-btn"
        title="Join Telegram Support Channel"
      >
        <span className="flex h-2.5 w-2.5 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
        </span>

        {/* Telegram Icon SVG */}
        <svg
          className="w-4 h-4 fill-current transition-transform duration-300 group-hover:rotate-12"
          viewBox="0 0 24 24"
        >
          <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.562 8.161c-.18.717-.962 4.084-1.362 5.462-.169.584-.385.78-.593.799-.454.041-.799-.3-1.24-.589-.691-.453-1.082-.734-1.754-1.177-.777-.512-.274-.793.169-1.254.116-.121 2.128-1.95 2.167-2.115.005-.021.009-.1-.033-.142-.042-.042-.104-.028-.149-.018-.064.014-1.084.688-3.06 2.023-.289.199-.551.297-.785.291-.258-.006-.755-.146-1.124-.266-.452-.148-.812-.226-.781-.477.016-.131.196-.265.539-.403 2.113-.919 3.524-1.526 4.232-1.821 2.019-.841 2.439-.987 2.712-.992.06 0 .193.014.28.087.073.061.094.144.103.203.009.06.019.202.009.313z" />
        </svg>

        <span className="font-heading font-black text-xs tracking-wider">Telegram Support</span>
      </a>
    </div>
  );
};
