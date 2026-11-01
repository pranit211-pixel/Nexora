import React from 'react';
import { TrendingUp, Briefcase, Award, Building, CheckCircle2 } from 'lucide-react';

export const PlacementsSection: React.FC = () => {
  const recruiters = [
    { name: 'Google', role: 'Software & AI Engineers', hires: '42 Offers' },
    { name: 'NVIDIA', role: 'Deep Learning & CUDA Architects', hires: '31 Offers' },
    { name: 'Microsoft', role: 'Cloud & Azure Systems', hires: '38 Offers' },
    { name: 'Tesla', role: 'Autonomous Autopilot & Robotics', hires: '19 Offers' },
    { name: 'Amazon AWS', role: 'Distributed Systems', hires: '46 Offers' },
    { name: 'Apple', role: 'Hardware & Machine Learning', hires: '16 Offers' },
  ];

  return (
    <section className="py-20 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-[#080B14] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#0284C7] dark:text-[#36D9FF] mb-2">
              <span>Career Outcomes</span>
              <span aria-hidden="true">·</span>
              <span>Class of 2026</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
              Global Placements &amp; Industry Partnerships
            </h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-[#9BA6BC] max-w-md">
            Our corporate relations cell bridges scholars with top multinational research laboratories, Silicon Valley enterprises, and pioneering deep-tech startups.
          </p>
        </div>

        {/* 4 Metrics Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="p-5 rounded-xl bg-white dark:bg-[#101629] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none">
            <span className="text-xs text-slate-500 dark:text-[#9BA6BC] block mb-1">Highest Compensation</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-[#0284C7] dark:text-[#36D9FF] font-mono tabular-nums">$340,000 /yr</span>
            <span className="text-[11px] text-slate-500 dark:text-[#9BA6BC] block mt-1">Autonomous Systems Researcher</span>
          </div>
          <div className="p-5 rounded-xl bg-white dark:bg-[#101629] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none">
            <span className="text-xs text-slate-500 dark:text-[#9BA6BC] block mb-1">Average Engineering CTC</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">$128,500 /yr</span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block mt-1">+18.4% YoY Growth</span>
          </div>
          <div className="p-5 rounded-xl bg-white dark:bg-[#101629] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none">
            <span className="text-xs text-slate-500 dark:text-[#9BA6BC] block mb-1">Placement Percentage</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-purple-600 dark:text-[#B46AFF] font-mono tabular-nums">96.4%</span>
            <span className="text-[11px] text-slate-500 dark:text-[#9BA6BC] block mt-1">Total Eligible Graduates</span>
          </div>
          <div className="p-5 rounded-xl bg-white dark:bg-[#101629] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none">
            <span className="text-xs text-slate-500 dark:text-[#9BA6BC] block mb-1">Fortune 500 Recruiters</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">180+</span>
            <span className="text-[11px] text-slate-500 dark:text-[#9BA6BC] block mt-1">Active On-Campus Partners</span>
          </div>
        </div>

        {/* Recruiter Showcase Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recruiters.map((rec, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-white dark:bg-[#101629]/60 border border-slate-200 dark:border-slate-800/80 hover:border-[#36D9FF]/40 shadow-sm dark:shadow-none transition-colors flex items-center justify-between"
            >
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">{rec.name}</h4>
                <p className="text-xs text-slate-600 dark:text-[#9BA6BC] mt-0.5">{rec.role}</p>
              </div>
              <span className="text-xs font-mono font-semibold text-[#0284C7] dark:text-[#36D9FF] bg-[#36D9FF]/10 px-2.5 py-1 rounded">
                {rec.hires}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
