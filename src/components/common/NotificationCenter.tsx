import React from 'react';
import { X, Bell, CheckCircle2, AlertTriangle, FileText, Award } from 'lucide-react';
import { AppNotification } from '../../types';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllAsRead: () => void;
  onClear: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onClear,
}) => {
  if (!isOpen) return null;

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'attendance_warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'assignment':
        return <FileText className="w-4 h-4 text-[#36D9FF]" />;
      case 'result':
        return <Award className="w-4 h-4 text-[#B46AFF]" />;
      default:
        return <Bell className="w-4 h-4 text-[#9BA6BC]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-[#101629] border border-[#36D9FF]/20 rounded-2xl shadow-2xl overflow-hidden mt-12 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Bell className="w-4 h-4 text-[#36D9FF]" />
            <h3 className="text-base font-semibold text-white">Notifications</h3>
            <span className="text-xs font-mono text-[#9BA6BC] bg-slate-800 px-2 py-0.5 rounded-full">
              {notifications.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#9BA6BC] hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Bar */}
        <div className="px-5 py-2.5 bg-[#080B14]/60 border-b border-slate-800 flex items-center justify-between text-xs text-[#9BA6BC]">
          <button
            onClick={onMarkAllAsRead}
            className="hover:text-[#36D9FF] flex items-center gap-1 transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Mark all read</span>
          </button>
          <button
            onClick={onClear}
            className="hover:text-red-400 transition-colors"
          >
            Clear all
          </button>
        </div>

        {/* List */}
        <div className="overflow-y-auto p-4 space-y-3 flex-1 divide-y divide-slate-800/40">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-[#9BA6BC]">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-30 text-[#36D9FF]" />
              <p className="text-sm">No new notifications</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`pt-3 first:pt-0 flex items-start gap-3 transition-opacity ${
                  n.isRead ? 'opacity-60' : 'opacity-100'
                }`}
              >
                <div className="mt-0.5 p-2 rounded-lg bg-slate-900 border border-slate-800 shrink-0">
                  {getIcon(n.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <h4 className="text-xs font-semibold text-white truncate">{n.title}</h4>
                    <span className="text-[10px] font-mono text-[#9BA6BC] shrink-0">{n.createdAt}</span>
                  </div>
                  <p className="text-xs text-[#9BA6BC] mt-1 leading-relaxed">{n.message}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
