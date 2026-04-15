'use client';

import React, { useState } from 'react';
import { Database, Filter, Layers, AlertCircle } from 'lucide-react';

export default function CapitalBoardClient({ initialData, scenes = [] }: { initialData: any[], scenes?: any[] }) {
  const [filterFamily, setFilterFamily] = useState<string>("ALL");

  const isDeadEnd = (cqId: string) => {
    const cqScenes = scenes.filter(s => s.canonical_question_id === cqId);
    if (cqScenes.length === 0) return true; // No mapped scenes means no exit
    
    // An exit is defined as having at least one scene that resolves to an Action, Proof, or Boundary
    const hasExit = cqScenes.some(s => {
      const objs = s.required_objects || [];
      return objs.includes('ActionObject') || objs.includes('ProofObject') || objs.includes('BoundaryObject');
    });
    
    return !hasExit;
  };

  const families = ["ALL", "QC-01", "QC-02", "QC-03", "QC-04", "QC-05", "QC-06", "QC-07", "QC-08", "QC-09", "QC-10"];
  
  const filteredData = filterFamily === "ALL" 
    ? initialData 
    : initialData.filter(cq => cq.family_code === filterFamily);

  const getLayerData = (layer: string) => filteredData.filter(cq => (cq.layer || 'A') === layer);

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
        <Filter className="text-slate-500" size={20} />
        <span className="text-sm font-bold text-slate-300">Family Filter:</span>
        <div className="flex gap-2 flex-wrap">
          {families.map(fam => (
            <button
              key={fam}
              onClick={() => setFilterFamily(fam)}
              className={`px-3 py-1 text-xs font-bold rounded-full transition ${
                filterFamily === fam 
                  ? 'bg-indigo-500 text-white' 
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {fam}
            </button>
          ))}
        </div>
      </div>

      {/* Layers */}
      <div className="space-y-10">
        
        {['A', 'B', 'C'].map(layer => {
          const layerItem = getLayerData(layer);
          let layerName = "Unknown";
          if (layer === 'A') layerName = "Common Question Capital";
          if (layer === 'B') layerName = "Niche Question Capital";
          if (layer === 'C') layerName = "Brand-specific Question Capital";

          return (
            <section key={layer} className="space-y-4">
              <div className="flex items-center gap-2 text-indigo-400 mb-2">
                <Layers size={20} />
                <h2 className="text-xl font-black">Layer {layer}. {layerName}</h2>
                <span className="text-sm border border-slate-700 bg-slate-900 text-slate-400 px-2 py-0.5 rounded-full ml-2">
                  {layerItem.length} items
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {layerItem.map(cq => (
                  <div key={cq.canonical_question_id} className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition rounded-xl p-5 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
                    
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-mono text-xs text-slate-500 font-bold">{cq.canonical_question_id}</span>
                      <div className="flex gap-2">
                        {isDeadEnd(cq.canonical_question_id) && (
                          <span className="flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                            <AlertCircle size={10} /> Dead-End
                          </span>
                        )}
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          cq.risk_level === 'high' ? 'bg-red-500/20 text-red-400' :
                          cq.risk_level === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {cq.risk_level || 'low'} risk
                        </span>
                      </div>
                    </div>

                    <h3 className="text-slate-100 font-bold text-[15px] mb-2 leading-tight">{cq.title}</h3>
                    
                    <div className="flex justify-between items-center pt-3 mt-3 border-t border-slate-800/50">
                      <p className="text-xs text-slate-400">
                        Family: <span className="text-slate-300 font-bold">{cq.family_code}</span>
                      </p>
                      <p className="text-xs text-indigo-400 font-bold flex items-center gap-1">
                        {cq.primary_object_type} 
                        <span className="text-[10px] text-slate-600 bg-slate-950 px-1.5 py-0.5 rounded">
                          {scenes.filter(s => s.canonical_question_id === cq.canonical_question_id).length} scenes
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
                {layerItem.length === 0 && (
                  <div className="col-span-full py-8 text-center text-slate-600 bg-slate-900/50 rounded-xl border border-dashed border-slate-800">
                    No canonical questions found in this layer.
                  </div>
                )}
              </div>
            </section>
          );
        })}

      </div>
    </div>
  );
}
