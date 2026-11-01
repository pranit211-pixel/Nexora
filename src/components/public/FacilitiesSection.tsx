import React from 'react';
import { Clock, Users, ShieldCheck, Check } from 'lucide-react';
import { CampusFacility } from '../../types';

interface FacilitiesSectionProps {
  facilities: CampusFacility[];
}

export const FacilitiesSection: React.FC<FacilitiesSectionProps> = ({ facilities }) => {
  return (
    <section id="facilities" className="py-20 border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#080B14] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#0284C7] dark:text-[#36D9FF] mb-2">
              <span>Next-Gen Infrastructure</span>
              <span aria-hidden="true">·</span>
              <span>Smart Campus Ecosystem</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
              World-Class Research &amp; Campus Facilities
            </h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-[#9BA6BC] max-w-md">
            Our 140-acre carbon-neutral campus integrates high-compute GPU clusters, biometric 24/7 security, and modern collaborative spaces.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {facilities.map((fac) => (
            <div
              key={fac.id}
              className="rounded-2xl overflow-hidden bg-white dark:bg-[#101629]/70 border border-slate-200 dark:border-slate-800 hover:border-[#36D9FF]/40 shadow-sm dark:shadow-none transition-all flex flex-col group"
            >
              <div className="relative h-60 sm:h-72 overflow-hidden bg-slate-100 dark:bg-slate-900">
                <img
                  src={fac.imageUrl}
                  alt={fac.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 dark:from-[#101629] via-slate-900/20 dark:via-[#101629]/20 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 text-xs font-medium text-white dark:text-[#36D9FF] bg-slate-900/80 dark:bg-[#080B14]/80 backdrop-blur-md rounded-md border border-white/20 dark:border-[#36D9FF]/20">
                    {fac.category}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-[#0284C7] dark:group-hover:text-[#36D9FF] transition-colors">
                    {fac.name}
                  </h3>
                  <p className="mt-2 text-xs text-slate-600 dark:text-[#9BA6BC] leading-relaxed">
                    {fac.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                    <span className="text-[11px] font-mono text-slate-500 dark:text-[#9BA6BC] uppercase tracking-wider block mb-2">
                      Equipment &amp; Highlights
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300">
                      {fac.specs.map((s, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-[#0284C7] dark:text-[#36D9FF] shrink-0" />
                          <span className="truncate">{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-[#9BA6BC]">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#0284C7] dark:text-[#36D9FF]" />
                    <span>{fac.capacity}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-purple-600 dark:text-[#B46AFF]" />
                    <span>{fac.timings}</span>
                  </div>
                  <div className="text-slate-700 dark:text-slate-300">
                    Incharge: <strong className="text-slate-900 dark:text-white">{fac.incharge}</strong>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
