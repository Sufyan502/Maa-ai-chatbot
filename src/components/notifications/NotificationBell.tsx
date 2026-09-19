import React, { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { AppNotification, NotificationType } from '../../types';
import {
  Bell,
  MessageSquare,
  LifeBuoy,
  BookOpen,
  AlertCircle,
  Check,
  Trash2,
  Volume2,
  VolumeX,
  Sparkles,
  ExternalLink,
  SlidersHorizontal,
  X
} from 'lucide-react';

interface NotificationBellProps {
  onNavigate?: (route: any, payload?: string) => void;
  className?: string;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
  onNavigate,
  className = ''
}) => {
  const {
    notifications,
    unreadCount,
    soundEnabled,
    toggleSound,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    simulateAlert
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    return true;
  });

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

  const handleItemClick = (notif: AppNotification) => {
    markAsRead(notif.id);
    if (notif.actionRoute && onNavigate) {
      setIsOpen(false);
      onNavigate(notif.actionRoute, notif.actionPayload);
    }
  };

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / (1000 * 60));
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
        className={`relative p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
          isOpen
            ? 'bg-[#1D2533] border-cyan-400/50 text-cyan-300 shadow-md shadow-cyan-950/40'
            : 'bg-[#111722] hover:bg-[#161F2E] border-[#1D2533] hover:border-[#2A374A] text-[#8994A7] hover:text-white'
        }`}
        title={`Notifications (${unreadCount} unread)`}
      >
        <Bell className="w-4 h-4" />

        {/* Pulsing Unread Badge Counter */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-rose-600 text-[10px] font-bold text-white shadow-lg shadow-rose-900/60 ring-2 ring-[#080C14] animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Center Dropdown Drawer (Fully responsive across all screen sizes) */}
      {isOpen && (
        <div className="fixed sm:absolute right-2 sm:right-0 top-16 sm:top-auto sm:mt-3 w-[calc(100vw-16px)] sm:w-96 max-w-sm bg-[#0B101B]/95 backdrop-blur-2xl border border-[#1E293B] rounded-2xl shadow-2xl shadow-black/90 z-[70] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          
          {/* Header */}
          <div className="p-4 border-b border-[#1D2533] bg-[#0E1524]/90 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Bell className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white tracking-tight">
                  Notification Center
                </h3>
                <p className="text-[10px] text-slate-400 font-medium">
                  {unreadCount} unread updates
                </p>
              </div>
            </div>

            {/* Audio Toggle & Quick Actions */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={toggleSound}
                className={`p-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                  soundEnabled
                    ? 'bg-blue-500/15 border-blue-500/30 text-blue-400'
                    : 'bg-[#151D2C] border-[#1D2533] text-slate-400 hover:text-white'
                }`}
                title={soundEnabled ? 'Audio Alerts: ON' : 'Audio Alerts: MUTED'}
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="px-2 py-1 rounded-lg bg-[#151D2C] hover:bg-[#1D273B] border border-[#1D2533] text-[10px] font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                  title="Mark all as read"
                >
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>Mark all read</span>
                </button>
              )}
            </div>
          </div>

          {/* Filter Bar & Test Simulation Controls */}
          <div className="px-4 py-2 border-b border-[#1D2533] bg-[#080C14]/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setFilter('all')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                  filter === 'all'
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                  filter === 'unread'
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Unread ({unreadCount})
              </button>
            </div>

            {/* Test Trigger Button */}
            <button
              onClick={() => {
                const types: NotificationType[] = ['message', 'ticket', 'knowledge', 'alert'];
                const randomType = types[Math.floor(Math.random() * types.length)];
                simulateAlert(randomType);
              }}
              className="px-2 py-0.5 rounded-md bg-[#182234] hover:bg-[#202E45] border border-cyan-500/30 text-[10px] font-medium text-cyan-300 flex items-center gap-1 cursor-pointer transition-colors"
              title="Test auditory & visual notification chime"
            >
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Simulate Alert</span>
            </button>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-[#161E2E]">
            {filteredNotifications.length === 0 ? (
              <div className="py-8 text-center px-4">
                <Bell className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
                <p className="text-xs text-slate-300 font-semibold">No notifications</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  You are all caught up with recent updates.
                </p>
              </div>
            ) : (
              filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleItemClick(notif)}
                  className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer hover:bg-[#121A2A] relative group ${
                    !notif.read ? 'bg-[#101726]/80' : 'bg-transparent'
                  }`}
                >
                  {/* Unread Indicator Bar */}
                  {!notif.read && (
                    <span className="absolute left-0 top-3 bottom-3 w-1 bg-cyan-400 rounded-r-full" />
                  )}

                  {/* Type Icon */}
                  <div className="w-8 h-8 rounded-lg bg-[#162032] border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    {getIcon(notif.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <h4
                        className={`text-xs tracking-tight truncate ${
                          !notif.read ? 'font-bold text-white' : 'font-medium text-slate-300'
                        }`}
                      >
                        {notif.title}
                      </h4>
                      <span className="text-[10px] text-slate-500 shrink-0 font-normal">
                        {formatTime(notif.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {notif.message}
                    </p>

                    {notif.actionRoute && (
                      <div className="mt-1.5 flex items-center gap-1 text-[10px] font-semibold text-cyan-400 group-hover:text-cyan-300">
                        <span>Go to {notif.actionRoute}</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </div>

                  {/* Delete Item Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notif.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 rounded-md hover:bg-rose-500/10 transition-all cursor-pointer shrink-0"
                    title="Delete notification"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-2.5 border-t border-[#1D2533] bg-[#090D16] flex items-center justify-between text-[11px] text-slate-400">
              <span className="text-[10px]">
                {soundEnabled ? '🔊 Sound alerts active' : '🔇 Sound muted'}
              </span>
              <button
                onClick={clearAll}
                className="text-[10px] font-semibold text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
              >
                Clear all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
