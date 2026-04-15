'use client';
import React, { useState } from 'react';
import { ShieldCheck, Upload, FileText, Lock, FileBadge2, AlertTriangle, ExternalLink, Calendar, PlusCircle, Search as SearchIcon, CheckCircle } from 'lucide-react';
import Link from 'next/link';

// Mock Evidence Data
const mockLedger = [
  {
    id: 'EV-KBS-991',
    type: 'clinical',
    issuer: '한국피부과학연구원',
    title: '민감성 피부 일차 자극 테스트',
    date: '2025-11-15',
    status: 'verified_by_ssot', // or 'auto_approved' for public certs
    attachedDeals: 2,
    hasFile: true
  },
  {
    id: 'EV-KBS-992',
    type: 'certification',
    issuer: 'EWG',
    title: 'EWG Verified Certification',
    date: '2025-08-01',
    status: 'auto_approved',
    attachedDeals: 5,
    hasFile: true
  },
  {
    id: 'EV-KBS-995',
    type: 'expert_review',
    issuer: 'Dr. Lee',
    title: '자사몰 광고 소명 소견서 (염증 완화)',
    date: '2026-02-10',
    status: 'pending',
    attachedDeals: 0,
    hasFile: false
  }
];

export default function EvidenceLedgerPage() {
  const [ledgers, setLedgers] = useState(mockLedger);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex justify-between items-end">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 mb-2">
              <ShieldCheck size={24} />
              <h1 className="text-2xl font-black tracking-tight">Evidence Ledger</h1>
            </div>
            <p className="text-slate-500 font-medium text-sm">브랜드의 공신력을 증명하는 디지털 자산 캐비닛입니다. QIS 답변 제출 시 여기서 자료를 연결할 수 있습니다.</p>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-5 rounded-xl text-sm transition flex items-center gap-2 shadow-sm">
            <Upload size={16} /> 신규 근거자료 등록
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left: Summary Panel */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Ledger Assets</h3>
            <div className="text-3xl font-black text-slate-800">{ledgers.length}<span className="text-lg text-slate-400 font-medium"> 건</span></div>
            <p className="text-xs text-slate-500 mt-1">총 자산화된 근거 문서</p>
            
            <div className="mt-6 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600 flex items-center gap-1.5"><CheckCircleIcon size={14} className="text-emerald-500"/> 검증 완료(SSoT)</span>
                <span className="font-bold">2</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600 flex items-center gap-1.5"><AlertTriangle size={14} className="text-amber-500"/> 검증 대기</span>
                <span className="font-bold">1</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-indigo-900 to-indigo-800 rounded-2xl shadow-md p-5 text-white">
            <h3 className="font-bold mb-2 flex items-center gap-2"><Lock size={16} className="text-amber-300"/> Two-Track Policy</h3>
            <p className="text-xs text-indigo-200 leading-relaxed">
              식약처, EWG 등 공공 기관의 발급 인증서는 등록 즉시 자동 승인(Auto-Approved)됩니다.<br/><br/>
              단, 자사 위탁 임상시험서나 마케팅 주장은 반드시 <strong className="text-white">People SSoT(전문가)의 교차 검증(Audit)</strong>을 거쳐야만 Answer Card에 사용될 수 있습니다.
            </p>
            <Link href="/brand-admin/dealroom">
              <button className="mt-4 w-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-2 rounded border border-white/20 transition">전문가에게 검증 의뢰하기 →</button>
            </Link>
          </div>
        </div>

        {/* Right: Ledger List */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="font-bold text-slate-800">등록된 문서 목록</h2>
              <div className="relative">
                <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="문서 번호, 이름 검색" className="pl-9 pr-4 py-1.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-indigo-500" />
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {ledgers.map(ledger => (
                <div key={ledger.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition">
                  <div className="flex gap-4 items-center">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${ledger.type === 'clinical' ? 'bg-blue-50 text-blue-600' : ledger.type === 'certification' ? 'bg-emerald-50 text-emerald-600' : 'bg-purple-50 text-purple-600'}`}>
                       <FileBadge2 size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{ledger.id}</span>
                        {ledger.status === 'verified_by_ssot' && <span className="bg-indigo-100 text-indigo-700 text-[10px] px-1.5 py-0.5 rounded font-bold">✓ SSoT Verified</span>}
                        {ledger.status === 'auto_approved' && <span className="bg-emerald-100 text-emerald-700 text-[10px] px-1.5 py-0.5 rounded font-bold">✓ Public Auto Auth</span>}
                        {ledger.status === 'pending' && <span className="bg-amber-100 text-amber-700 text-[10px] px-1.5 py-0.5 rounded font-bold">● Audit Pending</span>}
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm">{ledger.title}</h4>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><FileText size={12}/> {ledger.issuer}</span>
                        <span className="flex items-center gap-1"><Calendar size={12}/> {ledger.date}</span>
                        <span className="text-slate-300">|</span>
                        <span>사용됨: <strong className="text-slate-700">{ledger.attachedDeals}곳</strong></span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button className={`text-xs font-bold py-1.5 px-3 rounded-lg border flex items-center gap-1 transition ${ledger.hasFile ? 'border-slate-200 text-slate-600 hover:bg-slate-100' : 'border-dashed border-slate-300 text-slate-400 hover:text-indigo-600 hover:border-indigo-400'}`}>
                       {ledger.hasFile ? <><ExternalLink size={12} /> View File</> : <><Upload size={12} /> Attach PDF</>}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function CheckCircleIcon({ className, size }: { className?: string, size?: number }) {
  return <CheckCircle size={size} className={className} />;
}
