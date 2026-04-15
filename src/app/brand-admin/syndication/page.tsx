'use client';
import React, { useState } from 'react';
import { Share2, FileCode2, Copy, CheckCircle2, ChevronRight, LayoutTemplate } from 'lucide-react';

export default function SyndicationHub() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const SYNDICATABLE_CONTENT = [
    {
      cq_id: 'CQ-FIT-PREGNANCY',
      title: '민감 피부 임산부 사용 적합성',
      status: 'VERIFIED',
      brand_id: 'BRAND-GOOD'
    },
    {
      cq_id: 'CQ-HOWTO-ROUTINE',
      title: '스킨케어 데일리 레이어링 루틴',
      status: 'VERIFIED',
      brand_id: 'BRAND-GOOD'
    }
  ];

  const handleCopy = (cqId: string, brandId: string) => {
    const embedCode = `<iframe src="https://kbeautyhub.com/embed/${brandId}/${cqId}" width="100%" height="600" style="border:none; border-radius: 16px; overflow: hidden;" title="SSoT Verified Answer"></iframe>`;
    
    // In real app: navigator.clipboard.writeText(embedCode);
    setCopiedCode(cqId);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 flex items-center justify-center text-white shadow-lg">
            <Share2 size={20} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Syndication Hub</h1>
        </div>
        <p className="text-slate-500 text-lg">Embed your SSoT-verified content into any external storefront or D2C mall.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Main Content Area */}
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <LayoutTemplate size={20} className="text-indigo-500"/> Verified Content Ready for Embed
          </h2>
          
          <div className="space-y-4">
            {SYNDICATABLE_CONTENT.map(content => (
              <div key={content.cq_id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-emerald-100 text-emerald-700 text-[10px] uppercase font-black px-2 py-0.5 rounded-full ring-1 ring-emerald-500/20">
                        {content.status}
                      </span>
                      <span className="text-slate-400 text-xs font-mono">{content.cq_id}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">{content.title}</h3>
                    <p className="text-sm text-slate-500 mb-4">Click below to generate a lightweight iFrame widget.</p>
                  </div>
                  
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/60 relative group">
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <button 
                      onClick={() => handleCopy(content.cq_id, content.brand_id)}
                      className="bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-bold px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition shadow-sm active:scale-95"
                    >
                      {copiedCode === content.cq_id ? (
                         <><CheckCircle2 size={16} className="text-emerald-500"/> Copied!</>
                      ) : (
                         <><Copy size={16} /> Copy HTML</>
                      )}
                    </button>
                  </div>
                  <pre className="text-xs font-mono text-slate-600 overflow-x-auto w-[80%] pr-4 pt-1">
                    &lt;iframe src="https://kbeautyhub.com/embed/{content.brand_id}/{content.cq_id}" width="100%" height="600" style="border:none..."&gt;&lt;/iframe&gt;
                  </pre>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
           <div className="bg-gradient-to-b from-indigo-900 to-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
             <FileCode2 size={100} className="absolute right-[-20px] top-[-20px] text-white opacity-10" />
             <h3 className="text-lg font-black mb-3">Anywhere, Zero Config</h3>
             <p className="text-indigo-200 text-sm mb-6 leading-relaxed">
               Drop this HTML snippet into your Shopify, Cafe24 dashboard, or Olive Young partner page. The widget automatically adapts to the container's width.
             </p>
             <ul className="space-y-3">
               <li className="flex items-center gap-2 text-sm font-medium"><CheckCircle2 size={16} className="text-emerald-400"/> Cross-origin secure</li>
               <li className="flex items-center gap-2 text-sm font-medium"><CheckCircle2 size={16} className="text-emerald-400"/> Mobile responsive layout</li>
               <li className="flex items-center gap-2 text-sm font-medium"><CheckCircle2 size={16} className="text-emerald-400"/> Real-time data sync</li>
             </ul>
           </div>
        </div>

      </div>

    </div>
  );
}
