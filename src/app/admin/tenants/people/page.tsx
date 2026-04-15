'use client';

import React, { useState, useEffect } from 'react';
import { Users, Plus, Shield, Search, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

type Person = {
  person_id: string;
  display_name: string;
  person_type: string;
  headline_role: string | null;
  organization: string | null;
  active_status: string;
  visibility_status: string;
  created_at: string;
};

export default function PeopleSSoTManager() {
  const t = useTranslations('AdminPeople');
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    display_name: '',
    person_type: 'domain_reviewer',
    headline_role: '',
    organization: '',
    active_status: 'active',
    visibility_status: 'private_internal',
  });

  const fetchPeople = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/trust/people');
      const json = await res.json();
      if (json.success) setPeople(json.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeople();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/v1/trust/people', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsFormOpen(false);
        setFormData({
          display_name: '', person_type: 'domain_reviewer', headline_role: '',
          organization: '', active_status: 'active', visibility_status: 'private_internal'
        });
        fetchPeople();
      } else {
        alert("Failed to create. Check inputs.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <Users className="w-8 h-8 text-indigo-600" />
              {t('title')}
            </h1>
            <p className="text-slate-500 mt-2">{t('subtitle')}</p>
          </div>
          <button 
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            <Plus className="w-4 h-4" />
            <span className="font-medium">{t('addNew')}</span>
          </button>
        </div>

        {isFormOpen && (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 animate-in fade-in slide-in-from-top-4">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">{t('formTitle')}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t('formName')}</label>
                <input required type="text" className="w-full border p-2 rounded" value={formData.display_name} onChange={e => setFormData({...formData, display_name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('formType')}</label>
                <select className="w-full border p-2 rounded" value={formData.person_type} onChange={e => setFormData({...formData, person_type: e.target.value})}>
                  <option value="domain_reviewer">Domain Reviewer</option>
                  <option value="external_expert">External Expert</option>
                  <option value="brand_representative">Brand Representative</option>
                  <option value="evidence_owner">Evidence Owner</option>
                  <option value="governance_admin">Governance Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('formOrg')}</label>
                <input type="text" className="w-full border p-2 rounded" value={formData.organization} onChange={e => setFormData({...formData, organization: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('formHeadline')}</label>
                <input type="text" className="w-full border p-2 rounded" value={formData.headline_role} onChange={e => setFormData({...formData, headline_role: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('formVisibility')}</label>
                <select className="w-full border p-2 rounded" value={formData.visibility_status} onChange={e => setFormData({...formData, visibility_status: e.target.value})}>
                  <option value="private_internal">Private / Internal</option>
                  <option value="public_summary">Public Summary</option>
                  <option value="public_profile">Full Public Profile</option>
                  <option value="hidden">Hidden</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <button type="submit" className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800">
                {t('submitBtn')}
              </button>
            </div>
          </form>
        )}

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-100/80 border-b border-slate-200 text-slate-600 text-sm">
              <tr>
                <th className="p-4 font-medium">{t('colInfo')}</th>
                <th className="p-4 font-medium">{t('colType')}</th>
                <th className="p-4 font-medium">{t('colVisibility')}</th>
                <th className="p-4 font-medium">{t('colStatus')}</th>
                <th className="p-4 font-medium">{t('colDate')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    {t('loading')}
                  </td>
                </tr>
              ) : people.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">{t('empty')}</td>
                </tr>
              ) : (
                people.map(p => (
                  <tr key={p.person_id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-slate-900">{p.display_name}</div>
                      <div className="text-sm text-slate-500">{p.headline_role} {p.organization ? `@ ${p.organization}` : ''}</div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                        {p.person_type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-slate-600 capitalize">{p.visibility_status.replace('_', ' ')}</span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex w-2 h-2 rounded-full ${p.active_status === 'active' ? 'bg-emerald-500' : 'bg-red-500'} mr-2`} />
                      <span className="text-sm capitalize">{p.active_status}</span>
                    </td>
                    <td className="p-4 text-sm text-slate-500">
                      {new Date(p.created_at).toLocaleDateString()}
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
