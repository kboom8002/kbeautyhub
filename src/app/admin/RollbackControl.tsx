'use client';

import React, { useState } from 'react';
import { AlertOctagon, RefreshCcw } from 'lucide-react';

export default function RollbackControl({ brandId }: { brandId: string }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);

  const handleRollback = async () => {
    setLoading(true);

    try {
      // 1. Get Mock Admin Token
      const tokenRes = await fetch('/api/v1/auth/mock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          admin_id: 'SYS-ADMIN-01',
          role: 'governance_admin',
          tenant_id: 'SYSTEM'
        })
      });
      const { access_token } = await tokenRes.json();

      // 2. Trigger Rollback API
      const res = await fetch('/api/v1/launch/rollback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`
        },
        body: JSON.stringify({
          brand_id: brandId,
          reason: 'Emergency Safety Protocol Enforced via Admin Console',
          admin_id: 'SYS-ADMIN-01'
        })
      });

      if (!res.ok) throw new Error('Rollback Failed');
      
      setSuccess(true);
      setTimeout(() => setSuccess(null), 5000);

    } catch (error) {
      alert("Error: " + error);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center justify-between">
      <div>
        <h4 className="text-slate-200 font-bold mb-1 flex items-center gap-2">
          {brandId} <span className="px-2 py-0.5 rounded text-[10px] bg-red-500/20 text-red-400 border border-red-500/30">HIGH RISK</span>
        </h4>
        <p className="text-slate-500 text-sm">Action disabled? Requires consult verification.</p>
      </div>

      <button 
        onClick={handleRollback}
        disabled={loading || success === true}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-bold transition-all ${
          success 
          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
          : 'bg-red-600/20 text-red-500 border border-red-600/50 hover:bg-red-600/30 active:scale-95'
        }`}
      >
        {loading ? <RefreshCcw size={16} className="animate-spin" /> : <AlertOctagon size={16} />}
        <span>{success ? 'ENFORCED' : 'ENFORCE ROLLBACK'}</span>
      </button>
    </div>
  );
}
