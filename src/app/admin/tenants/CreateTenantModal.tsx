'use client';
import React, { useState } from 'react';
import { X, Server, Building, Mail } from 'lucide-react';

export default function CreateTenantModal({ onClose, onCreate }: { onClose: () => void, onCreate: (data: any) => void }) {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    admin: '',
    plan: 'Enterprise'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id || !formData.name || !formData.admin) return;
    onCreate(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Server className="text-indigo-500" />
            Provision New Tenant
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Tenant ID (Unique K-Beauty Namespace)</label>
            <div className="relative">
              <Building className="absolute left-3 top-3 text-slate-600" size={18} />
              <input 
                type="text" 
                required
                placeholder="e.g. BRAND-DERMA"
                value={formData.id}
                onChange={e => setFormData({ ...formData, id: e.target.value.toUpperCase().replace(/\s/g, '-') })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-indigo-500 text-slate-100 uppercase" 
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">This will be used as the database partition key.</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Brand Display Name</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Derma Clinical"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 text-slate-100" 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Designated Admin Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-600" size={18} />
              <input 
                type="email" 
                required
                placeholder="manager@brandname.com"
                value={formData.admin}
                onChange={e => setFormData({ ...formData, admin: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-indigo-500 text-slate-100" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Subscription Plan</label>
            <select
              value={formData.plan}
              onChange={e => setFormData({ ...formData, plan: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 text-slate-100"
            >
              <option>Free Sandbox</option>
              <option>Pro</option>
              <option>Enterprise</option>
            </select>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
            <button 
              type="button" 
              onClick={onClose}
              className="px-5 py-2.5 text-slate-300 hover:text-white font-bold transition"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-2.5 rounded-lg shadow-lg shadow-indigo-900/20 transition active:scale-95"
            >
              Initialize Tenant
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
