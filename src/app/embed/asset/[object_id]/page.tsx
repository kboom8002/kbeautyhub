'use client';

import React, { useEffect, useState } from 'react';
import { ShieldCheck, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

export default function AssetEmbedWidget() {
  const t = useTranslations('Embed');
  const [asset, setAsset] = useState<any>(null);
  const params = useParams();
  const object_id = params.object_id as string;

  useEffect(() => {
    if (!object_id) return;
    fetch(`/api/v1/syndication/assets/${object_id}`)
      .then(r => r.json())
      .then(d => {
        if(d.success) setAsset(d.data);
      });
  }, [object_id]);

  if (!asset) return <div className="p-4 flex justify-center"><div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>;

  const payload = JSON.parse(asset.payload);

  if (asset.object_type === 'media') {
    return (
      <a 
        href="http://localhost:3000/"
        target="_blank"
        rel="noopener noreferrer"
        className="block relative w-full h-[320px] rounded-2xl overflow-hidden group cursor-pointer"
      >
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" 
          style={{ backgroundImage: `url(${payload.url})` }} 
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12">
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="text-white font-bold text-sm tracking-wide">{t('watermarkLabel')}</span>
          </div>
          <p className="text-white/80 text-xs font-medium">{payload.related_claim}</p>
        </div>
      </a>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 font-sans w-full max-w-sm mx-auto overflow-hidden">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
        <ShieldCheck className="w-7 h-7 text-emerald-500" />
        <div>
          <h4 className="font-bold text-slate-900 text-sm">{t('badgeTitle')}</h4>
          <span className="text-xs text-slate-500 font-medium tracking-wide">KBeauty SSoT Platform</span>
        </div>
      </div>
      
      <div className="space-y-3 mb-5">
        <div>
          <div className="text-xs text-slate-400 font-semibold mb-1">INGREDIENT</div>
          <div className="text-sm font-bold text-slate-800">{payload.ingredient}</div>
        </div>
        
        <div>
          <div className="text-xs text-slate-400 font-semibold mb-1">VERIFIED EFFICACY</div>
          <ul className="space-y-1">
            {payload.claims?.map((claim: string, i: number) => (
              <li key={i} className="flex items-start gap-1.5 text-xs text-slate-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                {claim}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 mb-4">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-500">{t('expertNotice')}</span>
          <span className="font-semibold text-slate-800">{payload.expert_reviewer}</span>
        </div>
      </div>

      <a 
        href="http://localhost:3000/" 
        target="_blank"
        rel="noopener noreferrer"
        className="w-full flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2.5 rounded-lg transition-colors"
      >
        {t('readMore')} <ArrowUpRight className="w-3.5 h-3.5" />
      </a>
    </div>
  );
}
