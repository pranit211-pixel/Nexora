import React from 'react';
import { Sparkles, Shield, ArrowUp } from 'lucide-react';

interface FooterProps {
  onOpenDeployGuide: () => void;
  onOpenSupabaseConfig: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenDeployGuide, onOpenSupabaseConfig }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#080B14] text-slate-600 dark:text-[#9BA6BC] text-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#36D9FF]/20 border border-[#36D9FF]/30 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-[#0284C7] dark:text-[#36D9FF]" />
              </div>
              <span className="text-base font-bold text-slate-900 dark:text-white tracking-tight">NEXORA</span>
            </div>
            <p className="text-xs max-w-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Autonomous Institute of Technology &amp; Higher Research. Empowering students, faculty, and administrators with intelligent unified workflows.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-[#0284C7] dark:text-[#36D9FF] font-semibold">
              <span>Learn</span>
              <span>·</span>
              <span>Connect</span>
              <span>·</span>
              <span>Grow</span>
              <span>·</span>
              <span>Achieve</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-3">Academic Schools</h4>
            <ul className="space-y-2">
              <li><a href="#departments" className="hover:text-slate-900 dark:hover:text-white transition-colors">Computer Science &amp; Engineering</a></li>
              <li><a href="#departments" className="hover:text-slate-900 dark:hover:text-white transition-colors">Artificial Intelligence &amp; Data Science</a></li>
              <li><a href="#departments" className="hover:text-slate-900 dark:hover:text-white transition-colors">Electronics &amp; Telecommunication</a></li>
              <li><a href="#departments" className="hover:text-slate-900 dark:hover:text-white transition-colors">Robotics &amp; Mechanical Systems</a></li>
              <li><a href="#departments" className="hover:text-slate-900 dark:hover:text-white transition-colors">Smart Infrastructure &amp; Civil</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-3">System &amp; Administration</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={onOpenDeployGuide} className="hover:text-purple-600 dark:hover:text-[#B46AFF] text-left transition-colors">
                  Free Deployment Guide (Vercel + Supabase)
                </button>
              </li>
              <li>
                <button onClick={onOpenSupabaseConfig} className="hover:text-[#0284C7] dark:hover:text-[#36D9FF] text-left transition-colors">
                  Supabase Database Settings
                </button>
              </li>
              <li><a href="#notices" className="hover:text-slate-900 dark:hover:text-white transition-colors">Official Circulars</a></li>
              <li><a href="#contact" className="hover:text-slate-900 dark:hover:text-white transition-colors">Admissions Council</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>&copy; {new Date().getFullYear()} NEXORA Institute of Technology. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-slate-500 dark:text-[#9BA6BC]">NAAC A++ Accredited</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
