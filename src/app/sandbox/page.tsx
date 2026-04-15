import React from 'react';
import Link from 'next/link';
import { BrandService } from '@/domain/brand/service';
import { Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';

export default async function HubPage() {
  const brands = await BrandService.getAllBrands();

  if (brands.length === 0) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">No Brands Found</h1>
          <p className="text-slate-400">Run the seed script to populate the Vertical Hub.</p>
        </div>
      </div>
    );
  }

  // MVP: Assign a random curation label based on name for demonstration
  const getCurationData = (name: string) => {
    if (name.includes('GOOD') || name.includes('Popular')) return { tag: 'Editor\'s Pick', icon: <Sparkles size={14} />, color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
    if (name.includes('Trending')) return { tag: 'Trending Now', icon: <TrendingUp size={14} />, color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' };
    return { tag: 'Verified Safe', icon: <ShieldCheck size={14} />, color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' };
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-slate-900 border-b border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-emerald-500/10 opacity-50" />
        <div className="max-w-5xl mx-auto px-6 py-20 relative relative z-10 text-center">
          <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-bold tracking-widest uppercase text-slate-300 mb-6 inline-block">
            B-SSoT Powered
          </span>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white mb-6">
            K-Beauty Vertical <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-emerald-400">Hub</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light">
            Discover curated, governance-verified Korean beauty brands tailored to your exact skin profile. Safe, transparent, and clinically proven.
          </p>
        </div>
      </div>

      {/* Brand Gallery */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">Featured Brands</h2>
          <span className="text-sm text-slate-500 font-medium">{brands.length} Brands Verified</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands.map((brand) => {
            const curation = getCurationData(brand.name);
            return (
              <Link key={brand.brand_id} href={`/sandbox/brands/${brand.brand_id}`}>
                <div className="group relative bg-slate-900 rounded-3xl p-6 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/80 transition-all cursor-pointer overflow-hidden shadow-sm hover:shadow-indigo-500/10">
                  
                  {/* Curation Badge */}
                  <div className={`absolute top-4 right-4 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border backdrop-blur-md ${curation.color}`}>
                    {curation.icon}
                    {curation.tag}
                  </div>

                  {/* Brand Placeholder Image */}
                  <div className="aspect-square bg-slate-800 rounded-2xl mb-6 flex items-center justify-center border border-slate-700/50 group-hover:scale-[1.02] transition-transform duration-500">
                    <span className="text-5xl font-black text-slate-700 select-none">
                      {brand.name.charAt(0)}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{brand.name}</h3>
                  <p className="text-slate-400 text-sm line-clamp-2">
                    Verified B-SSoT projected brand surface. Safety gates apply.
                  </p>
                  
                  <div className="mt-4 pt-4 border-t border-slate-800/80 flex justify-between items-center">
                    <span className="text-xs text-slate-500 font-mono">{brand.brand_id}</span>
                    <span className="text-sm font-bold text-indigo-400 group-hover:translate-x-1 transition-transform">Explore →</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

    </div>
  );
}
