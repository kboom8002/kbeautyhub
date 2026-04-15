import React from 'react';
import { ShieldCheck, FileSearch } from 'lucide-react';

export default function TrustBlock({ data }: { data: any }) {
  const grade = data.grade || 'C';
  const reviewers = data.reviewers || [];
  
  const gradeColors: Record<string, string> = {
    'A': 'bg-emerald-100 text-emerald-800 border-emerald-300',
    'B': 'bg-blue-100 text-blue-800 border-blue-300',
    'C': 'bg-amber-100 text-amber-800 border-amber-300',
  };

  return (
    <div className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-200 mt-4 relative">
      <div className="absolute -top-3 -left-3 bg-white border border-slate-200 rounded-xl p-2 shadow-sm">
        <ShieldCheck className="text-slate-800" size={24} />
      </div>

      <div className="ml-6">
        <div className="flex items-center space-x-4 mb-4">
          <h3 className="text-lg font-bold text-slate-800">Trust Evidence</h3>
          <span className={`px-3 py-1 text-xs font-black uppercase tracking-wider rounded-lg border ${gradeColors[grade] || gradeColors['C']}`}>
            Grade {grade}
          </span>
        </div>

        <p className="text-slate-600 mb-6 font-medium">
          {data.claim || "Clinical evidence reviewed by the K-Beauty Governance Board."}
        </p>

        {reviewers.length > 0 && (
          <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
            <div className="flex items-center space-x-2 text-slate-500 mb-3 text-sm">
              <FileSearch size={16} />
              <span className="font-bold uppercase tracking-wider">Independent Reviewers</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {reviewers.map((rev: string, idx: number) => (
                <span key={idx} className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-md text-sm font-medium">
                  {rev}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
