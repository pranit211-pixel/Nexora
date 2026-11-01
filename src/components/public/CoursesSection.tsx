import React, { useState } from 'react';
import { CheckCircle2, Clock, Award, BookOpen, GraduationCap } from 'lucide-react';

interface CourseItem {
  id: string;
  code: string;
  title: string;
  level: 'UG' | 'PG' | 'Doctoral';
  duration: string;
  credits: number;
  eligibility: string;
  outcomes: string[];
}

const COURSES: CourseItem[] = [
  {
    id: 'c1',
    code: 'B.TECH-AIDS',
    title: 'B.Tech in Artificial Intelligence & Data Science',
    level: 'UG',
    duration: '4 Years (8 Semesters)',
    credits: 164,
    eligibility: '10+2 with Physics, Mathematics & Computer Science (Min 75%)',
    outcomes: ['Deep Learning Systems', 'LLM Fine-tuning', 'Computer Vision & NeRFs', 'Autonomous Agents'],
  },
  {
    id: 'c2',
    code: 'B.TECH-CSE',
    title: 'B.Tech in Computer Science & Engineering',
    level: 'UG',
    duration: '4 Years (8 Semesters)',
    credits: 160,
    eligibility: '10+2 with Physics, Mathematics & Chemistry/CS (Min 75%)',
    outcomes: ['Distributed Cloud Architecture', 'High-Performance Computing', 'Applied Cryptography', 'Kernel Systems'],
  },
  {
    id: 'c3',
    code: 'B.TECH-ECE',
    title: 'B.Tech in Electronics & Telecommunication',
    level: 'UG',
    duration: '4 Years (8 Semesters)',
    credits: 160,
    eligibility: '10+2 with Physics & Mathematics (Min 70%)',
    outcomes: ['6G Telecommunication', 'VLSI & Chip Architecture', 'Silicon Photonics', 'Edge AI Embedded IoT'],
  },
  {
    id: 'c4',
    code: 'M.TECH-ROBOTICS',
    title: 'M.Tech in Autonomous Robotics & Embodied AI',
    level: 'PG',
    duration: '2 Years (4 Semesters)',
    credits: 72,
    eligibility: 'B.Tech/B.E in Engineering with valid GATE score or NEXORA Entrance',
    outcomes: ['Kinematic Trajectory Planning', 'SLAM with Visual-Inertial Odometry', 'Humanoid Control', 'ROS2 Enterprise'],
  },
  {
    id: 'c5',
    code: 'M.TECH-QUANTUM',
    title: 'M.Tech in Applied Quantum Computing & Crypto',
    level: 'PG',
    duration: '2 Years (4 Semesters)',
    credits: 68,
    eligibility: 'B.Tech in CS/Physics/ECE with strong linear algebra foundation',
    outcomes: ['Qiskit & PennyLane Systems', 'Post-Quantum Cryptography', 'Variational Quantum Algorithms', 'Quantum Error Correction'],
  },
  {
    id: 'c6',
    code: 'PHD-ADVANCED',
    title: 'Doctor of Philosophy (Ph.D.) in Computational Sciences',
    level: 'Doctoral',
    duration: '3–5 Years',
    credits: 36,
    eligibility: 'Master’s degree in related disciplines with research publications',
    outcomes: ['Funded Institutional Fellowships', 'IEEE/ACM Publications', 'Patents & Industry Spinoffs', 'Postdoc Placement'],
  },
];

export const CoursesSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'All' | 'UG' | 'PG' | 'Doctoral'>('All');

  const filtered = activeTab === 'All' ? COURSES : COURSES.filter((c) => c.level === activeTab);

  return (
    <section id="courses" className="py-20 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-[#080B14] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#0284C7] dark:text-[#36D9FF] mb-2">
              <span>Degree Programs</span>
              <span aria-hidden="true">·</span>
              <span>Accredited Global Curriculum</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
              Undergraduate &amp; Graduate Academic Offerings
            </h2>
          </div>

          {/* Interactive Filter Tabs - Functional segmented buttons */}
          <div className="flex items-center gap-1 p-1 bg-white dark:bg-[#101629] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm shrink-0">
            {(['All', 'UG', 'PG', 'Doctoral'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  activeTab === tab
                    ? 'bg-[#36D9FF]/20 text-[#0284C7] dark:text-[#36D9FF] border border-[#36D9FF]/30 font-semibold'
                    : 'text-slate-600 dark:text-[#9BA6BC] hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab === 'All' ? 'All Degrees' : tab === 'UG' ? 'Undergraduate' : tab === 'PG' ? 'Postgraduate' : 'Doctoral'}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((course) => (
            <div
              key={course.id}
              className="p-6 rounded-2xl bg-white dark:bg-[#101629]/70 border border-slate-200 dark:border-slate-800 hover:border-[#36D9FF]/40 shadow-sm dark:shadow-none transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="font-mono text-[#0284C7] dark:text-[#36D9FF] font-semibold">{course.code}</span>
                  <span className="text-slate-500 dark:text-[#9BA6BC] font-mono">{course.duration}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {course.title}
                </h3>

                <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-800/80 text-xs text-slate-600 dark:text-[#9BA6BC] space-y-1">
                  <span className="block font-semibold text-slate-800 dark:text-slate-300">Eligibility Requirement:</span>
                  <p className="text-[11px] leading-relaxed">{course.eligibility}</p>
                </div>

                <div className="mt-4">
                  <span className="text-[11px] font-mono text-slate-500 dark:text-[#9BA6BC] uppercase tracking-wider block mb-2">
                    Key Competencies
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {course.outcomes.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#0284C7] dark:text-[#36D9FF] shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-600 dark:text-[#9BA6BC]">
                <span>Credits: <strong className="text-slate-900 dark:text-white font-mono">{course.credits}</strong></span>
                <span className="text-[#0284C7] dark:text-[#36D9FF] font-medium">Curriculum 2026</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
