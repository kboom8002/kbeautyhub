'use client';

import React, { useState } from 'react';
import { Users, PlusCircle, CheckCircle, XCircle, Search, MoreVertical, LogIn, Building2, UserCircle2 } from 'lucide-react';
import CreateTenantModal from './CreateTenantModal';

export default function TenantManagementPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'brands' | 'experts'>('brands');

  const [tenants, setTenants] = useState([
    { id: 'BRAND-GOOD', name: 'Brand Good', admin: 'ops@brandgood.com', plan: 'Enterprise', status: 'Active', coverage: 71 },
    { id: 'BRAND-POPULAR', name: 'K-Beauty Popular', admin: 'admin@popular.co.kr', plan: 'Pro', status: 'Active', coverage: 45 },
    { id: 'BRAND-BAD', name: 'High Risk Cosmetics', admin: 'ceo@risky.com', plan: 'Free', status: 'Suspended', coverage: 0 }
  ]);

  const [experts] = useState([
    { id: 'EXP-LEE', name: 'Dr. Lee', admin: 'dr.lee@seoulclinic.com', plan: 'Revenue Share', status: 'Active', headline: 'Chief Dermatologist, Seoul Clinic', scopes: '민감성, 임산부 적합성', deals: 142 },
    { id: 'EXP-KIM', name: 'Researcher Kim', admin: 'kim@k-labs.com', plan: 'Revenue Share', status: 'Active', headline: 'Lead Scientist, K-Beauty Labs', scopes: '성분 분석, 알러지 프리', deals: 89 }
  ]);

  const handleCreate = (newTenant: any) => {
    setTenants([{ ...newTenant, coverage: 0, status: 'Active' }, ...tenants]);
    setModalOpen(false);
  };

  const activeList = activeTab === 'brands' ? tenants : experts;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      <header className="mb-6 border-b border-slate-800 pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-100 flex items-center gap-3">
            <Users className="text-indigo-500" size={32} />
            Tenant Management
          </h1>
          <p className="text-slate-400 mt-2 text-lg">Central control over B2B brand tenants and People SSoT experts.</p>
        </div>
        
        <button 
          onClick={() => setModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-lg flex items-center space-x-2 transition shadow-lg shadow-indigo-900/20 active:scale-[0.98]"
        >
          <PlusCircle size={18} />
          <span>Onboard New {activeTab === 'brands' ? 'Brand' : 'Expert'}</span>
        </button>
      </header>

      {/* Tabs */}
      <div className="flex space-x-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800 w-max">
        <button 
          onClick={() => setActiveTab('brands')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition \${activeTab === 'brands' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
        >
          <Building2 size={18} /> Corporate Brands
        </button>
        <button 
          onClick={() => setActiveTab('experts')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition \${activeTab === 'experts' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
        >
          <UserCircle2 size={18} /> People SSoT (Experts)
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
          <p className="text-sm font-bold text-slate-500 uppercase">Total {activeTab === 'brands' ? 'Tenants' : 'Experts'}</p>
          <p className="text-3xl font-black text-slate-100 mt-1">{activeList.length}</p>
        </div>
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
          <p className="text-sm font-bold text-slate-500 uppercase">Active</p>
          <p className="text-3xl font-black text-emerald-400 mt-1">{activeList.filter(t => t.status === 'Active').length}</p>
        </div>
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
          <p className="text-sm font-bold text-slate-500 uppercase">Suspended</p>
          <p className="text-3xl font-black text-rose-500 mt-1">{activeList.filter(t => t.status === 'Suspended').length}</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-slate-800 flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder={`Search \${activeTab === 'brands' ? 'brands' : 'experts'}...`}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-200"
            />
          </div>
        </div>

        <table className="w-full text-left text-sm text-slate-400">
          <thead className="bg-slate-800/50 text-slate-300">
            <tr>
              <th className="px-6 py-4 font-semibold">Tenant Info</th>
              <th className="px-6 py-4 font-semibold">{activeTab === 'brands' ? 'Designated Admin' : 'Review Scopes'}</th>
              <th className="px-6 py-4 font-semibold">{activeTab === 'brands' ? 'Plan' : 'Deals & Plan'}</th>
              <th className="px-6 py-4 font-semibold text-center">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {activeList.map(item => (
              <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-100 text-base">{item.name}</div>
                  <div className="font-mono text-xs text-indigo-400 mt-0.5">{item.id}</div>
                  {activeTab === 'experts' && <div className="text-xs text-slate-500 mt-1">{(item as any).headline}</div>}
                </td>
                <td className="px-6 py-4">
                  {activeTab === 'brands' ? (
                    <div className="text-slate-300">{item.admin}</div>
                  ) : (
                    <div className="text-slate-300 font-medium">{(item as any).scopes}</div>
                  )}
                </td>
                <td className="px-6 py-4">
                  {activeTab === 'brands' ? (
                    <span className="bg-slate-800 text-slate-300 font-bold px-2.5 py-1 rounded-md text-xs">{item.plan}</span>
                  ) : (
                    <div>
                      <span className="bg-indigo-500/20 text-indigo-400 font-bold px-2.5 py-1 rounded-md text-xs mr-2">{(item as any).deals} Deals</span>
                      <span className="bg-slate-800 text-slate-300 font-bold px-2.5 py-1 rounded-md text-xs">{item.plan}</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  {item.status === 'Active' ? (
                    <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 font-bold px-2.5 py-1 rounded-full text-xs">
                      <CheckCircle size={14} /> Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 bg-rose-500/10 text-rose-400 font-bold px-2.5 py-1 rounded-full text-xs">
                      <XCircle size={14} /> Suspended
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      title="Impersonate Tenant"
                      onClick={() => {
                        alert(`Impersonating: \${item.id}. Setting local override...`);
                        localStorage.setItem('SIMULATED_TENANT_ID', item.id);
                        localStorage.setItem('SIMULATED_TENANT_NAME', item.name);
                        if (activeTab === 'brands') {
                            window.location.href = '/brand-admin';
                        } else {
                            window.location.href = '/expert-portal';
                        }
                      }}
                      className="text-indigo-400 hover:text-indigo-300 bg-slate-800 hover:bg-slate-700 p-2 rounded-lg transition"
                    >
                      <LogIn size={16} />
                    </button>
                    <button className="text-slate-500 hover:text-slate-300 bg-slate-800 hover:bg-slate-700 p-2 rounded-lg transition">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && <CreateTenantModal onClose={() => setModalOpen(false)} onCreate={handleCreate} />}
    </div>
  );
}
