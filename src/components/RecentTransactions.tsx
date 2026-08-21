import React, { useState, useEffect } from 'react';
import { User, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

interface Transaction {
  id: string;
  uid: string;
  amount: string;
  timeAgo: string;
}

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: '1', uid: '5108****38', amount: '64800 Diamonds', timeAgo: 'JUST NOW' },
  { id: '2', uid: '5486****14', amount: '28999 Diamonds', timeAgo: '1M AGO' },
  { id: '3', uid: '5698****82', amount: '8100 Diamonds', timeAgo: '49M AGO' },
  { id: '4', uid: '5436****71', amount: '12000 Diamonds', timeAgo: '42M AGO' },
  { id: '5', uid: '5756****94', amount: '16200 Diamonds', timeAgo: '4M AGO' },
  { id: '6', uid: '5941****75', amount: '78999 Diamonds', timeAgo: '60M AGO' },
  { id: '7', uid: '5719****16', amount: '32400 Diamonds', timeAgo: '58M AGO' },
  { id: '8', uid: '5727****56', amount: '18000 Diamonds', timeAgo: '25M AGO' },
];

const PACKS = [
  '3100 Diamonds',
  '6800 Diamonds',
  '12000 Diamonds',
  '18000 Diamonds',
  '28999 Diamonds',
  '78999 Diamonds',
];

export const RecentTransactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);

  // Live updates simulator: push a new transaction occasionally
  useEffect(() => {
    const interval = setInterval(() => {
      const randomPrefix = Math.floor(5000 + Math.random() * 4999);
      const randomSuffix = Math.floor(10 + Math.random() * 89);
      const randomUid = `${randomPrefix}****${randomSuffix}`;
      const randomPack = PACKS[Math.floor(Math.random() * PACKS.length)];

      const newTx: Transaction = {
        id: Date.now().toString(),
        uid: randomUid,
        amount: randomPack,
        timeAgo: 'JUST NOW',
      };

      setTransactions((prev) => [newTx, ...prev.slice(0, 7)]);
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-8 px-3.5 sm:px-4 space-y-5" id="recent-transactions">
      {/* Header Section */}
      <div className="text-center space-y-2">
        {/* Live Updates Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold tracking-wider uppercase">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>LIVE UPDATES</span>
        </div>

        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-black italic uppercase tracking-tight font-display text-white">
          RECENT <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-400 bg-clip-text text-transparent inline-block pr-2">TRANSACTIONS</span>
        </h2>

        {/* Subtitle */}
        <p className="text-xs text-gray-400">
          Real-time successful top-ups from our community
        </p>
      </div>

      {/* Transactions Table Card */}
      <div className="bg-[#0B0D13] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        {/* Table Header */}
        <div className="grid grid-cols-12 px-4 py-3 bg-white/[0.02] border-b border-white/5 text-[10px] font-bold font-heading uppercase tracking-wider text-gray-500">
          <div className="col-span-5 sm:col-span-5">PLAYER ID</div>
          <div className="col-span-4 sm:col-span-4 text-center sm:text-left">AMOUNT</div>
          <div className="col-span-3 sm:col-span-3 text-right">STATUS</div>
        </div>

        {/* Transaction Rows */}
        <div className="divide-y divide-white/5">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="grid grid-cols-12 items-center px-4 py-3.5 hover:bg-white/[0.02] transition-colors"
            >
              {/* Player ID column */}
              <div className="col-span-5 sm:col-span-5 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <span className="font-mono text-xs sm:text-sm font-bold text-white tracking-wider">
                  {tx.uid}
                </span>
              </div>

              {/* Amount column */}
              <div className="col-span-4 sm:col-span-4 flex flex-col justify-center text-center sm:text-left">
                <span className="font-heading font-black italic text-xs sm:text-sm text-amber-400 tracking-wide">
                  {tx.amount}
                </span>
                <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">
                  {tx.timeAgo}
                </span>
              </div>

              {/* Status column */}
              <div className="col-span-3 sm:col-span-3 flex justify-end">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-extrabold tracking-wider uppercase">
                  SUCCESS
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
