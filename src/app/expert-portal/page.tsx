'use client';

import React, { useEffect, useState } from 'react';
import { UserCircle2, CheckCircle2, Bot, FlaskConical, LayoutList, Share2, Loader2, ArrowRight, X, MessageSquare } from 'lucide-react';
import { useTranslations } from 'next-intl';

type QueueItem = {
  queue_id: string;
  brand_name: string;
  object_type: string;
  request_date: string;
  source_data: any;
  ai_draft: string;
};

export default function ExpertPortal() {
  const t = useTranslations('ExpertPortal');
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [approvedIds, setApprovedIds] = useState<Set<string>>(new Set());
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    fetch('/api/v1/expert/queue')
      .then(r => r.json())
      .then(d => {
        if(d.success) setQueue(d.pending_queue);
        setLoading(false);
      });
  }, []);

  const handleApprove = (id: string) => {
    setApprovedIds(prev => new Set([...prev, id]));
    // In actual implementation, this calls PUT /api/v1/expert/queue/[id] { status: 'verified' }
  };

  const handleRejectSubmit = () => {
    if (!rejectingId) return;
    setApprovedIds(prev => new Set([...prev, rejectingId])); // Mock removing it from queue
    setRejectingId(null);
    setFeedback('');
    // In actual implementation, this routes the feedback payload to Brand Admin API
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-5xl space-y-6">
        
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
              <UserCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{t('title')}</h1>
              <p className="text-slate-500 font-medium text-sm">{t('subtitle')}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-5 py-2.5 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-xl font-medium text-sm flex items-center gap-2">
              <LayoutList className="w-4 h-4" /> {t('tabPending')}
              <span className="bg-white px-2 py-0.5 rounded-full text-xs font-bold text-indigo-600 border border-indigo-100">
                {queue.length - approvedIds.size}
              </span>
            </button>
            <button className="px-5 py-2.5 hover:bg-slate-100 text-slate-600 rounded-xl font-medium text-sm transition-colors">
              {t('tabCompleted')}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center p-12 bg-white rounded-3xl border border-slate-200 box-shadow-sm">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            {queue.filter(q => !approvedIds.has(q.queue_id)).length === 0 ? (
               <div className="flex flex-col items-center justify-center p-16 bg-white rounded-3xl border border-slate-200 shadow-sm text-slate-500">
                 <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-3" />
                 <p className="font-medium">{t('noPending')}</p>
               </div>
            ) : (
              queue.map(item => {
                if(approvedIds.has(item.queue_id)) return null;

                return (
                  <div key={item.queue_id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col md:flex-row">
                    <div className="md:w-1/3 bg-slate-50/50 p-6 border-r border-slate-100 shrink-0">
                      <div className="text-xs font-bold tracking-widest text-slate-400 mb-4 uppercase">
                        Source Payload
                      </div>
                      <div className="mb-6">
                        <div className="text-sm text-slate-500 mb-1">브랜드</div>
                        <div className="font-semibold text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg w-fit">
                          {item.brand_name}
                        </div>
                      </div>
                      <div className="mb-6">
                        <div className="text-sm text-slate-500 mb-2 flex items-center gap-1.5"><FlaskConical className="w-4 h-4"/> 성분 명칭</div>
                        <div className="font-medium text-slate-800 text-lg">
                          {item.source_data.ingredient}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-500 mb-2">제출된 클레임 (Claims)</div>
                        <ul className="space-y-2">
                          {item.source_data.claims.map((c: string, idx: number) => (
                            <li key={idx} className="bg-indigo-50 text-indigo-700 text-sm font-medium px-3 py-2 rounded-xl flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> {c}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="md:w-2/3 p-6 md:p-8 flex flex-col bg-white">
                      <div className="flex items-center justify-between border-b border-indigo-100 pb-4 mb-6">
                        <h3 className="font-bold flex items-center gap-2 text-indigo-900 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100">
                          <Bot className="w-5 h-5 text-indigo-500" /> {t('aiDraftTitle')}
                        </h3>
                        <span className="text-xs font-medium text-slate-400">ID: {item.queue_id}</span>
                      </div>
                      
                      <div className="flex-grow">
                        <p className="text-slate-700 leading-relaxed text-[15px] p-5 bg-gradient-to-br from-indigo-50/30 to-purple-50/30 border border-slate-100 rounded-2xl shadow-[inset_0_2px_10px_-5px_rgba(0,0,0,0.05)]">
                          {item.ai_draft}
                        </p>
                      </div>

                      <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-100">
                        <button 
                          onClick={() => setRejectingId(item.queue_id)}
                          className="px-5 py-3 font-medium text-slate-500 hover:text-slate-700 transition-colors"
                        >
                          {t('btnReject')}
                        </button>
                        <button 
                          onClick={() => handleApprove(item.queue_id)}
                          className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium shadow flex items-center gap-2 transition-transform active:scale-95"
                        >
                          <Share2 className="w-4 h-4 text-emerald-400" />
                          {t('btnApprove')}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {rejectingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-lg border border-slate-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-rose-500" /> {t('rejectModalTitle')}
              </h3>
              <button onClick={() => { setRejectingId(null); setFeedback(''); }} className="p-2 hover:bg-slate-200 rounded-full text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-slate-500 mb-4">{t('rejectModalDesc')}</p>
              <textarea 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm text-slate-900 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all h-32 resize-none"
                placeholder={t('rejectPlaceholder')}
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
              />
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button 
                onClick={() => { setRejectingId(null); setFeedback(''); }}
                className="px-5 py-2.5 text-slate-600 font-medium hover:text-slate-800"
              >
                취소
              </button>
              <button 
                onClick={handleRejectSubmit}
                disabled={feedback.trim() === ''}
                className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-300 text-white rounded-xl font-medium shadow-sm transition-colors"
              >
                {t('btnSubmitReject')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
