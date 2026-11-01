import React from 'react';
import { Cpu, BrainCircuit, Radio, Wrench, Building2, ArrowUpRight, Users, Calendar } from 'lucide-react';
import { Department } from '../../types';

interface DepartmentsSectionProps {
  departments: Department[];
  onSelectDepartment?: (dept: Department) => void;
}

export const DepartmentsSection: React.FC<DepartmentsSectionProps> = ({ departments }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-[#36D9FF]" />;
      case 'BrainCircuit':
        return <BrainCircuit className="w-5 h-5 text-[#B46AFF]" />;
      case 'Radio':
        return <Radio className="w-5 h-5 text-[#36D9FF]" />;
      case 'Wrench':
        return <Wrench className="w-5 h-5 text-[#B46AFF]" />;
      case 'Building2':
        return <Building2 className="w-5 h-5 text-emerald-400" />;
      default:
        return <Cpu className="w-5 h-5 text-[#36D9FF]" />;
    }
  };

  return (
    <section id="departments" className="py-20 border-t border-slate-200 dark:border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#0284C7] dark:text-[#36D9FF] mb-2">
              <span>Academic Engineering Schools</span>
              <span aria-hidden="true">·</span>
              <span>Autonomous Curriculum</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
              Specialized Engineering Departments
            </h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-[#9BA6BC] max-w-md">
            Each academic school maintains world-class research centers, industrial advisory boards, and faculty with doctoral credentials from global institutions.
          </p>
        </div>

        {/* Departments Grid */}
        {departments.length === 0 ? (
          <div className="py-12 px-6 rounded-2xl bg-white dark:bg-[#101629]/60 border border-slate-200 dark:border-slate-800 text-center max-w-xl mx-auto shadow-sm">
            <Building2 className="w-10 h-10 text-[#0284C7] dark:text-[#36D9FF] mx-auto mb-3 opacity-70" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Academic Departments Being Structured</h3>
            <p className="text-xs text-slate-600 dark:text-[#9BA6BC] mt-1.5 leading-relaxed">
              All departments have been cleared. New academic departments can only be added directly by the Admin via the Administrator Portal.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept) => (
              <div
                key={dept.id}
                className="p-6 rounded-2xl bg-white dark:bg-[#101629]/60 border border-slate-200 dark:border-slate-800 hover:border-[#36D9FF]/40 shadow-sm dark:shadow-none transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-800 group-hover:border-[#36D9FF]/30 transition-colors">
                      {getIcon(dept.icon)}
                    </div>
                    <span className="text-xs font-mono font-semibold text-[#0284C7] dark:text-[#36D9FF] px-2.5 py-1 rounded bg-[#36D9FF]/10">
                      {dept.code}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#0284C7] dark:group-hover:text-[#36D9FF] transition-colors">
                    {dept.name}
                  </h3>

                  <p className="mt-3 text-xs text-slate-600 dark:text-[#9BA6BC] leading-relaxed line-clamp-3">
                    {dept.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2 text-xs text-slate-600 dark:text-[#9BA6BC]">
                  <div className="flex items-center justify-between">
                    <span>Head of Dept</span>
                    <span className="text-slate-800 dark:text-slate-200 font-medium">{dept.hodName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Annual Intake</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200">{dept.totalIntake} Scholars</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
