'use client';

import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle2, XCircle, Clock, Building, User, LayoutDashboard, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

type Application = {
  application_id: string;
  applicant_type: 'brand' | 'expert';
  applicant_name: string;
  email: string;
  company_or_clinic: string | null;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
};

export default function ApplicationDashboard() {
  const t = useTranslations('AdminApplications');
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApps = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/admin/applications');
      const json = await res.json();
      if (json.success) setApps(json.data);
    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const handleAction = async (id: string, status: 'approved' | 'rejected') => {
    if (!confirm(`Are you sure you want to ${status} this application?`)) return;

    try {
      const res = await fetch('/api/v1/admin/applications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ application_id: id, status })
      });
      if (res.ok) fetchApps();
      else alert("Failed to process application.");
    } catch(err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{t('title')}</h1>
            <p className="text-slate-500">{t('subtitle')}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-100/50 border-b border-slate-200 text-slate-600 text-sm">
              <tr>
                <th className="p-5 font-medium">{t('colInfo')}</th>
                <th className="p-5 font-medium">{t('colType')}</th>
                <th className="p-5 font-medium">{t('colOrg')}</th>
                <th className="p-5 font-medium">{t('colDate')}</th>
                <th className="p-5 font-medium">{t('colStatus')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                    {t('syncing')}
                  </td>
                </tr>
              ) : apps.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-500">{t('empty')}</td>
                </tr>
              ) : (
                apps.map(app => (
                  <tr key={app.application_id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-5">
                      <div className="font-semibold text-slate-900">{app.applicant_name}</div>
                      <div className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                        <Mail className="w-3 h-3" /> {app.email}
                      </div>
                    </td>
                    <td className="p-5">
                      {app.applicant_type === 'brand' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                          <Building className="w-3.5 h-3.5" /> {t('typeBrand')}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                          <User className="w-3.5 h-3.5" /> {t('typeExpert')}
                        </span>
                      )}
                    </td>
                    <td className="p-5 text-sm text-slate-700">
                      {app.company_or_clinic || '—'}
                    </td>
                    <td className="p-5 text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(app.submitted_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-5">
                      {app.status === 'pending' ? (
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleAction(app.application_id, 'approved')}
                            className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleAction(app.application_id, 'rejected')}
                            className="p-2 text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      ) : app.status === 'approved' ? (
                        <span className="text-emerald-700 font-medium text-sm flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> {t('approved')}
                        </span>
                      ) : (
                        <span className="text-rose-700 font-medium text-sm flex items-center gap-1">
                          <XCircle className="w-4 h-4" /> {t('rejected')}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
