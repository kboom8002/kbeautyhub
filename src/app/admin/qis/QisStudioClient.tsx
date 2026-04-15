'use client';

import React, { useState } from 'react';
import { Inbox, Sparkles, Check, Database, CheckSquare, PlusCircle, BrainCircuit } from 'lucide-react';
import { runGeminiClusteringAction, createCanonicalQuestionAction } from '@/app/actions/qis-actions';
import { markRawQuestionsAsClustered } from '@/app/actions/inbox-actions';

import ScenesMatrixView from './ScenesMatrixView';

export default function QisStudioClient({ rawInbox, initialCanonicals }: { rawInbox: any[], initialCanonicals: any[] }) {
  const [loading, setLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any[] | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [approvedCanonicals, setApprovedCanonicals] = useState<any[]>(initialCanonicals);
  const [activeTab, setActiveTab] = useState<'taxonomy' | 'scenes'>('taxonomy');
  const [selectedRawIds, setSelectedRawIds] = useState<string[]>([]);

  const handleToggleRawId = (id: string) => {
    setSelectedRawIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleRunAI = async () => {
    setLoading(true);
    setErrorMsg("");
    
    const selectedItems = rawInbox.filter(r => selectedRawIds.includes(r.id));
    if (selectedItems.length === 0) {
      setErrorMsg("Please select at least one raw question.");
      setLoading(false);
      return;
    }

    const result = await runGeminiClusteringAction(selectedItems);
    if (result.success) {
      setAiSuggestions(result.data);
    } else {
      setErrorMsg(result.error || "AI Clustering Failed. Did you set GEMINI_API_KEY?");
    }
    setLoading(false);
  };

  const handleApprove = async (suggestion: any) => {
    // 1. Prepare data for DB
    const newCq = {
      canonical_question_id: suggestion.proposed_id,
      vertical_id: "skincare", 
      family_code: "QC-01", // Default mapped for AI for now
      title: suggestion.canonical_intent,
      signature: `${suggestion.proposed_id}_${Date.now()}`,
      primary_object_type: "AnswerObject",
      layer: "A",
      risk_level: "low",
      status: "ACTIVE"
    };

    // 2. Call server action
    const res = await createCanonicalQuestionAction(newCq);
    
    if (res.success) {
      // Treat the AI suggestion as approved and add to the taxonomy board
      setApprovedCanonicals(prev => [...prev, {
        cq_id: suggestion.proposed_id,
        canonical_intent: suggestion.canonical_intent,
        category: "QC-01",
        status: 'Active',
        coverage_percent: 0, 
        assigned_brands: 0
      }]);

      // Remove from suggestions array visually
      setAiSuggestions(prev => prev ? prev.filter(s => s.proposed_id !== suggestion.proposed_id) : null);

      // Mutate DB to mark the selected raw items as clustered (so they leave the Inbox)
      // Since Gemini currently clusters ALL selected, we mark all selected items as clustered.
      await markRawQuestionsAsClustered(selectedRawIds);
      
      // Clear the local selection and we would normally refetch the list, 
      // but for UX trick, we just hide them or let the user refresh.
      setSelectedRawIds([]);
      // Force refresh of the page to pull fresh Inbox
      window.location.reload();

    } else {
      setErrorMsg(`Failed to save CQ: ${res.error}`);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Tab Navigation */}
      <div className="flex border-b border-slate-800 space-x-8 mb-6">
        <button 
          onClick={() => setActiveTab('taxonomy')}
          className={`py-3 font-bold text-sm transition-colors border-b-2 ${activeTab === 'taxonomy' ? 'border-pink-500 text-pink-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
        >
          1. Taxonomy Board (CQ Hub)
        </button>
        <button 
          onClick={() => setActiveTab('scenes')}
          className={`py-3 font-bold text-sm transition-colors border-b-2 ${activeTab === 'scenes' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
        >
          2. Scenes & Object Matrix
        </button>
      </div>

      {activeTab === 'taxonomy' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      {/* Left Column: AI HITL Workbench */}
      <section className="space-y-6">
        <div className="flex items-center space-x-2 text-slate-300 border-b border-slate-800 pb-2">
          <BrainCircuit size={20} className="text-pink-400" />
          <h2 className="text-lg font-bold">AI Taxonomy HITL Workbench</h2>
        </div>
        
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
          <p className="text-sm text-slate-500 mb-4">You have {rawInbox.length} raw questions in the inbox.</p>
          
          <div className="max-h-64 overflow-y-auto space-y-2 mb-4 scrollbar-thin scrollbar-thumb-slate-700">
            {rawInbox.map(raw => (
              <label key={raw.id} className="flex items-start space-x-3 bg-slate-800 p-3 rounded-lg cursor-pointer hover:bg-slate-700/80 transition border border-slate-700">
                <input 
                  type="checkbox" 
                  className="mt-1 w-4 h-4 rounded border-slate-600 bg-slate-900 text-pink-500 focus:ring-pink-500 focus:ring-offset-slate-900"
                  checked={selectedRawIds.includes(raw.id)}
                  onChange={() => handleToggleRawId(raw.id)}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-200">{raw.text}</p>
                  <p className="text-xs text-slate-500 mt-1 flex justify-between">
                    <span>{raw.source}</span>
                    <span className="bg-slate-900 px-2 py-0.5 rounded text-slate-400 border border-slate-800">{raw.count} occurrences</span>
                  </p>
                </div>
              </label>
            ))}
          </div>

          <button 
            onClick={handleRunAI} 
            disabled={loading || selectedRawIds.length === 0}
            className="w-full bg-slate-100 hover:bg-white text-slate-900 font-bold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50 transition"
          >
            <Sparkles size={18} className={loading ? "animate-spin" : ""} />
            <span>{loading ? "Gemini is Analyzing the Inbox..." : "Run AI Clustering on Selected"}</span>
          </button>

          {errorMsg && (
            <div className="p-3 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-sm">
              {errorMsg}
            </div>
          )}

          {aiSuggestions && (
            <div className="mt-6 space-y-4">
              <h3 className="text-slate-300 font-bold flex items-center gap-2">
                <Check className="text-emerald-500" size={16} /> 
                AI Proposed Canonical Intents
              </h3>
              
              {aiSuggestions.length === 0 && <p className="text-slate-500 text-sm">No clusters found.</p>}

              {aiSuggestions.map((s, idx) => (
                <div key={idx} className="bg-slate-800 p-4 rounded-xl border border-pink-500/30 shadow-lg shadow-pink-900/10">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs text-pink-400 font-mono font-bold">{s.proposed_id}</span>
                    <span className="text-[10px] uppercase font-bold bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded">
                      {s.matched_raw_count} RAW MATCHES
                    </span>
                  </div>
                  
                  <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 font-bold mb-2 focus:ring-2 focus:ring-pink-500 outline-none" defaultValue={s.canonical_intent} />
                  
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-sm text-slate-400">{s.category}</span>
                    <button 
                      onClick={() => handleApprove(s)}
                      className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold text-xs px-3 py-1.5 rounded-lg transition"
                    >
                      Approve & Propagate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Right Column: Canonical Manager (Taxonomy Board) */}
      <section className="space-y-6">
        <div className="flex items-center space-x-2 text-slate-300 border-b border-slate-800 pb-2">
          <Database size={20} className="text-emerald-400" />
          <h2 className="text-lg font-bold">Taxonomy Board (Canonical)</h2>
        </div>

        <div className="space-y-4">
          {approvedCanonicals.map(cq => (
            <div key={cq.cq_id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
              
              <div className="flex justify-between items-start mb-2">
                <span className="font-mono text-xs text-slate-500 font-bold">{cq.cq_id}</span>
                <div className={`flex items-center space-x-1 bg-slate-800 px-2 py-0.5 rounded text-xs ${cq.coverage_percent === 0 ? 'text-amber-500' : 'text-slate-400'}`}>
                  <CheckSquare size={12} className={cq.coverage_percent === 0 ? 'text-amber-500' : 'text-emerald-500'} />
                  <span>Coverage: {cq.coverage_percent}%</span>
                </div>
              </div>

              <h3 className="text-slate-100 font-bold text-lg mb-1">{cq.canonical_intent}</h3>
              <p className="text-slate-400 text-sm mb-4">Category: <span className="text-indigo-400">{cq.category}</span></p>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-500">{cq.assigned_brands} Brands assigned to this QIS.</span>
                <button className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Propagated (Empty Slots created) →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  ) : (
    <ScenesMatrixView canonicals={approvedCanonicals} />
  )}
</div>
  );
}
