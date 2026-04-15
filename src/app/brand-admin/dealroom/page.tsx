'use client';
import React, { useState } from 'react';
import { ShieldCheck, UserCircle, Search, MessageSquare, Handshake, CheckCircle2, FileText, ArrowLeft } from 'lucide-react';

const EXPERTS = [
  {
    id: 'exp_1',
    name: 'Dr. Lee',
    headline: 'Chief Dermatologist, Seoul Clinic',
    scopes: ['민감성 피부', '임산부 적합성', 'EWG Green'],
    rating: 4.9,
    dealsCompleted: 142,
    price: '$200',
    avatar: 'bg-indigo-100 text-indigo-600',
  },
  {
    id: 'exp_2',
    name: 'Researcher Kim',
    headline: 'Lead Scientist, K-Beauty Labs',
    scopes: ['성분 분석', '알러지 프리', '비건 인증'],
    rating: 4.8,
    dealsCompleted: 89,
    price: '$150',
    avatar: 'bg-emerald-100 text-emerald-600',
  }
];

export default function BrandDealroom() {
  const [dealStatus, setDealStatus] = useState<Record<string, 'none' | 'requested'>>({});

  const handleRequestDeal = (id: string) => {
    setDealStatus(prev => ({ ...prev, [id]: 'requested' }));
    // In reality, this sets up a Deal entity in the DB targeting the Expert
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center">
      
      <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-10 px-8 py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/brand-admin" className="p-2 hover:bg-slate-100 rounded-full transition"><ArrowLeft size={20} /></a>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Handshake className="text-indigo-600" /> People SSoT Dealroom
              </h1>
              <p className="text-sm text-slate-500 font-medium">Find certified experts to draft your QIS Object Bundles.</p>
            </div>
          </div>
          <div className="bg-slate-100 text-slate-600 px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2">
            Targeting: <span className="bg-white px-2 py-0.5 rounded shadow-sm text-xs border border-slate-200">CQ-FIT-PREGNANCY-AI</span>
          </div>
        </div>
      </header>

      <main className="w-full max-w-5xl mx-auto p-8">
        
        <div className="mb-8 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search experts by scope (e.g., 민감성 피부, 임산부)..." 
            className="w-full bg-white border border-slate-300 rounded-2xl py-4 pl-12 pr-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-medium"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {EXPERTS.map(expert => (
            <div key={expert.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
              <div className="flex items-start gap-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl \${expert.avatar}`}>
                  {expert.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{expert.name}</h3>
                      <p className="text-sm text-slate-500">{expert.headline}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-slate-800">{expert.price}</p>
                      <p className="text-xs text-slate-400 font-bold mb-1">per Bundle</p>
                      <span className="inline-block bg-slate-100 text-slate-500 text-[10px] uppercase font-bold px-2 py-0.5 rounded border border-slate-200 shadow-sm">
                        Incl. 30% Platform Fee
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex flex-wrap gap-2">
                    {expert.scopes.map(scope => (
                      <span key={scope} className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 text-xs font-bold px-2.5 py-1 rounded-md">
                        <ShieldCheck size={12} className="text-emerald-500" /> {scope}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-sm text-slate-500 font-medium">
                      ★ {expert.rating} <span className="text-slate-300 mx-1">|</span> {expert.dealsCompleted} deals
                    </div>
                    
                    {dealStatus[expert.id] === 'requested' ? (
                      <span className="bg-indigo-50 text-indigo-600 font-bold text-sm px-4 py-2 rounded-lg flex items-center gap-2">
                        <CheckCircle2 size={16} /> Deal Requested
                      </span>
                    ) : (
                      <button 
                        onClick={() => handleRequestDeal(expert.id)}
                        className="bg-slate-900 hover:bg-indigo-600 text-white font-bold text-sm px-5 py-2.5 rounded-lg flex items-center gap-2 transition active:scale-95"
                      >
                        <FileText size={16} /> Propose Deal
                      </button>
                    )}
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}
