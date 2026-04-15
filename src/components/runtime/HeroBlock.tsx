import React from 'react';
import { Sparkles } from 'lucide-react';

export default function HeroBlock({ data }: { data: any }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-50 to-white p-8 shadow-sm border border-indigo-100 flex flex-col items-center justify-center text-center">
      {/* Decorative background element */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-200 rounded-full blur-3xl opacity-30" />
      
      <div className="flex items-center space-x-2 text-indigo-600 mb-4 bg-white/60 px-3 py-1 rounded-full text-sm font-semibold tracking-wide uppercase shadow-sm border border-indigo-50">
        <Sparkles size={16} />
        <span>K-Beauty Verified</span>
      </div>

      <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight leading-tight mb-4">
        {data.title || "Brand Name"}
      </h1>

      <p className="text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
        {data.answer_short || "The perfect start for your skin."}
      </p>
    </div>
  );
}
