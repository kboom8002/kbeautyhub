import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';

export default function SplitPanel({ data }: { data: any }) {
  const whoFor = data.who_its_for || [];
  const notFor = data.who_its_not_for || [];
  const limitations = data.limitations || [];

  return (
    <div className="flex flex-col md:flex-row w-full bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200">
      
      {/* LEFT: Green/Positive Side */}
      <div className="flex-1 p-6 md:p-8 bg-slate-50 md:border-r border-slate-200">
        <div className="flex items-center space-x-2 mb-6">
          <CheckCircle2 className="text-emerald-500" size={24} />
          <h3 className="text-xl font-bold text-slate-800">Perfect For</h3>
        </div>
        
        {whoFor.length > 0 ? (
          <ul className="space-y-3">
            {whoFor.map((item: string, idx: number) => (
              <li key={idx} className="flex items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2.5 mr-3 flex-shrink-0" />
                <span className="text-slate-700 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-400 italic">Universal fit.</p>
        )}
      </div>

      {/* RIGHT: Red/Caution Side */}
      <div className="flex-1 p-6 md:p-8 bg-rose-50/30">
        <div className="flex items-center space-x-2 mb-6">
          <AlertTriangle className="text-rose-500" size={24} />
          <h3 className="text-xl font-bold text-rose-900">Caution If</h3>
        </div>

        {notFor.length > 0 ? (
          <ul className="space-y-4 mb-6">
            {notFor.map((item: string, idx: number) => (
              <li key={idx} className="flex items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2.5 mr-3 flex-shrink-0" />
                <span className="text-rose-800 font-medium leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        ) : null}

        {limitations.length > 0 && (
          <div className="mt-4 pt-4 border-t border-rose-100">
            <div className="flex items-center space-x-2 text-rose-600 mb-2">
              <AlertCircle size={16} />
              <span className="text-sm font-bold uppercase tracking-wide">Boundaries</span>
            </div>
            <ul className="space-y-2">
              {limitations.map((lim: string, idx: number) => (
                <li key={idx} className="text-sm text-rose-700/80 pl-4 border-l-2 border-rose-200 block">
                  {lim}
                </li>
              ))}
            </ul>
          </div>
        )}

        {notFor.length === 0 && limitations.length === 0 && (
          <p className="text-slate-400 italic">No specific cautions identified.</p>
        )}
      </div>

    </div>
  );
}
