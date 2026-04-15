import React from 'react';
import { LayoutDashboard, ShieldAlert, FileText, Settings, Library, Users, Inbox } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-slate-950 min-h-screen text-slate-200">
      
      {/* Sidebar Shell */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900/50 flex flex-col hidden md:flex">
        <div className="p-6">
          <h1 className="text-xl font-black tracking-tighter text-indigo-400">
            K-Beauty<span className="text-slate-300">Hub</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 uppercase font-semibold">Governance Console</p>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <NavItem icon={<LayoutDashboard size={18} />} label="Overview" href="/admin" active />
          <NavItem icon={<Inbox size={18} />} label="Raw Inbox" href="/admin/inbox" />
          <NavItem icon={<Library size={18} />} label="QIS Taxonomy" href="/admin/qis" />
          <NavItem icon={<Users size={18} />} label="Tenants" href="/admin/tenants" />
          <NavItem icon={<ShieldAlert size={18} />} label="Launch Control" href="/admin" />
          <NavItem icon={<FileText size={18} />} label="Reviews Queue" href="/admin" />
          <NavItem icon={<Settings size={18} />} label="System Settings" href="/admin" />
        </nav>

        <div className="p-4 border-t border-slate-800 text-sm flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold">
            AX
          </div>
          <div>
            <p className="font-medium text-slate-200">Admin.X</p>
            <p className="text-xs text-slate-500">SYSTEM</p>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto h-screen p-8">
        {children}
      </main>

    </div>
  );
}

function NavItem({ icon, label, href = "#", active = false }: { icon: React.ReactNode, label: string, href?: string, active?: boolean }) {
  return (
    <a href={href} className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${active ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}>
      {icon}
      <span className="font-medium">{label}</span>
    </a>
  );
}
