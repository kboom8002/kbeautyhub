'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function QisNavTabs() {
  const pathname = usePathname();

  const tabs = [
    { name: '1. AI Taxonomy Workbench', href: '/admin/qis/workbench' },
    { name: '2. Question Capital (CQ Hub)', href: '/admin/qis/capital' },
    { name: '3. QIS Scene Configurator', href: '/admin/qis/scenes' }
  ];

  return (
    <div className="flex space-x-8 mt-6">
      {tabs.map(tab => {
        const isActive = pathname.startsWith(tab.href);
        return (
          <Link 
            key={tab.href}
            href={tab.href}
            className={`py-3 font-bold text-sm transition-colors border-b-2 ${
              isActive 
                ? 'border-indigo-500 text-indigo-400' 
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            {tab.name}
          </Link>
        );
      })}
    </div>
  );
}
