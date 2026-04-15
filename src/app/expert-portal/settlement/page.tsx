'use client';
import React, { useState } from 'react';
import { ShieldCheck, UserCircle, Inbox, Wallet, ArrowUpRight, ArrowDownToLine, Clock, CheckCircle2 } from 'lucide-react';

export default function EarningsAndSettlement() {
  const [withdrawState, setWithdrawState] = useState<'idle' | 'processing' | 'done'>('idle');

  const SETTLEMENTS = [
    {
      id: 'tx_88',
      date: 'Oct 24, 2026',
      brand: 'Brand Good',
      task: 'QIS-FIT-PREGNANCY',
      gross: 200,
      fee: 60,
      net: 140,
      status: 'cleared'
    },
    {
      id: 'tx_87',
      date: 'Oct 19, 2026',
      brand: 'K-Beauty Popular',
      task: 'QIS-PROOF-SENSITIVE',
      gross: 250,
      fee: 75,
      net: 175,
      status: 'cleared'
    },
    {
      id: 'tx_86',
      date: 'Oct 12, 2026',
      brand: 'Trending Derma',
      task: 'QIS-REVIEW-ACNE',
      gross: 150,
      fee: 45,
      net: 105,
      status: 'cleared'
    }
  ];

  const handleWithdraw = () => {
    setWithdrawState('processing');
    setTimeout(() => {
      setWithdrawState('done');
    }, 2000);
  };

  return (
    <div className="flex bg-slate-900 min-h-screen text-slate-100">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900 flex flex-col hidden md:flex">
        <div className="p-6">
          <h1 className="text-xl font-black tracking-tighter text-indigo-400">
            People<span className="text-white">SSoT</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 uppercase font-bold">Expert Workspace</p>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <a href="/expert-portal" className="flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors text-slate-400 hover:bg-slate-800 hover:text-white font-medium cursor-pointer">
            <div className="flex items-center space-x-3">
              <Inbox size={18} />
              <span>Deal Inbox</span>
            </div>
            <span className="bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">1 New</span>
          </a>
          <a href="/expert-portal/settlement" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors bg-indigo-500/10 text-indigo-400 font-medium cursor-pointer">
            <ShieldCheck size={18} />
            <span>Earnings & Settlement</span>
          </a>
        </nav>

        <div className="p-4 border-t border-slate-800 text-sm flex items-center space-x-3 bg-slate-900 w-full mt-auto">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white">
            <UserCircle size={20} />
          </div>
          <div className="overflow-hidden">
            <p className="font-bold text-white truncate">Dr. Lee</p>
            <p className="text-xs text-slate-400 truncate">Seoul Clinic SSoT</p>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto h-screen p-10 bg-slate-800">
        <div className="max-w-5xl mx-auto space-y-8">
          
          <header className="mb-8 border-b border-slate-700 pb-6 flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-black text-white">Earnings & Settlement</h1>
              <p className="text-slate-400 mt-2 text-lg">Manage your expert revenue and request withdrawals.</p>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Wallet Balance Card */}
            <div className="md:col-span-2 bg-gradient-to-br from-indigo-900 to-slate-900 border border-indigo-500/50 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-20">
                <Wallet size={120} />
              </div>
              <div className="relative z-10">
                <p className="text-indigo-300 font-bold tracking-wider text-sm mb-2">AVAILABLE BALANCE</p>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-5xl font-black text-white">$420.00</span>
                  <span className="text-indigo-400 font-medium">USD</span>
                </div>

                {withdrawState === 'idle' && (
                  <button 
                    onClick={handleWithdraw}
                    className="bg-indigo-500 hover:bg-indigo-400 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition active:scale-95"
                  >
                    <ArrowDownToLine size={18} /> Request Withdrawal to Bank
                  </button>
                )}
                
                {withdrawState === 'processing' && (
                  <button disabled className="bg-slate-700 text-slate-300 font-bold py-3 px-6 rounded-xl flex items-center gap-2 cursor-wait">
                    <span className="w-4 h-4 rounded-full border-2 border-slate-400 border-t-white animate-spin"></span> Processing...
                  </button>
                )}

                {withdrawState === 'done' && (
                  <div className="bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 font-bold py-3 px-6 rounded-xl flex items-center gap-2 inline-flex">
                    <CheckCircle2 size={18} /> Withdrawal Requested ($420.00)
                  </div>
                )}
              </div>
            </div>

            {/* Lifetime Earning Stats */}
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-xl flex flex-col justify-center">
               <div className="mb-4 text-slate-400 font-bold tracking-wider text-xs">LIFETIME EARNINGS (NET)</div>
               <div className="text-3xl font-black text-emerald-400 mb-1">$12,450.00</div>
               <div className="text-sm text-slate-500 mb-6">+142 deals completed</div>

               <div className="mb-2 text-slate-400 font-bold tracking-wider text-xs">PLATFORM CONTRIBUTION</div>
               <div className="text-lg font-bold text-slate-300">$5,335.00</div>
               <div className="text-xs text-slate-500">Total fees paid (30% cut)</div>
            </div>

          </div>

          <div className="mt-12">
            <h2 className="text-xl font-bold text-white mb-4">Recent Settlements</h2>
            <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-800/80 text-slate-400 text-xs uppercase tracking-wider">
                    <th className="p-4 font-bold border-b border-slate-700">Date/ID</th>
                    <th className="p-4 font-bold border-b border-slate-700">Brand & Task</th>
                    <th className="p-4 font-bold border-b border-slate-700 text-right">Gross Fee</th>
                    <th className="p-4 font-bold border-b border-slate-700 text-right text-pink-400">Platform (30%)</th>
                    <th className="p-4 font-bold border-b border-slate-700 text-right text-emerald-400">Net Earning</th>
                    <th className="p-4 font-bold border-b border-slate-700 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-sm">
                  {SETTLEMENTS.map(tx => (
                    <tr key={tx.id} className="hover:bg-slate-800/40 transition">
                      <td className="p-4">
                        <div className="text-slate-200 font-bold">{tx.date}</div>
                        <div className="text-slate-500 text-xs font-mono">{tx.id}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-white font-medium">{tx.brand}</div>
                        <div className="text-slate-400 text-xs">{tx.task}</div>
                      </td>
                      <td className="p-4 text-right text-slate-300 font-mono">${tx.gross.toFixed(2)}</td>
                      <td className="p-4 text-right text-pink-400 font-mono">-${tx.fee.toFixed(2)}</td>
                      <td className="p-4 text-right text-emerald-400 font-black tracking-tight">${tx.net.toFixed(2)}</td>
                      <td className="p-4 text-center">
                        <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-md text-[10px] uppercase font-bold border border-emerald-500/20">
                          <CheckCircle2 size={12} /> {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>

    </div>
  );
}
