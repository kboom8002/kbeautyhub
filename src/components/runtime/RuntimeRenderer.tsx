import React from 'react';
import HeroBlock from './HeroBlock';
import SplitPanel from './SplitPanel';
import TrustBlock from './TrustBlock';
import ActionSplit from './ActionSplit';
import { ShieldX } from 'lucide-react';

export default function RuntimeRenderer({ payload }: { payload: any }) {
  
  if (!payload || payload.variant === 'blocked') {
    // Render the Blocked Fallback!
    const blockReason = payload?.slots?.[0]?.data?.limitations?.[0] || 'Content temporarily unavailable due to safety policies.';
    
    return (
      <div className="w-full max-w-2xl mx-auto mt-12 bg-rose-50 border-2 border-rose-200 rounded-3xl p-10 flex flex-col items-center text-center">
        <div className="bg-white p-4 rounded-full shadow-sm mb-6">
          <ShieldX size={48} className="text-rose-500" />
        </div>
        <h2 className="text-2xl font-black text-rose-900 mb-4 tracking-tight">Access Restricted</h2>
        <p className="text-lg text-rose-700/80 mb-8 max-w-md">
          {blockReason}
        </p>
        <button className="bg-rose-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-rose-700 transition">
          Return to Safe Browsing
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 pb-20">
      {payload.slots.map((slot: any, idx: number) => {
        switch (slot.slot_type) {
          case 'hero':
            return <HeroBlock key={idx} data={slot.data} />;
          case 'split-panel':
            return <SplitPanel key={idx} data={slot.data} />;
          case 'block':
            return <TrustBlock key={idx} data={slot.data} />;
          case 'action-split':
            return <ActionSplit key={idx} data={slot.data} renderVariant={slot.render_variant} />;
          default:
            return (
              <div key={idx} className="p-4 border border-dashed border-slate-300 rounded-xl bg-slate-50 text-slate-400 text-center text-sm">
                Unknown Slot Type: {slot.slot_type}
              </div>
            );
        }
      })}
    </div>
  );
}
