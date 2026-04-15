'use client';
import React, { useState } from 'react';
import { ShoppingBag, MessageCircleQuestion } from 'lucide-react';

export default function ActionSplit({ data, renderVariant }: { data: any, renderVariant: string }) {
  const [loading, setLoading] = useState(false);

  const isConsultPrimary = renderVariant === 'consult_primary' || data.fallback_consult;

  const handleConsult = () => {
    setLoading(true);
    alert('Routing to K-Beauty Expert Consult... (Simulated)');
    setTimeout(() => setLoading(false), 500);
  };

  const handleBuy = () => {
    if (isConsultPrimary) return;
    setLoading(true);
    alert('Routing to Brand Checkout... (Simulated)');
    setTimeout(() => setLoading(false), 500);
  };

  if (isConsultPrimary) {
    return (
      <div className="mt-8 flex flex-col space-y-4">
        {/* Full width Consult CTA */}
        <button 
          onClick={handleConsult}
          disabled={loading}
          className="w-full relative overflow-hidden group bg-slate-900 text-white p-5 rounded-2xl flex items-center justify-center space-x-3 hover:bg-slate-800 transition-all shadow-lg active:scale-[0.98]"
        >
          <div className="absolute inset-0 w-1/4 h-full bg-white/10 skew-x-12 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
          <MessageCircleQuestion size={24} />
          <span className="font-bold text-lg tracking-wide">Talk to an Expert First</span>
        </button>

        {/* Muted Buy CTA */}
        <button 
          onClick={handleConsult} // Even the buy button redirects to Consult because it's blocked!
          className="w-full bg-slate-100 text-slate-400 p-4 rounded-xl flex items-center justify-center space-x-2 border border-slate-200 cursor-not-allowed"
          title="Direct purchase disabled for high-risk profiles."
        >
          <ShoppingBag size={20} />
          <span className="font-medium">Direct Purchase Disabled (Requires Consult)</span>
        </button>
      </div>
    );
  }

  // Standard Split
  return (
    <div className="mt-8 flex flex-col md:flex-row gap-4">
      <button 
        onClick={handleConsult}
        disabled={loading}
        className="flex-1 bg-white text-slate-800 p-5 rounded-2xl flex items-center justify-center space-x-3 hover:bg-slate-50 transition-all shadow-sm border-2 border-slate-200 active:scale-[0.98]"
      >
        <MessageCircleQuestion size={24} className="text-slate-500" />
        <span className="font-bold text-lg tracking-wide">Ask Expert</span>
      </button>

      <button 
        onClick={handleBuy}
        disabled={loading}
        className="flex-1 bg-emerald-500 text-white p-5 rounded-2xl flex items-center justify-center space-x-3 hover:bg-emerald-600 transition-all shadow-md active:scale-[0.98]"
      >
        <ShoppingBag size={24} />
        <span className="font-bold text-lg tracking-wide">Buy Now</span>
      </button>
    </div>
  );
}
