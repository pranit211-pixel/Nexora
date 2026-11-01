import React from 'react';
import { ArrowRight, BookOpen, GraduationCap, Award, Compass, ShieldCheck } from 'lucide-react';

interface HeroSectionProps {
  onExploreCourses: () => void;
  onApplyNow: () => void;
  onEnterPortal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreCourses,
  onApplyNow,
  onEnterPortal,
}) => {
  return (
    <section className="relative pt-12 pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Kicker - Anti-slop: clean unboxed metadata with bullet */}
        <div className="flex items-center gap-2 text-xs font-mono text-[#36D9FF] mb-4">
          <span>Accredited Tier-1 Autonomous University</span>
          <span aria-hidden="true">·</span>
          <span>Admissions Cycle 2026-2027 Open</span>
        </div>

        {/* 2-Column Split: Headline & Narrative on Left, High-Fidelity Futuristic Campus on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1] text-balance">
              Where Future Minds{' '}
              <span className="bg-gradient-to-r from-[#0284C7] via-[#36D9FF] to-[#B46AFF] dark:from-[#36D9FF] dark:via-[#7DE7FF] dark:to-[#B46AFF] bg-clip-text text-transparent">
                Pioneer Next-Gen
              </span>{' '}
              Intelligence &amp; Innovation.
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-600 dark:text-[#9BA6BC] leading-relaxed max-w-2xl">
              NEXORA is a premier autonomous technology institution blending computational sciences, neural robotics, and quantum engineering.
              Empowering students and faculty with unified real-time academic workflows.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <button
                onClick={onApplyNow}
                className="px-6 py-3 text-sm font-semibold text-[#080B14] bg-[#36D9FF] hover:bg-[#36D9FF]/90 rounded-xl transition-all shadow-[0_0_25px_-5px_rgba(54,217,255,0.4)] flex items-center gap-2 whitespace-nowrap shrink-0 group"
              >
                <span>Apply for Admission</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={onExploreCourses}
                className="px-5 py-3 text-sm font-medium text-slate-800 dark:text-white bg-slate-100 dark:bg-[#101629] hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700/80 hover:border-[#36D9FF]/40 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap shrink-0"
              >
                <Compass className="w-4 h-4 text-[#0284C7] dark:text-[#36D9FF]" />
                <span>Explore Academic Programs</span>
              </button>

              <button
                onClick={onEnterPortal}
                className="px-5 py-3 text-sm font-medium text-purple-700 dark:text-[#B46AFF] bg-purple-50 dark:bg-[#B46AFF]/10 hover:bg-purple-100 dark:hover:bg-[#B46AFF]/20 border border-purple-200 dark:border-[#B46AFF]/30 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap shrink-0"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Campus Portal</span>
              </button>
            </div>

            {/* Quiet Trust Evidence */}
            <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800/80 flex flex-wrap items-center gap-6 text-xs text-slate-600 dark:text-[#9BA6BC]">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#0284C7] dark:text-[#36D9FF]" />
                <span>NAAC A++ Grade (CGPA 3.84/4.0)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-purple-600 dark:text-[#B46AFF]" />
                <span>Top 5 National Technical Ranking</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>100% Outcome-Based Education</span>
              </div>
            </div>
          </div>

          {/* Right Column: Campus Architectural Showcase */}
          <div className="lg:col-span-5 relative flex items-center">
            <div className="w-full relative rounded-2xl overflow-hidden border border-slate-200 dark:border-[#36D9FF]/30 shadow-lg dark:shadow-[0_0_35px_-8px_rgba(54,217,255,0.3)] group">
              <img
                src="/src/assets/images/hero_campus_futuristic_1793456912931.jpg"
                alt="NEXORA Smart University Campus Architecture"
                referrerPolicy="no-referrer"
                className="w-full h-80 sm:h-96 lg:h-full min-h-[380px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 dark:from-[#080B14] via-slate-900/30 dark:via-[#080B14]/30 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-white/90 dark:bg-[#080B14]/80 backdrop-blur-md border border-slate-200 dark:border-[#36D9FF]/20 shadow-md">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-900 dark:text-white">Innovation Quadrangle &amp; Waterway</span>
                  <span className="text-[#0284C7] dark:text-[#36D9FF] font-mono">Building Alpha</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-[#9BA6BC] mt-0.5">
                  Automated net-zero energy campus with smart microgrids and AI-assisted facilities.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Column KPI Stats Strip below 2-column split (Single line tabular figures) */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-white dark:bg-[#101629]/70 border border-slate-200 dark:border-slate-800 hover:border-[#36D9FF]/40 shadow-sm transition-all">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums tracking-tight">4,850+</span>
            <span className="block text-xs font-medium text-slate-600 dark:text-[#9BA6BC] mt-1">Undergraduate &amp; Masters Scholars</span>
          </div>
          <div className="p-5 rounded-xl bg-white dark:bg-[#101629]/70 border border-slate-200 dark:border-slate-800 hover:border-[#36D9FF]/40 shadow-sm transition-all">
            <span className="text-3xl font-extrabold text-[#0284C7] dark:text-[#36D9FF] font-mono tabular-nums tracking-tight">96.4%</span>
            <span className="block text-xs font-medium text-slate-600 dark:text-[#9BA6BC] mt-1">Tier-1 Corporate Placement Rate</span>
          </div>
          <div className="p-5 rounded-xl bg-white dark:bg-[#101629]/70 border border-slate-200 dark:border-slate-800 hover:border-[#B46AFF]/40 shadow-sm transition-all">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums tracking-tight">280+</span>
            <span className="block text-xs font-medium text-slate-600 dark:text-[#9BA6BC] mt-1">Doctoral Research Faculty Members</span>
          </div>
          <div className="p-5 rounded-xl bg-white dark:bg-[#101629]/70 border border-slate-200 dark:border-slate-800 hover:border-[#36D9FF]/40 shadow-sm transition-all">
            <span className="text-3xl font-extrabold text-[#0284C7] dark:text-[#36D9FF] font-mono tabular-nums tracking-tight">32+</span>
            <span className="block text-xs font-medium text-slate-600 dark:text-[#9BA6BC] mt-1">Specialized AI &amp; Robotics Labs</span>
          </div>
        </div>
      </div>
    </section>
  );
};
