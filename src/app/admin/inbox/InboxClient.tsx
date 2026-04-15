'use client';

import React, { useState } from 'react';
import { Upload, Plus, FileSpreadsheet, RefreshCcw } from 'lucide-react';
import { insertRawQuestion, bulkInsertRawQuestions } from '@/app/actions/inbox-actions';
import { useRouter } from 'next/navigation';

export default function InboxClient({ initialItems }: { initialItems: any[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [loading, setLoading] = useState(false);
  const [manualText, setManualText] = useState("");
  const [manualSource, setManualSource] = useState("");
  const [manualCount, setManualCount] = useState(1);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    
    if (!manualText) {
      setErrorMsg("Text is required");
      setLoading(false);
      return;
    }

    const result = await insertRawQuestion(manualText, manualSource || 'Manual', manualCount);
    if (result.success && result.data) {
      setItems([result.data, ...items]);
      setManualText("");
      setManualSource("");
      setManualCount(1);
      setSuccessMsg("Question added manually.");
      router.refresh();
    } else {
      setErrorMsg(result.error || "Failed to add.");
    }
    setLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const content = ev.target?.result as string;
        let rows = [];
        if (file.name.endsWith('.json')) {
          rows = JSON.parse(content);
        } else if (file.name.endsWith('.csv')) {
          // simple csv parser: text,source,count
          const lines = content.split('\n').map(l => l.trim()).filter(Boolean);
          // skip header if exists
          const startIndex = lines[0].toLowerCase().includes('text') ? 1 : 0;
          for (let i = startIndex; i < lines.length; i++) {
            const [text, source, count] = lines[i].split(',').map(s => s.trim());
            if (text) {
              rows.push({ text, source: source || 'CSV Upload', count: parseInt(count) || 1 });
            }
          }
        } else {
          throw new Error("Unsupported file format. Use .json or .csv");
        }

        if (rows.length === 0) throw new Error("No data found.");

        const res = await bulkInsertRawQuestions(rows);
        if (res.success && res.data) {
          setItems([...res.data, ...items]);
          setSuccessMsg(`Successfully uploaded ${rows.length} items.`);
          router.refresh();
        } else {
          throw new Error(res.error);
        }
      } catch (err: any) {
        setErrorMsg(`Upload failed: ${err.message}`);
      }
      setLoading(false);
    };
    reader.readAsText(file);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Left Column: Form & Upload */}
      <div className="space-y-6">
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2 mb-4">
            <Plus className="text-indigo-400" size={20} />
            Manual Entry
          </h2>
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Raw Question</label>
              <textarea 
                value={manualText}
                onChange={e => setManualText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="e.g. Can I use this with Vitamin C?"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Source Filter</label>
                <input 
                  type="text" 
                  value={manualSource}
                  onChange={e => setManualSource(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="App Review"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Occurrences</label>
                <input 
                  type="number" 
                  value={manualCount}
                  onChange={e => setManualCount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  min={1}
                />
              </div>
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-slate-100 font-bold py-2 rounded-lg transition disabled:opacity-50"
            >
              Add to Inbox
            </button>
          </form>
        </section>

        <section className="bg-slate-900 border border-slate-800 rounded-xl p-5 border-dashed">
          <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2 mb-4">
            <FileSpreadsheet className="text-emerald-400" size={20} />
            Bulk Upload (CSV / JSON)
          </h2>
          <p className="text-xs text-slate-400 mb-4">
            CSV format: <code className="bg-slate-800 px-1 rounded">text,source,count</code>
          </p>
          <label className="cursor-pointer flex flex-col items-center justify-center p-6 border-2 border-slate-700 border-dashed rounded-lg bg-slate-950 hover:bg-slate-800/50 transition">
            <Upload className="text-slate-500 mb-2" size={24} />
            <span className="text-sm font-bold text-slate-300">Click to upload file</span>
            <input type="file" className="hidden" accept=".csv,.json" onChange={handleFileUpload} />
          </label>
        </section>

        {errorMsg && <div className="p-3 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-sm">{errorMsg}</div>}
        {successMsg && <div className="p-3 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-sm">{successMsg}</div>}

      </div>

      {/* Right Column: List View */}
      <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col h-[700px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-slate-200">Unsorted Questions ({items.length})</h2>
          <button onClick={() => router.refresh()} className="text-slate-400 hover:text-slate-200">
            <RefreshCcw size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-slate-700">
          {items.map(item => (
            <div key={item.id} className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex justify-between items-center group hover:border-slate-500 transition">
              <div>
                <p className="text-sm font-medium text-slate-200">{item.text}</p>
                <div className="flex gap-3 text-xs text-slate-500 mt-2">
                  <span>Source: {item.source}</span>
                  <span>Count: {item.count}</span>
                  <span>Status: <span className="text-amber-500">{item.status}</span></span>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="text-center text-slate-500 py-10">Inbox is empty.</div>
          )}
        </div>
      </div>

    </div>
  );
}
