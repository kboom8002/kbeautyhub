'use client';

import React, { useState } from 'react';
import { Sparkles, Check, BrainCircuit } from 'lucide-react';
import { runGeminiClusteringAction, createCanonicalQuestionAction } from '@/app/actions/qis-actions';
import { markRawQuestionsAsClustered } from '@/app/actions/inbox-actions';
import { useRouter } from 'next/navigation';

export default function WorkbenchClient({ rawInbox }: { rawInbox: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any[] | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedRawIds, setSelectedRawIds] = useState<string[]>([]);
  const [successMsg, setSuccessMsg] = useState("");
  
  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<any>(null);
  const [familyCode, setFamilyCode] = useState("QC-01");
  const [layer, setLayer] = useState("A");
  const [primaryObject, setPrimaryObject] = useState("AnswerObject");
  const [riskLevel, setRiskLevel] = useState("low");

  const openModal = (s: any) => {
    setSelectedSuggestion(s);
    // Try to map AI category guess to Family Code if possible, else default QC-01
    setFamilyCode("QC-01"); 
    setLayer("A");
    setPrimaryObject("AnswerObject");
    setRiskLevel("low");
    setModalOpen(true);
  };

  const handleToggleRawId = (id: string) => {
    setSelectedRawIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleRunAI = async () => {
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    
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
      setErrorMsg(result.error || "AI Clustering Failed.");
    }
    setLoading(false);
  };

  const handleApprove = async () => {
    if (!selectedSuggestion) return;
    setLoading(true);
    
    // Safety check for QC-08
    if (familyCode === "QC-08" && primaryObject !== "BoundaryObject") {
      setErrorMsg("QC-08 (Boundary/Safety) Family must have BoundaryObject as Primary.");
      setLoading(false);
      return;
    }

    const newCq = {
      canonical_question_id: selectedSuggestion.proposed_id,
      vertical_id: "skincare", 
      family_code: familyCode, 
      title: selectedSuggestion.canonical_intent,
      signature: `${selectedSuggestion.proposed_id}_${Date.now()}`,
      primary_object_type: primaryObject,
      layer: layer,
      risk_level: riskLevel,
      status: "ACTIVE"
    };

    const res = await createCanonicalQuestionAction(newCq);
    
    if (res.success) {
      setAiSuggestions(prev => prev ? prev.filter(s => s.proposed_id !== selectedSuggestion.proposed_id) : null);
      await markRawQuestionsAsClustered(selectedRawIds);
      setSelectedRawIds([]);
      setSuccessMsg(`Approved and Propagated CQ: ${selectedSuggestion.proposed_id}`);
      setModalOpen(false);
      router.refresh(); 
    } else {
      setErrorMsg(`Failed to save CQ: ${res.error}`);
    }
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column: AI HITL Workbench */}
      <section className="space-y-6">
        <div className="flex items-center space-x-2 text-slate-300 border-b border-slate-800 pb-2">
          <BrainCircuit size={20} className="text-pink-400" />
          <h2 className="text-lg font-bold">Inbox to Canonical Clustering</h2>
        </div>
        
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
          <p className="text-sm text-slate-500 mb-4">Select raw questions to send to Gemini for clustering and CQ extraction.</p>
          
          <div className="max-h-96 overflow-y-auto space-y-2 mb-4 scrollbar-thin scrollbar-thumb-slate-700">
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
            {rawInbox.length === 0 && <p className="text-slate-500">Inbox is empty.</p>}
          </div>

          <button 
            onClick={handleRunAI} 
            disabled={loading || selectedRawIds.length === 0}
            className="w-full bg-slate-100 hover:bg-white text-slate-900 font-bold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50 transition"
          >
            <Sparkles size={18} className={loading ? "animate-spin" : ""} />
            <span>{loading ? "Processing..." : "Run AI Clustering on Selected"}</span>
          </button>
          
          {errorMsg && <div className="p-3 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-sm">{errorMsg}</div>}
          {successMsg && <div className="p-3 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-sm">{successMsg}</div>}
        </div>
      </section>

      {/* Right Column: AI Proposals */}
      <section className="space-y-6">
        <div className="flex items-center space-x-2 text-slate-300 border-b border-slate-800 pb-2">
          <Sparkles size={20} className="text-indigo-400" />
          <h2 className="text-lg font-bold">AI Proposed Intents</h2>
        </div>

        <div className="space-y-4">
          {!aiSuggestions && <div className="text-slate-500 py-10 text-center border border-dashed border-slate-800 rounded-xl">Awaiting AI proposals...</div>}
          
          {aiSuggestions && aiSuggestions.map((s, idx) => (
            <div key={idx} className="bg-slate-800 p-4 rounded-xl border border-pink-500/30 shadow-lg shadow-pink-900/10">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs text-pink-400 font-mono font-bold">{s.proposed_id}</span>
                <span className="text-[10px] uppercase font-bold bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded">
                  {s.matched_raw_count} MATCHES
                </span>
              </div>
              
              <input 
                type="text" 
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 font-bold mb-2 focus:ring-2 focus:ring-pink-500 outline-none" 
                defaultValue={s.canonical_intent} 
              />
              
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm text-slate-400">{s.category}</span>
                <button 
                  onClick={() => openModal(s)}
                  disabled={loading}
                  className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-900 font-bold text-xs px-3 py-1.5 rounded-lg transition"
                >
                  Approve to CQ Hub
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Approve Modal */}
      {modalOpen && selectedSuggestion && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-100">Finalize Question Capital</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-500 hover:text-slate-300">✕</button>
            </div>
            
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Intent Title</label>
                <div className="text-slate-200 font-bold">{selectedSuggestion.canonical_intent}</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Family Code</label>
                  <select value={familyCode} onChange={e => setFamilyCode(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200 text-sm focus:ring-2 focus:ring-indigo-500">
                    <option value="QC-01">QC-01: Problem / Concern</option>
                    <option value="QC-02">QC-02: Fit / Eligibility</option>
                    <option value="QC-03">QC-03: Product Type / Routine</option>
                    <option value="QC-04">QC-04: Ingredient / Mechanism</option>
                    <option value="QC-05">QC-05: Compare / Choice</option>
                    <option value="QC-06">QC-06: Usage / Execution</option>
                    <option value="QC-07">QC-07: Proof / Trust</option>
                    <option value="QC-08">QC-08: Boundary / Safety</option>
                    <option value="QC-09">QC-09: Brand Specific</option>
                    <option value="QC-10">QC-10: Action / Commerce</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Layer</label>
                  <select value={layer} onChange={e => setLayer(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200 text-sm focus:ring-2 focus:ring-indigo-500">
                    <option value="A">Layer A (Common)</option>
                    <option value="B">Layer B (Niche)</option>
                    <option value="C">Layer C (Brand)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Primary Object</label>
                  <select value={primaryObject} onChange={e => setPrimaryObject(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200 text-sm focus:ring-2 focus:ring-indigo-500">
                    <option value="AnswerObject">AnswerObject</option>
                    <option value="CompareObject">CompareObject</option>
                    <option value="ProofObject">ProofObject</option>
                    <option value="BoundaryObject">BoundaryObject</option>
                    <option value="ActionObject">ActionObject</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Risk Level</label>
                  <select value={riskLevel} onChange={e => setRiskLevel(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200 text-sm focus:ring-2 focus:ring-indigo-500">
                    <option value="low">Low Risk</option>
                    <option value="medium">Medium Risk</option>
                    <option value="high">High Risk</option>
                  </select>
                </div>
              </div>
              
              {errorMsg && <div className="text-red-400 text-xs">{errorMsg}</div>}
            </div>

            <div className="p-6 border-t border-slate-800 flex justify-end gap-3 bg-slate-950">
              <button disabled={loading} onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg font-bold text-slate-400 hover:text-slate-200 transition">Cancel</button>
              <button disabled={loading} onClick={handleApprove} className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition disabled:opacity-50 flex items-center gap-2">
                <Check size={16} /> Save to CQ Hub
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
