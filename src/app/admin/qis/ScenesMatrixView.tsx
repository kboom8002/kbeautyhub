'use client';
import React, { useState } from 'react';
import { Layers, ShieldAlert, CheckCircle, Search, Eye, Columns, Phone, Sparkles } from 'lucide-react';
import { runGeminiSceneGenerationAction } from '@/app/actions/qis-actions';

export default function ScenesMatrixView({ canonicals }: { canonicals: any[] }) {
  const [selectedCq, setSelectedCq] = useState(canonicals[0]);
  const [scenes, setScenes] = useState([
    { id: 'QIS-KBS-001', title: '민감 피부 초보 루틴 진입', risk: 'Low', intent: 'discover', reqObjects: { answer: true, proof: false, boundary: false, action: true, media: true } },
    { id: 'QIS-KBS-004', title: '민감 피부 적합성 판단', risk: 'High', intent: 'fit', reqObjects: { answer: true, proof: true, boundary: true, action: false, media: false } }
  ]);
  const [selectedScene, setSelectedScene] = useState(scenes[0]);
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleReqObject = (objKey: 'answer'|'proof'|'boundary'|'action'|'media') => {
    // If risk is High, boundary and proof are locked to true (simulate logic)
    if (selectedScene.risk === 'High' && (objKey === 'boundary' || objKey === 'proof')) {
      alert("High Risk Scenes require Boundary and Proof objects by policy.");
      return;
    }
    const newScenes = scenes.map(s => 
      s.id === selectedScene.id 
        ? { ...s, reqObjects: { ...s.reqObjects, [objKey]: !s.reqObjects[objKey] } } 
        : s
    );
    setScenes(newScenes);
    setSelectedScene(newScenes.find(s => s.id === selectedScene.id)!);
  };

  const addScene = () => {
    const newScene = { 
      id: `QIS-KBS-00${scenes.length + 5}`, 
      title: '새로운 맥락 (예: 시술 직후 관리)', 
      risk: 'High', 
      intent: 'safety', 
      reqObjects: { answer: true, proof: true, boundary: true, action: false, media: false } 
    };
    setScenes([newScene, ...scenes]);
    setSelectedScene(newScene);
  };

  const handleSuggestScenes = async () => {
    if (!selectedCq) return;
    setIsGenerating(true);
    const res = await runGeminiSceneGenerationAction(selectedCq.canonical_intent);
    if (res.success && res.data) {
      setScenes([...res.data, ...scenes]);
      setSelectedScene(res.data[0]);
    } else {
      alert("AI Generation failed: " + res.error);
    }
    setIsGenerating(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 1. CQ & Scenes List */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 h-[800px] overflow-y-auto">
        <h3 className="font-bold text-slate-300 flex items-center gap-2 mb-4">
          <Layers size={18} className="text-indigo-400" /> Intent * Scene Registry
        </h3>
        
        {selectedCq && (
          <div className="bg-slate-800 p-4 rounded-lg border border-indigo-500/30 mb-6 group cursor-pointer hover:border-indigo-500">
            <span className="text-xs font-mono text-indigo-400">{selectedCq.cq_id}</span>
            <p className="font-bold text-slate-100 mt-1">{selectedCq.canonical_intent}</p>
          </div>
        )}

        <div className="flex flex-col gap-2 mb-4 pb-4 border-b border-slate-800">
          <div className="flex justify-between items-center">
             <h4 className="text-sm font-bold text-slate-400 uppercase">Registered Scenes</h4>
             <button onClick={addScene} className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded hover:bg-indigo-500/30 transition">+ New Scene</button>
          </div>
          <button 
            onClick={handleSuggestScenes}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500/10 to-indigo-500/10 hover:from-pink-500/20 hover:to-indigo-500/20 border border-pink-500/30 text-pink-400 font-bold py-2 rounded-lg text-sm transition"
          >
            <Sparkles size={16} className={isGenerating ? "animate-spin" : ""} />
            {isGenerating ? "Gemini is engineering Scenes..." : "✨ Auto-Generate Scenes via AI"}
          </button>
        </div>

        <div className="space-y-3">
          {scenes.map(s => (
            <div 
              key={s.id} 
              onClick={() => setSelectedScene(s)}
              className={`p-3 rounded-lg border cursor-pointer transition ${selectedScene.id === s.id ? 'bg-indigo-900/20 border-indigo-500' : 'bg-slate-950 border-slate-800 hover:border-slate-700'}`}
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-mono text-slate-500">{s.id}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${s.risk === 'High' ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                  {s.risk} Risk
                </span>
              </div>
              <p className="text-sm font-bold text-slate-200 mt-1">{s.title}</p>
              <div className="mt-2 flex gap-1 flex-wrap">
                {s.reqObjects.answer && <span className="w-2 h-2 rounded-full bg-indigo-400" title="Answer"></span>}
                {s.reqObjects.proof && <span className="w-2 h-2 rounded-full bg-emerald-400" title="Proof"></span>}
                {s.reqObjects.boundary && <span className="w-2 h-2 rounded-full bg-amber-400" title="Boundary"></span>}
                {s.reqObjects.action && <span className="w-2 h-2 rounded-full bg-blue-400" title="Action"></span>}
                {s.reqObjects.media && <span className="w-2 h-2 rounded-full bg-fuchsia-400" title="Media"></span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Object Matrix Manager */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-[800px]">
        <h3 className="font-bold text-slate-300 flex items-center gap-2 mb-6 border-b border-slate-800 pb-4">
          <Columns size={18} className="text-pink-400" /> Object Matrix Control
        </h3>

        {selectedScene && (
          <div className="space-y-6">
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase">Target Scene</p>
              <h2 className="text-xl font-black text-slate-100 mt-1">{selectedScene.title}</h2>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded">Intent: {selectedScene.intent}</span>
                {selectedScene.risk === 'High' && (
                  <span className="text-xs bg-rose-500/10 text-rose-400 font-bold px-2 py-1 rounded flex items-center gap-1 border border-rose-500/30">
                    <ShieldAlert size={12} /> Strict Compliance Required
                  </span>
                )}
              </div>
            </div>

            <div className="pt-4 space-y-4">
              <p className="text-sm text-slate-400 font-medium">Toggle Required Objects for Brands to Submit:</p>

              {/* Toggles */}
              <div className="space-y-3">
                <div onClick={() => toggleReqObject('answer')} className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer select-none ${selectedScene.reqObjects.answer ? 'bg-indigo-900/10 border-indigo-500' : 'bg-slate-950 border-slate-800 opacity-50'}`}>
                  <span className="font-bold text-slate-200">Answer Object (Core)</span>
                  {selectedScene.reqObjects.answer ? <CheckCircle className="text-indigo-500" size={20} /> : <div className="w-5 h-5 rounded-full border border-slate-700" />}
                </div>

                <div onClick={() => toggleReqObject('proof')} className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer select-none ${selectedScene.reqObjects.proof ? 'bg-emerald-900/10 border-emerald-500' : 'bg-slate-950 border-slate-800 opacity-50'}`}>
                  <span className="font-bold text-slate-200">Proof Object (Evidence)</span>
                  {selectedScene.reqObjects.proof ? <CheckCircle className="text-emerald-500" size={20} /> : <div className="w-5 h-5 rounded-full border border-slate-700" />}
                </div>

                <div onClick={() => toggleReqObject('boundary')} className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer select-none ${selectedScene.reqObjects.boundary ? 'bg-amber-900/10 border-amber-500' : 'bg-slate-950 border-slate-800 opacity-50'}`}>
                  <span className="font-bold text-slate-200">Boundary Object (Limits)</span>
                  {selectedScene.reqObjects.boundary ? <CheckCircle className="text-amber-500" size={20} /> : <div className="w-5 h-5 rounded-full border border-slate-700" />}
                </div>

                <div onClick={() => toggleReqObject('action')} className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer select-none ${selectedScene.reqObjects.action ? 'bg-blue-900/10 border-blue-500' : 'bg-slate-950 border-slate-800 opacity-50'}`}>
                  <span className="font-bold text-slate-200">Action Object (CTA)</span>
                  {selectedScene.reqObjects.action ? <CheckCircle className="text-blue-500" size={20} /> : <div className="w-5 h-5 rounded-full border border-slate-700" />}
                </div>

                <div onClick={() => toggleReqObject('media')} className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer select-none ${selectedScene.reqObjects.media ? 'bg-fuchsia-900/10 border-fuchsia-500' : 'bg-slate-950 border-slate-800 opacity-50'}`}>
                  <span className="font-bold text-slate-200 flex items-center gap-2">Media Object <span className="bg-fuchsia-500/20 text-fuchsia-400 text-[10px] px-1.5 py-0.5 rounded uppercase">Rich Content</span></span>
                  {selectedScene.reqObjects.media ? <CheckCircle className="text-fuchsia-500" size={20} /> : <div className="w-5 h-5 rounded-full border border-slate-700" />}
                </div>
              </div>

              {selectedScene.risk === 'High' && (
                <div className="bg-rose-500/10 p-3 rounded-lg border border-rose-500/30 text-rose-400 text-xs mt-4">
                  <strong>Policy Lock:</strong> This scene is marked High Risk. The system actively locks Proof and Boundary to true. They cannot be bypassed.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 3. Surface Projector (Preview) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-[800px] flex flex-col items-center">
        <div className="w-full h-full max-w-sm flex flex-col">
          <h3 className="font-bold text-slate-300 flex items-center gap-2 mb-6 self-start w-full border-b border-slate-800 pb-4">
            <Eye size={18} className="text-emerald-400" /> Surface Projector
          </h3>

          {/* Smartphone Mockup */}
          <div className="flex-1 w-full bg-slate-950 border-[6px] border-slate-800 rounded-[2.5rem] overflow-hidden relative shadow-2xl flex flex-col">
            {/* Notch */}
            <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-20">
              <div className="w-24 h-4 bg-slate-800 rounded-b-xl" />
            </div>

            {/* Simulated B2C App Header & SEO Toggle */}
            <div className="bg-white px-4 pt-10 pb-3 border-b flex justify-between items-center z-10">
              <p className="font-bold text-slate-800 text-sm">Answer Card</p>
              <button 
                onClick={() => setScenes(scenes => scenes.map(s => s.id === selectedScene.id ? { ...s, showSeo: !(s as any).showSeo } : s)) }
                className="text-xs bg-indigo-100 text-indigo-700 font-bold px-2 py-1 rounded"
              >
                {(selectedScene as any).showSeo ? 'View UI' : 'View GEO Source'}
              </button>
            </div>

            {/* Screen Content */}
            <div className="flex-1 overflow-y-auto bg-slate-50 p-4">
              
              {(selectedScene as any).showSeo ? (
                // SEO / GEO Raw Source View
                <div className="bg-slate-900 rounded-xl p-3 h-full overflow-y-auto text-xs font-mono text-emerald-400">
                  <div className="text-slate-500 mb-2">// JSON-LD schema injected by B-SSoT</div>
                  {`{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "FAQPage",
      "mainEntity": [{
        "@type": "Question",
        "name": "${selectedCq?.canonical_intent || '민감 피부 어떻게 하나요?'}",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "이 제품은 민감성 피부를 위해 설계..."
        }
      }]
    },
    {
      "@type": "ClaimReview",
      "claimReviewed": "임산부 적합성 판단",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5"
      },
      "author": {
        "@type": "Person",
        "name": "Dr. Lee",
        "jobTitle": "Chief Dermatologist, Seoul Clinic"
      }
    }${selectedScene.reqObjects.media ? `,
    {
      "@type": "HowTo",
      "name": "민감성 수분 진정 루틴",
      "step": [
        { "@type": "HowToStep", "text": "스텝 1: 저자극 토너 결돈", "image": "https://example.com/step1.jpg" },
        { "@type": "HowToStep", "text": "스텝 2: 진정 앰플 도포", "image": "https://example.com/step2.jpg" }
      ]
    }` : ''}
  ]
}`}
                  <div className="text-slate-500 mt-4">// Semantic HTML markers</div>
                  {`<article itemscope itemtype="https://schema.org/MedicalWebPage">
  <header>Verified By: Dr. Lee</header>
  <section itemprop="mainContentOfPage">...</section>
</article>`}
                </div>
              ) : (
                // Semantic HTML Visual Render
                <div className="space-y-4">
                  {/* Query bubble */}
                  <div className="bg-indigo-100 text-indigo-900 p-3 rounded-xl rounded-tr-sm self-end max-w-[85%] ml-auto text-sm">
                    Q: {selectedCq?.canonical_intent || '민감 피부 어떻게 하나요?'}
                  </div>

                  {/* Semantic Article Card */}
                  <article className="bg-white shadow-sm border border-slate-200 rounded-xl overflow-hidden" itemScope itemType="https://schema.org/MedicalWebPage">
                    
                    {/* E-E-A-T SSoT Badge */}
                    <header className="bg-slate-900 text-white px-3 py-2 flex items-center gap-2">
                       <CheckCircle size={14} className="text-emerald-400" />
                       <div>
                         <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest leading-none">Verified By People SSoT</p>
                         <cite className="text-xs font-medium block mt-0.5 not-italic">Dr. Lee (Seoul Clinic)</cite>
                       </div>
                    </header>
                    
                    {/* Answer Part */}
                    {selectedScene.reqObjects.answer && (
                      <section className="p-4 border-b border-slate-100" itemProp="text">
                        <h2 className="text-sm font-bold text-slate-800 mb-2">Answer</h2>
                        <p className="text-sm text-slate-600 leading-relaxed">이 제품은 민감성 피부를 위해 설계된 저자극 포뮬러입니다. 충분한 보습과 진정을 도와줍니다.</p>
                      </section>
                    )}

                    {/* Rich Media Part (Visual Guide) */}
                    {selectedScene.reqObjects.media && (
                      <section className="p-4 border-b border-slate-100 bg-slate-50 shadow-inner">
                        <h2 className="text-xs font-bold text-slate-800 mb-3 flex items-center gap-1">
                          <Eye size={14} className="text-fuchsia-500" /> Step-by-Step Routine
                        </h2>
                        
                        <div className="flex gap-3 overflow-x-auto pb-2 snap-x">
                          {/* Step 1 */}
                          <div className="min-w-[120px] bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm snap-center">
                            <div className="h-20 bg-slate-200 relative">
                               <img src="https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&q=80&w=200&h=200" alt="Step 1 toner" className="w-full h-full object-cover opacity-80" />
                               <span className="absolute top-1 left-1 bg-black/50 text-white text-[9px] font-bold px-1.5 rounded">STEP 1</span>
                            </div>
                            <div className="p-2">
                              <p className="text-[10px] font-bold text-slate-800">저자극 토너 결돈</p>
                            </div>
                          </div>
                          
                          {/* Step 2 */}
                          <div className="min-w-[120px] bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm snap-center">
                            <div className="h-20 bg-slate-200 relative">
                               <img src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=200&h=200" alt="Step 2 ampoule" className="w-full h-full object-cover opacity-80" />
                               <span className="absolute top-1 left-1 bg-black/50 text-white text-[9px] font-bold px-1.5 rounded">STEP 2</span>
                            </div>
                            <div className="p-2">
                              <p className="text-[10px] font-bold text-slate-800">진정 앰플 도포</p>
                            </div>
                          </div>
                        </div>
                      </section>
                    )}

                    {/* Entities Table */}
                    <section className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Data Entities</p>
                      <dl className="grid grid-cols-2 gap-y-2 text-xs">
                        <div className="flex flex-col"><dt className="text-slate-400">Core Ingredient</dt><dd className="font-medium text-slate-700">Niacinamide 15%</dd></div>
                        <div className="flex flex-col"><dt className="text-slate-400">Compliance</dt><dd className="font-medium text-slate-700">EWG Green</dd></div>
                      </dl>
                    </section>

                    {/* Boundary Part */}
                    {selectedScene.reqObjects.boundary && (
                      <section className="p-3 bg-amber-50">
                        <p className="text-xs font-bold text-amber-800 flex items-center gap-1"><ShieldAlert size={12}/> Boundary (주의사항)</p>
                        <p className="text-xs text-amber-700 mt-1">심한 염증성 여드름이 진행 중일 때는 전문의와 먼저 상담하세요. 눈가 점막은 피해서 발라주세요.</p>
                      </section>
                    )}

                    {/* Proof Part */}
                    {selectedScene.reqObjects.proof && (
                      <section className="p-3 bg-emerald-50 text-emerald-800 border-t border-emerald-100/50 relative">
                        <div className="flex items-center gap-2">
                           <CheckCircle size={14} />
                           <span className="text-xs font-bold uppercase tracking-wider">Clinical Evidence Verified</span>
                        </div>
                        <p className="text-[10px] mt-1 opacity-80" itemProp="citation">한국피부과학연구원 2차 자극 테스트 무자극 판정 (2025)</p>
                        
                        <div className="flex items-center justify-between mt-3">
                          <time className="text-[9px] text-emerald-600/70 font-mono">Last Audited: 2026-04-09T14:00Z</time>
                          <button className="text-[9px] bg-white border border-emerald-200 text-emerald-600 px-2 py-1 rounded shadow-sm font-bold flex items-center gap-1 hover:bg-emerald-100 transition">
                            <span className="text-emerald-500">📄</span> 원본 성적서 조회
                          </button>
                        </div>
                      </section>
                    )}

                  </article>

                  {/* Action Part */}
                  {selectedScene.reqObjects.action && (
                    <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-sm shadow-md transition active:scale-95">
                      상세 정보 확인하기
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
