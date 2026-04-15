'use client';
import React, { useState } from 'react';
import RollbackControl from './RollbackControl';
import { ShieldCheck, Crosshair, AlertTriangle, CheckCircle, Package } from 'lucide-react';

export default function AdminDashboardPage() {
  const [bundleApproved, setBundleApproved] = useState(0);

  // Mocked state since we removed Prisma for visual stability
  const brands = [
    { brand_id: 'BRAND-GOOD', name: 'Brand Good', readiness_score: 95 },
    { brand_id: 'BRAND-POPULAR', name: 'K-Beauty Popular', readiness_score: 88 },
    { brand_id: 'BRAND-TRENDING', name: 'Trending Derma', readiness_score: 91 },
    { brand_id: 'BRAND-BAD', name: 'High Risk Cosmetics', readiness_score: 30 }
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <header className="mb-10 border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-black text-slate-100 flex items-center gap-3">
          <ShieldCheck className="text-indigo-500" size={32} />
          Governance Dashboard
        </h1>
        <p className="text-slate-400 mt-2 text-lg">Central hub for K-Beauty compliance and launch safety.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex items-center space-x-2 mb-4 text-rose-400">
              <Crosshair size={20} />
              <h2 className="text-xl font-bold">Launch Control (Kill Switches)</h2>
            </div>
            
            <div className="space-y-4">
              {brands.map(brand => (
                <RollbackControl key={brand.brand_id} brandId={brand.brand_id} />
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center space-x-2 mb-4 text-amber-400 mt-10">
              <AlertTriangle size={20} />
              <h2 className="text-xl font-bold">Multi-Party Audit (Reviews Queue)</h2>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-0 overflow-hidden">
              <table className="w-full text-left text-sm text-slate-400">
                <thead className="bg-slate-800/50 text-slate-300">
                  <tr>
                    <th className="px-6 py-4 font-semibold w-1/4">Entity ID</th>
                    <th className="px-6 py-4 font-semibold w-1/3">Target QIS Bundle</th>
                    <th className="px-6 py-4 font-semibold text-center">People SSoT Signatures</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  
                  {/* The Bundle from BRAND-GOOD */}
                  <tr className={`transition-colors ${bundleApproved === 3 ? 'bg-emerald-900/10' : 'hover:bg-slate-800/30'}`}>
                    <td className="px-6 py-4 align-top">
                      <div className="font-mono text-slate-200 text-base font-bold">OBJ-BNDL-PREG</div>
                      <div className="text-xs text-indigo-400 font-bold mt-1">BRAND-GOOD</div>
                      <span className="inline-block mt-2 text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-bold border border-slate-700">
                        Ans / Prf / Act Included
                      </span>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="text-slate-300 font-medium">CQ-FIT-PREGNANCY-AI</div>
                      <div className="text-xs mt-1 text-slate-500 max-w-[250px]">Is this safe to use during pregnancy?</div>
                    </td>
                    <td className="px-6 py-4">
                      
                      <div className="space-y-3">
                        {/* 1. Evidence Owner */}
                        <div className="flex items-center justify-between bg-slate-950 p-2 rounded-lg border border-slate-800">
                          <div className="flex flex-col">
                            <span className="text-[10px] text-slate-500 font-bold uppercase">Evidence Owner</span>
                            <span className={`text-xs font-bold ${bundleApproved >= 1 ? 'text-emerald-400' : 'text-slate-300'}`}>
                              {bundleApproved >= 1 ? 'Proof Verified' : 'Awaiting Proof Check'}
                            </span>
                          </div>
                          {bundleApproved === 0 ? (
                            <button onClick={() => setBundleApproved(1)} className="text-[10px] bg-amber-500 text-slate-900 font-bold px-3 py-1 rounded">Simulate Check</button>
                          ) : (
                            <CheckCircle size={16} className="text-emerald-500" />
                          )}
                        </div>

                        {/* 2. Domain Reviewer */}
                        <div className={`flex items-center justify-between bg-slate-950 p-2 rounded-lg border ${bundleApproved >= 1 ? 'border-indigo-500/30' : 'border-slate-800 opacity-50'}`}>
                          <div className="flex flex-col">
                            <span className="text-[10px] text-slate-500 font-bold uppercase">Domain Reviewer</span>
                            <span className={`text-xs font-bold ${bundleApproved >= 2 ? 'text-emerald-400' : 'text-slate-300'}`}>
                              {bundleApproved >= 2 ? 'Medical Integrity Clear' : 'Pending Expert Review'}
                            </span>
                          </div>
                          {bundleApproved === 1 ? (
                            <button onClick={() => setBundleApproved(2)} className="text-[10px] bg-indigo-500 text-white font-bold px-3 py-1 rounded">Simulate MD Review</button>
                          ) : bundleApproved >= 2 ? (
                            <CheckCircle size={16} className="text-emerald-500" />
                          ) : (
                            <div className="w-16"></div>
                          )}
                        </div>

                        {/* 3. Approval Owner */}
                        <div className={`flex items-center justify-between bg-slate-950 p-2 rounded-lg border ${bundleApproved >= 2 ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-slate-800 opacity-50'}`}>
                          <div className="flex flex-col">
                            <span className="text-[10px] text-slate-500 font-bold uppercase">Approval Owner (Platform)</span>
                            <span className={`text-xs font-bold ${bundleApproved === 3 ? 'text-emerald-400' : 'text-slate-300'}`}>
                              {bundleApproved === 3 ? 'Published (Live SSoT)' : 'Final Sign-off Pending'}
                            </span>
                          </div>
                          {bundleApproved === 2 ? (
                            <button onClick={() => setBundleApproved(3)} className="text-[10px] bg-emerald-500 text-white font-bold px-3 py-1 rounded flex gap-1 items-center">
                              <Package size={12} /> Publish
                            </button>
                          ) : bundleApproved === 3 ? (
                            <CheckCircle size={16} className="text-emerald-500" />
                          ) : (
                            <div className="w-16"></div>
                          )}
                        </div>
                      </div>

                    </td>
                  </tr>

                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Sidebar Status */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
            <h3 className="text-slate-200 font-bold mb-4">System Health</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">Release Gate Integrity</span>
                  <span className="text-emerald-400 font-bold">100%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5"><div className="bg-emerald-500 h-1.5 rounded-full w-full"></div></div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">Platform QIS Coverage</span>
                  <span className={bundleApproved === 3 ? "text-emerald-400 font-bold delay-300 transition-colors" : "text-amber-400 font-bold"}>
                    {bundleApproved === 3 ? "71%" : "68%"}
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5">
                  <div className={`h-1.5 rounded-full transition-all duration-1000 ${bundleApproved === 3 ? "bg-emerald-500 w-[71%]" : "bg-amber-500 w-[68%]"}`}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
