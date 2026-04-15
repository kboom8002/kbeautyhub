'use client';

import React, { useState } from 'react';
import { Send, Building, ShieldCheck, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function TenantApplicationPage() {
  const t = useTranslations('Apply');
  const [formData, setFormData] = useState({
    applicant_type: 'expert',
    applicant_name: '',
    email: '',
    company_or_clinic: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/v1/auth/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setSubmitted(true);
      } else {
        setError(data.error || 'Failed to submit application.');
      }
    } catch (err) {
      setError('A network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="max-w-lg w-full bg-white rounded-3xl p-10 border border-slate-200 shadow-xl text-center space-y-6">
          <div className="flex justify-center">
            <CheckCircle2 className="w-16 h-16 text-emerald-500" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900">{t('receivedTitle')}</h2>
          <p className="text-slate-500 text-lg">{t('receivedDesc')}</p>
          <div className="pt-6 border-t border-slate-100">
            <Link href="/" className="text-indigo-600 hover:text-indigo-700 font-medium">
              {t('returnHome')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="max-w-xl w-full bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-3">{t('title')}</h1>
          <p className="text-slate-500">{t('subtitle')}</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setFormData({...formData, applicant_type: 'expert'})}
              className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${
                formData.applicant_type === 'expert' 
                  ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700' 
                  : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <ShieldCheck className="w-8 h-8" />
              <span className="font-semibold text-sm">{t('expert')}</span>
            </button>
            <button
              type="button"
              onClick={() => setFormData({...formData, applicant_type: 'brand'})}
              className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${
                formData.applicant_type === 'brand' 
                  ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700' 
                  : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <Building className="w-8 h-8" />
              <span className="font-semibold text-sm">{t('brand')}</span>
            </button>
          </div>

          <div className="space-y-4 pt-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {formData.applicant_type === 'expert' ? t('expertNameLabel') : t('brandNameLabel')}
              </label>
              <input
                required
                type="text"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
                value={formData.applicant_name}
                onChange={e => setFormData({...formData, applicant_name: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t('emailLabel')}
              </label>
              <input
                required
                type="email"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {formData.applicant_type === 'expert' ? t('expertOrgLabel') : t('brandOrgLabel')}
              </label>
              <input
                required
                type="text"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
                value={formData.company_or_clinic}
                onChange={e => setFormData({...formData, company_or_clinic: e.target.value})}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white p-4 rounded-xl font-medium transition-colors disabled:opacity-50 mt-8"
          >
            {loading ? t('submitting') : t('submit')}
            {!loading && <Send className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
}
