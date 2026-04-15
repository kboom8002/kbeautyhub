'use client';

import React, { useState } from 'react';
import { Route, Save, Plus, AlertTriangle, GitBranch, Database } from 'lucide-react';
import { upsertQISSceneAction } from '@/app/actions/scene-actions';
import { useRouter } from 'next/navigation';

export default function SceneConfiguratorClient({ cqs, initialScenes }: { cqs: any[], initialScenes: any[] }) {
  const router = useRouter();
  const [selectedCQId, setSelectedCQId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [sceneTitle, setSceneTitle] = useState("");
  const [intent, setIntent] = useState("discover");
  const [repQuery, setRepQuery] = useState("");
  const [reqObjects, setReqObjects] = useState<string[]>(["AnswerObject"]);
  const [personaOrigin, setPersonaOrigin] = useState("problem_led_novice");
  const [decisionStage, setDecisionStage] = useState("discover");
  const [surfaceTargets, setSurfaceTargets] = useState("topic_answer_page");
  const [nudgeRule, setNudgeRule] = useState("");
  const [bridgeRule, setBridgeRule] = useState("");
  const [handoffRule, setHandoffRule] = useState("");
  
  const selectedCQ = cqs.find(c => c.canonical_question_id === selectedCQId);
  const scenesForCQ = initialScenes.filter(s => s.canonical_question_id === selectedCQId);

  const isHighRisk = selectedCQ?.risk_level === 'high';

  const toggleReqObject = (obj: string) => {
    // If high risk, BoundaryObject cannot be unchecked
    if (isHighRisk && obj === 'BoundaryObject') return;
    
    setReqObjects(prev => 
      prev.includes(obj) ? prev.filter(x => x !== obj) : [...prev, obj]
    );
  };

  const handleSelectCQ = (cq: any) => {
    setSelectedCQId(cq.canonical_question_id);
    // Reset Form
    setSceneTitle("");
    setRepQuery("");
    setIntent("discover");
    setPersonaOrigin("problem_led_novice");
    setDecisionStage("discover");
    setSurfaceTargets("topic_answer_page");
    setNudgeRule("");
    setBridgeRule("");
    setHandoffRule("");
    // INHERITANCE: If high risk, automatically enforce BoundaryObject
    if (cq.risk_level === 'high') {
      setReqObjects(["AnswerObject", "BoundaryObject"]);
    } else {
      setReqObjects(["AnswerObject"]);
    }
  };

  const handleCreateScene = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCQ) return;

    setLoading(true);

    const newScene = {
      scene_id: `QIS-${Date.now()}`,
      canonical_question_id: selectedCQ.canonical_question_id,
      scene_title: sceneTitle,
      representative_query: repQuery || selectedCQ.title,
      intent: intent,
      persona_origin: personaOrigin,
      decision_stage: decisionStage,
      surface_targets: surfaceTargets.split(',').map(s=>s.trim()).filter(Boolean),
      nudge_rule: nudgeRule,
      bridge_rule: bridgeRule,
      handoff_rule: handoffRule,
      risk_level: selectedCQ.risk_level || 'low', // INHERITED RISK
      required_objects: reqObjects,
      status: "ACTIVE"
    };

    const res = await upsertQISSceneAction(newScene);
    if (res.success) {
      setSceneTitle("");
      setRepQuery("");
      router.refresh();
    } else {
      alert("Error: " + res.error);
    }
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Left Column: CQ Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 h-[800px] flex flex-col">
        <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2 mb-4 pb-4 border-b border-slate-800">
          <Database className="text-indigo-400" size={20} />
          Select Canonical Question
        </h2>
        
        <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-slate-700">
          {cqs.map(cq => (
            <button
              key={cq.canonical_question_id}
              onClick={() => handleSelectCQ(cq)}
              className={`w-full text-left p-4 rounded-lg border transition ${
                selectedCQId === cq.canonical_question_id
                  ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-mono font-bold opacity-70">{cq.canonical_question_id}</span>
                {cq.risk_level === 'high' && <AlertTriangle size={14} className="text-red-400" />}
              </div>
              <p className="font-bold text-sm leading-tight">{cq.title}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Right Column: Scene Configs */}
      <div className="lg:col-span-2 space-y-6">
        {!selectedCQ ? (
          <div className="bg-slate-900/50 border border-slate-800 border-dashed rounded-xl h-full flex items-center justify-center text-slate-500">
            Select a Canonical Question to configure its Scenes.
          </div>
        ) : (
          <>
            <div className="bg-indigo-950/30 border border-indigo-500/30 rounded-xl p-6">
              <h3 className="text-indigo-400 text-xs font-bold uppercase mb-1">Active Question Capital</h3>
              <p className="text-xl font-bold text-slate-200">{selectedCQ.title}</p>
              <div className="flex gap-4 mt-4 text-sm">
                <span className={`px-2 py-1 rounded font-bold ${isHighRisk ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                  Inherited Risk: {selectedCQ.risk_level?.toUpperCase()}
                </span>
                <span className="bg-slate-800 px-2 py-1 rounded text-slate-300">
                  Family: {selectedCQ.family_code}
                </span>
              </div>
            </div>

            {/* List existing Scenes */}
            <div className="space-y-4">
              <h3 className="text-slate-300 font-bold flex items-center gap-2">
                <Route className="text-emerald-400" size={18} />
                Mapped Scenes ({scenesForCQ.length})
              </h3>
              
              {scenesForCQ.map(scene => (
                <div key={scene.scene_id} className="bg-slate-800 border border-slate-700 p-4 rounded-lg flex justify-between items-center group">
                  <div>
                    <p className="text-slate-200 font-bold">{scene.scene_title}</p>
                    <div className="text-xs text-slate-500 flex gap-4 mt-2">
                      <span>Intent: <span className="text-slate-300 font-mono">{scene.intent}</span></span>
                      <span>Risk: <span className={scene.risk_level === 'high' ? 'text-red-400 font-bold' : ''}>{scene.risk_level}</span></span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {scene.required_objects?.map((obj: string) => (
                      <span key={obj} className={`text-[10px] font-bold px-2 py-0.5 rounded ${obj === 'BoundaryObject' ? 'bg-red-500/20 text-red-400' : 'bg-slate-700 text-slate-300'}`}>
                        {obj}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Create New Scene Form */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="text-slate-200 font-bold flex items-center gap-2 mb-4">
                <Plus className="text-pink-400" size={18} />
                Create New Scene Mapping
              </h3>

              <form onSubmit={handleCreateScene} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Scene Title</label>
                    <input 
                      required
                      value={sceneTitle}
                      onChange={e => setSceneTitle(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      placeholder="e.g. 민감 피부 적합성 판단"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Intent</label>
                    <select 
                      value={intent}
                      onChange={e => setIntent(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      <option value="discover">Discover</option>
                      <option value="fit">Fit (Suitability)</option>
                      <option value="safety">Safety / Conflict</option>
                      <option value="act">Act / Commerce</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Persona Origin</label>
                    <select 
                      value={personaOrigin}
                      onChange={e => setPersonaOrigin(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      <option value="problem_led_novice">Problem-led Novice</option>
                      <option value="risk_sensitive_user">Risk Sensitive User</option>
                      <option value="action_ready_user">Action Ready User</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Decision Stage</label>
                    <select 
                      value={decisionStage}
                      onChange={e => setDecisionStage(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      <option value="discover">Discover Phase</option>
                      <option value="evaluate">Evaluate Phase</option>
                      <option value="trust_check">Trust Check Phase</option>
                      <option value="act">Act Phase</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-500 mb-1">Surface Targets (comma separated)</label>
                  <input 
                    value={surfaceTargets}
                    onChange={e => setSurfaceTargets(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="e.g. topic_answer_page, routine_guide"
                  />
                </div>

                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-2 mb-2">Routing Rules (JSON / Logic)</h4>
                  
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Bridge Rule (Safer route logic)</label>
                    <textarea 
                      value={bridgeRule}
                      onChange={e => setBridgeRule(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      placeholder="e.g. if sensitivity = high, bridge to -> CQ-FIT-004"
                      rows={2}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Handoff Rule (CS trigger logic)</label>
                    <textarea 
                      value={handoffRule}
                      onChange={e => setHandoffRule(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      placeholder="e.g. if pregnant = true && required_objects lacks Proof, handoff to CS"
                      rows={2}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-500 mb-1">Representative Query (Optional)</label>
                  <input 
                    value={repQuery}
                    onChange={e => setRepQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="e.g. 민감 피부도 쓸 수 있나요?"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-500 mb-2 flex justify-between">
                    <span>Required Objects</span>
                    {isHighRisk && <span className="text-red-400 font-bold flex items-center gap-1"><AlertTriangle size={12}/> High Risk CQ inherits mandatory BoundaryObject</span>}
                  </label>
                  <div className="flex gap-3 flex-wrap">
                    {['AnswerObject', 'BoundaryObject', 'ProofObject', 'ActionObject'].map(obj => {
                      const isChecked = reqObjects.includes(obj);
                      const isMandatory = isHighRisk && obj === 'BoundaryObject';
                      
                      return (
                        <label key={obj} className={`flex items-center px-3 py-2 rounded-lg border cursor-pointer transition ${isChecked ? 'bg-indigo-500/10 border-indigo-500' : 'bg-slate-950 border-slate-700'} ${isMandatory ? 'opacity-50 cursor-not-allowed border-red-500/30 bg-red-500/10' : ''}`}>
                          <input 
                            type="checkbox"
                            className="hidden"
                            checked={isChecked}
                            onChange={() => toggleReqObject(obj)}
                            disabled={isMandatory}
                          />
                          <span className={`text-sm font-bold ${isChecked ? (isMandatory ? 'text-red-400' : 'text-indigo-400') : 'text-slate-500'}`}>{obj}</span>
                        </label>
                      )
                    })}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-slate-100 font-bold py-3 rounded-lg transition disabled:opacity-50 flex justify-center items-center gap-2"
                  >
                    <Save size={18} />
                    Map Scene to {selectedCQ.canonical_question_id}
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>

    </div>
  );
}
