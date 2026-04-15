'use client';

import React, { useState } from 'react';
import { Building2, Code2, Check, FileCheck2, Loader2, Eye, X, Plus, Image as ImageIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function BrandAdminDashboard() {
  const t = useTranslations('BrandAdmin');
  
  // Using Mock Data directly to ensure prototype stability without strict Auth matching
  const MOCK_ASSETS = [
    {
      object_id: 'asset-7a8b9c-test-001',
      object_type: 'ingredient_efficacy',
      status: 'verified',
      payload: {
        ingredient: "Advanced Snail 96 Mucin",
        expert_reviewer: "Dr. Jane Cho",
      }
    },
    {
      object_id: 'media-test-image-001',
      object_type: 'media',
      status: 'verified',
      payload: {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=2000&auto=format&fit=crop',
        title: 'Snail Mucin Before & After (4 Weeks)',
        related_claim: '피부 수분 장벽 강화'
      }
    }
  ];

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);

  const handleCopyCode = (id: string) => {
    const iframeCode = `<iframe src="http://localhost:3000/embed/asset/${id}" width="400" height="320" style="border:none; border-radius:16px; box-shadow:0 4px 6px -1px rgb(0 0 0 / 0.1);" title="KBeauty SSoT Verified Asset"></iframe>`;
    navigator.clipboard.writeText(iframeCode);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="flex items-center justify-between border-b border-slate-200 pb-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-blue-100 text-blue-700 rounded-2xl">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{t('title')}</h1>
              <p className="text-slate-500 mt-1">{t('subtitle')}</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-sm transition-colors">
            <Plus className="w-4 h-4" />
            {t('btnAddAsset')}
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-100/50 border-b border-slate-200 text-slate-600 text-sm">
              <tr>
                <th className="p-5 font-semibold">{t('colID')}</th>
                <th className="p-5 font-semibold">{t('colType')}</th>
                <th className="p-5 font-semibold">{t('colStatus')}</th>
                <th className="p-5 font-semibold">{t('colAction')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_ASSETS.map(asset => (
                <tr key={asset.object_id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-5">
                    <div className="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded inline-block">
                      {asset.object_id}
                    </div>
                    <div className="text-sm font-medium text-slate-900 mt-2">
                       {asset.object_type === 'media' ? asset.payload.title : asset.payload.ingredient}
                    </div>
                  </td>
                  <td className="p-5">
                    {asset.object_type === 'media' ? (
                       <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 capitalize">
                        <ImageIcon className="w-3.5 h-3.5" /> Media Asset
                       </span>
                    ) : (
                       <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 capitalize">
                        <FileCheck2 className="w-3.5 h-3.5" /> Ingredient Efficacy
                       </span>
                    )}
                  </td>
                  <td className="p-5">
                    {asset.status === 'verified' ? (
                      <span className="text-emerald-700 font-medium text-sm flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" /> {t('verified')}
                      </span>
                    ) : (
                      <span className="text-slate-500 font-medium text-sm flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-slate-300" /> {t('draft')}
                      </span>
                    )}
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyCode(asset.object_id)}
                        disabled={asset.status !== 'verified'}
                        className="flex items-center gap-2 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {copiedId === asset.object_id ? (
                          <><Check className="w-4 h-4 text-emerald-400" /> {t('copied')}</>
                        ) : (
                          <><Code2 className="w-4 h-4" /> {t('btnCopy')}</>
                        )}
                      </button>
                      <button
                        onClick={() => setPreviewId(asset.object_id)}
                        disabled={asset.status !== 'verified'}
                        className="flex items-center gap-1.5 px-3 py-2 bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Eye className="w-4 h-4" /> {t('btnPreview')}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {previewId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-lg border border-slate-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <Eye className="w-5 h-5 text-indigo-500" /> {t('previewTitle')}
              </h3>
              <button onClick={() => setPreviewId(null)} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-8 flex justify-center bg-slate-100/30">
              <iframe 
                src={`/embed/asset/${previewId}`} 
                width="400" 
                height="320" 
                style={{ border: 'none', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                title="KBeauty SSoT Verified Asset"
              />
            </div>
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 text-xs text-slate-500 text-center">
              실제 삽입 환경에서는 위젯의 배경이 투명하게 처리되어 자사몰 디자인과 스며들게 렌더링 됩니다.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
