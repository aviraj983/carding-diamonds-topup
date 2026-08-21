import React, { useState } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles, Check } from 'lucide-react';

export const SupportChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMsg, setInputMsg] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string; time: string }>>([
    {
      sender: 'bot',
      text: 'Hey Survivor! ⚡ Welcome to BOOYAH! Top-Up Center Support. Need help with UID verification, bonus diamond rewards, or payment confirmation?',
      time: 'Just now',
    },
  ]);

  const quickReplies = [
    'How long does top-up take?',
    'How do bonus diamonds work?',
    'Is password required?',
    'What if I typed wrong UID?',
  ];

  const handleSend = (textToSend = inputMsg) => {
    const text = textToSend.trim();
    if (!text) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { sender: 'user' as const, text, time };
    setMessages((prev) => [...prev, userMsg]);
    setInputMsg('');

    // Generate intelligent bot reply
    setTimeout(() => {
      let botResponse = 'Thank you for reaching out! Your diamonds are automatically credited in 5 seconds directly through the Garena Server Ingress once payment is verified.';
      const lower = text.toLowerCase();

      if (lower.includes('long') || lower.includes('time') || lower.includes('speed') || lower.includes('when')) {
        botResponse = '⚡ Deliveries take 3 to 15 seconds! Once payment is completed, diamonds appear directly in your Free Fire in-game mailbox/balance.';
      } else if (lower.includes('bonus') || lower.includes('reward') || lower.includes('extra')) {
        botResponse = '💎 Every diamond pack includes extra bonus diamonds! You can also apply coupon codes at checkout or spin the daily lucky wheel for more diamond rewards.';
      } else if (lower.includes('password') || lower.includes('safe') || lower.includes('login') || lower.includes('hack')) {
        botResponse = '🛡️ Zero password required! We only use your public numeric Player ID (UID). Your Free Fire account and login credentials are 100% safe.';
      } else if (lower.includes('wrong') || lower.includes('refund') || lower.includes('mistake') || lower.includes('error')) {
        botResponse = '⚠️ Before paying, use the "Verify" button in Step 1 to confirm your in-game nickname (IGN). If valid UID received diamonds, Garena transactions cannot be reversed.';
      } else if (lower.includes('coupon') || lower.includes('promo') || lower.includes('discount') || lower.includes('code')) {
        botResponse = '🎟️ Use coupon "BOOYAH50" for 15% OFF + 50 💎, or spin the "Daily Lucky Wheel" at the top of the page for up to 50% discount codes!';
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: botResponse,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 600);
  };

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative px-3.5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-[11px] uppercase tracking-wider font-heading flex items-center gap-1.5 shadow-2xl shadow-amber-500/30 hover:scale-105 transition-all group cursor-pointer"
          id="open-support-chat-btn"
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-black"></span>
          </span>
          <MessageSquare className="w-3.5 h-3.5 fill-black" />
          <span>Support</span>
        </button>
      )}

      {/* Active Chat Window */}
      {isOpen && (
        <div className="bg-[#16181F] border border-white/10 rounded-2xl w-[320px] shadow-2xl overflow-hidden flex flex-col h-[420px] animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-[#0F1115] px-3.5 py-2.5 border-b border-white/5 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-bold">
                <Bot className="w-3.5 h-3.5 text-amber-500" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-xs uppercase tracking-wide">
                  Booyah Assistant
                </h4>
                <span className="text-[9px] font-medium block text-gray-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                  Online • Instant Response
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-[#0A0B0D] text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/30 flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-xl p-2.5 leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-amber-500 text-black font-medium'
                      : 'bg-black/60 border border-white/5 text-gray-200'
                  }`}
                >
                  <p>{m.text}</p>
                  <span
                    className={`text-[9px] block mt-1 ${
                      m.sender === 'user' ? 'text-black/70 text-right' : 'text-gray-500'
                    }`}
                  >
                    {m.time}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick reply tags */}
          <div className="bg-black/40 px-3 py-2 border-t border-white/5 flex gap-1.5 overflow-x-auto no-scrollbar">
            {quickReplies.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="whitespace-nowrap bg-black/60 hover:bg-white/5 border border-white/10 text-gray-300 hover:text-amber-500 text-[10px] px-2.5 py-1 rounded-full transition-colors shrink-0 cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Chat input box */}
          <div className="p-2.5 bg-[#16181D] border-t border-white/5 flex gap-2">
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
              placeholder="Ask about UID, packs, bonus..."
              className="flex-1 bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-amber-500"
            />
            <button
              onClick={() => handleSend()}
              className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
