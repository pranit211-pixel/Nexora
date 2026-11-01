import React, { useState } from 'react';
import { Bell, Search, Pin, Calendar, ArrowRight, X } from 'lucide-react';
import { Notice } from '../../types';

interface NoticesSectionProps {
  notices: Notice[];
}

export const NoticesSection: React.FC<NoticesSectionProps> = ({ notices }) => {
  const [filter, setFilter] = useState<'all' | 'examination' | 'academic' | 'events' | 'general'>('all');
  const [search, setSearch] = useState('');
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  const filtered = notices.filter((n) => {
    const matchesFilter = filter === 'all' || n.category === filter;
    const matchesSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase()) ||
      n.publishedBy.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <section id="notices" className="py-20 border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#080B14] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#0284C7] dark:text-[#36D9FF] mb-2">
              <span>Official Communications</span>
              <span aria-hidden="true">·</span>
              <span>Live Circulars</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
              Institutional Notice Board
            </h2>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 dark:text-[#9BA6BC] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search circulars, exams, events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 dark:bg-[#101629] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#36D9FF] transition-colors"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {(['all', 'examination', 'academic', 'events', 'general'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all capitalize ${
                filter === cat
                  ? 'bg-[#36D9FF]/20 text-[#0284C7] dark:text-[#36D9FF] border border-[#36D9FF]/40 font-semibold'
                  : 'bg-slate-100 dark:bg-[#101629] text-slate-600 dark:text-[#9BA6BC] hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
              }`}
            >
              {cat === 'all' ? 'All Notices' : cat}
            </button>
          ))}
        </div>

        {/* Notices Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-500 dark:text-[#9BA6BC] bg-slate-50 dark:bg-[#101629]/40 rounded-xl border border-slate-200 dark:border-slate-800">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-30 text-[#0284C7] dark:text-[#36D9FF]" />
              <p className="text-sm">No circulars found matching your search</p>
            </div>
          ) : (
            filtered.map((notice) => (
              <div
                key={notice.id}
                onClick={() => setSelectedNotice(notice)}
                className={`p-5 rounded-2xl bg-slate-50/70 dark:bg-[#101629]/70 border transition-all cursor-pointer flex flex-col justify-between ${
                  notice.isPinned
                    ? 'border-[#36D9FF]/40 shadow-sm dark:shadow-[0_0_20px_-5px_rgba(54,217,255,0.15)]'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-[#9BA6BC]">
                      <span className="capitalize text-[#0284C7] dark:text-[#36D9FF] font-semibold">{notice.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>Audience: {notice.targetAudience}</span>
                    </div>
                    {notice.isPinned && (
                      <span className="flex items-center gap-1 text-[11px] font-mono text-[#0284C7] dark:text-[#36D9FF]">
                        <Pin className="w-3 h-3 rotate-45" />
                        <span>Pinned</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug hover:text-[#0284C7] dark:hover:text-[#36D9FF] transition-colors">
                    {notice.title}
                  </h3>

                  <p className="mt-2 text-xs text-slate-600 dark:text-[#9BA6BC] leading-relaxed line-clamp-2">
                    {notice.content}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-[#9BA6BC]">
                  <span>{notice.publishedBy}</span>
                  <div className="flex items-center gap-1 text-[#0284C7] dark:text-[#36D9FF] font-medium">
                    <span>Read circular</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Notice Detail Modal */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-[#101629] border border-slate-200 dark:border-[#36D9FF]/30 rounded-2xl shadow-2xl p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <span className="text-xs font-mono text-[#0284C7] dark:text-[#36D9FF] uppercase tracking-wider block mb-1">
                  {selectedNotice.category} Circular
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{selectedNotice.title}</h3>
              </div>
              <button
                onClick={() => setSelectedNotice(null)}
                className="p-1.5 text-slate-500 dark:text-[#9BA6BC] hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed mb-5">
              {selectedNotice.content}
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-[#9BA6BC]">
              <div>
                <span className="block font-medium text-slate-800 dark:text-slate-200">Issued by:</span>
                <span>{selectedNotice.publishedBy}</span>
              </div>
              <span className="font-mono">{selectedNotice.date}</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
