import Link from 'next/link';
import { Settings, Building, UserCircle, Wand2, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function RootPage() {
  const t = useTranslations('Root');

  const PORTALS = [
    {
      title: t('masterAdmin.title'),
      description: t('masterAdmin.desc'),
      href: '/admin',
      icon: Settings,
      color: 'from-slate-700 to-slate-900',
      ring: 'focus:ring-slate-500',
      action: t('masterAdmin.action')
    },
    {
      title: t('brandAdmin.title'),
      description: t('brandAdmin.desc'),
      href: '/brand-admin',
      icon: Building,
      color: 'from-indigo-600 to-indigo-900',
      ring: 'focus:ring-indigo-500',
      action: t('brandAdmin.action')
    },
    {
      title: t('expertPortal.title'),
      description: t('expertPortal.desc'),
      href: '/expert-portal',
      icon: UserCircle,
      color: 'from-emerald-600 to-emerald-900',
      ring: 'focus:ring-emerald-500',
      action: t('expertPortal.action')
    },
    {
      title: t('sandbox.title'),
      description: t('sandbox.desc'),
      href: '/sandbox',
      icon: Wand2,
      color: 'from-amber-600 to-amber-900',
      ring: 'focus:ring-amber-500',
      action: t('sandbox.action')
    }
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-indigo-500/30">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[25%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-[120px]" />
        <div className="absolute bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-emerald-900/10 blur-[100px]" />
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-24">
        
        <div className="text-center max-w-3xl mb-20 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700/50 text-indigo-300 text-sm font-medium backdrop-blur-sm mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            {t('sysOnline')}
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-br from-white via-slate-200 to-slate-500 bg-clip-text text-transparent drop-shadow-sm">
            {t('title')}
          </h1>
          <p className="text-lg md:text-xl text-slate-400 font-light max-w-2xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
          {PORTALS.map((portal) => (
            <Link
              key={portal.title}
              href={portal.href}
              className={`group relative flex flex-col justify-between p-8 rounded-3xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-md overflow-hidden transition-all duration-500 hover:border-slate-500/50 hover:bg-slate-800/80 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#020617] ${portal.ring}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${portal.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
              
              <div className="relative">
                <div className="inline-flex p-3 rounded-2xl bg-slate-800 border border-slate-700 shadow-inner mb-6 group-hover:scale-110 transition-transform duration-500">
                  <portal.icon className="w-8 h-8 text-slate-300 group-hover:text-white transition-colors" />
                </div>
                <h2 className="text-2xl font-bold text-slate-100 mb-3 tracking-tight">
                  {portal.title}
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-8">
                  {portal.description}
                </p>
              </div>

              <div className="relative flex items-center text-sm font-semibold text-slate-300 group-hover:text-white transition-colors mt-auto">
                <span className="bg-slate-700/50 px-4 py-2 rounded-full border border-slate-600/50 group-hover:bg-slate-700 transition-colors">
                  {portal.action}
                </span>
                <ArrowRight className="w-5 h-5 ml-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500" />
              </div>
            </Link>
          ))}
        </div>

        <footer className="mt-24 text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} {t('footer')}
        </footer>

      </main>
    </div>
  );
}
