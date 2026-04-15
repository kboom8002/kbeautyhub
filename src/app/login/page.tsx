'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { KeyRound, ShieldAlert, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorMsg = searchParams.get('error');
  const t = useTranslations('Login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(errorMsg ? `Access Denied: ${errorMsg}` : '');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        if (data.role === 'master' || data.role === 'governance_admin') {
          router.push('/admin');
        } else if (data.role === 'brand_admin') {
          router.push('/brand-admin');
        } else if (data.role === 'expert') {
          router.push('/expert-portal');
        } else {
          router.push('/');
        }
      } else {
        setError(data.error || 'Authentication Failed');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="max-w-md w-full bg-slate-800 rounded-3xl p-8 border border-slate-700 shadow-2xl">
        <div className="flex justify-center mb-8">
          <div className="p-4 bg-indigo-500/20 rounded-full border border-indigo-500/50">
            <KeyRound className="w-8 h-8 text-indigo-400" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center text-white mb-2">{t('title')}</h1>
        <p className="text-slate-400 text-center text-sm mb-8">{t('subtitle')}</p>

        {error && (
          <div className="mb-6 flex items-start gap-3 p-4 bg-red-900/30 border border-red-500/50 rounded-xl text-red-200 text-sm">
            <ShieldAlert className="w-5 h-5 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">{t('identifier')}</label>
            <select 
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            >
              <option value="" disabled>{t('selectPersona')}</option>
              <option value="master@kbeauty.com">master@kbeauty.com (Master Admin)</option>
              <option value="brand@domain.com">brand@domain.com (Brand Admin)</option>
              <option value="expert@clinic.com">expert@clinic.com (Expert Portal)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">{t('password')}</label>
            <input 
              type="password" 
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={password}
              onChange={e => setPassword(e.target.value)}
              readOnly
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-xl font-medium transition-colors disabled:opacity-50"
          >
            {loading ? t('authenticating') : t('authenticate')}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
}
