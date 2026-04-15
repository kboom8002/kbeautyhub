import React from 'react';
import { Network } from 'lucide-react';
import QisNavTabs from './QisNavTabs';

export default function QisLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <header className="border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-black text-slate-100 flex items-center gap-3">
          <Network className="text-violet-500" size={32} />
          QIS Taxonomy Studio
        </h1>
        <p className="text-slate-400 mt-2 text-lg">Manage the Question Capital foundation from Inbox to Runtime Scenes.</p>
        
        <QisNavTabs />
      </header>

      {children}
    </div>
  );
}
