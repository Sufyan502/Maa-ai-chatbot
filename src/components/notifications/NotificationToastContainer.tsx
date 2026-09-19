import React from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { AppNotification } from '../../types';
import {
  Bell,
  MessageSquare,
  LifeBuoy,
  BookOpen,
  AlertCircle,
  CheckCircle2,
  X,
  Volume2,
  ExternalLink
} from 'lucide-react';

interface NotificationToastContainerProps {
  onNavigate?: (route: any, payload?: string) => void;
}

export const NotificationToastContainer: React.FC<NotificationToastContainerProps> = ({
  onNavigate
}) => {
  const { toasts, dismissToast, markAsRead, soundEnabled } = useNotifications();

  if (toasts.length === 0) return null;

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="w-4 h-4 text-blue-400" />;
      case 'ticket':
        return <LifeBuoy className="w-4 h-4 text-emerald-400" />;
      case 'knowledge':
        return <BookOpen className="w-4 h-4 text-cyan-400" />;
      case 'alert':
        return <AlertCircle className="w-4 h-4 text-amber-400" />;
      default:
        return <Bell className="w-4 h-4 text-purple-400" />;
    }
  };

  const getSeverityStyle = (severity: AppNotification['severity']) => {
    switch (severity) {
      case 'success':
        return 'border-emerald-500/40 bg-emerald-950/20';
      case 'warning':
        return 'border-amber-500/40 bg-amber-950/20';
      case 'error':
        return 'border-rose-500/40 bg-rose-950/20';
      default:
        return 'border-blue-500/40 bg-blue-950/20';
    }
  };

  const handleClickToast = (notif: AppNotification) => {
    markAsRead(notif.id);
    dismissToast(notif.id);
    if (notif.actionRoute && onNavigate) {
      onNavigate(notif.actionRoute, notif.actionPayload);
    }
  };

  return (
    <div
      aria-live="polite"
      className="fixed top-20 right-4 sm:right-6 z-[60] flex flex-col gap-3 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto w-full p-4 rounded-2xl bg-[#0E1524]/95 backdrop-blur-xl border ${getSeverityStyle(
            toast.severity
          )} shadow-2xl shadow-black/80 flex items-start gap-3.5 transition-all duration-300 animate-in fade-in slide-in-from-top-3 group cursor-pointer hover:border-cyan-400/60`}
          onClick={() => handleClickToast(toast)}
        >
          {/* Leading Icon with pulsing aura */}
          <div className="w-9 h-9 rounded-xl bg-[#151E30] border border-white/10 flex items-center justify-center shrink-0 shadow-inner relative">
            {getIcon(toast.type)}
            {soundEnabled && (
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
            )}
          </div>

          {/* Toast Message Body */}
          <div className="flex-1 min-w-0 pr-1">
            <div className="flex items-center justify-between gap-1 mb-0.5">
              <h4 className="text-xs font-bold text-white tracking-tight truncate">
                {toast.title}
              </h4>
              <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                Just now
              </span>
            </div>
            <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
              {toast.message}
            </p>

            {toast.actionRoute && (
              <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-cyan-400 group-hover:text-cyan-300">
                <span>Open in {toast.actionRoute}</span>
                <ExternalLink className="w-3 h-3" />
              </div>
            )}
          </div>

          {/* Dismiss Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              dismissToast(toast.id);
            }}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer shrink-0"
            title="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
