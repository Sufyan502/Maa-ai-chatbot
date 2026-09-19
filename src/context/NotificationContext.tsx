import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppNotification, NotificationType } from '../types';
import { playNotificationSound } from '../utils/soundEffects';

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  toasts: AppNotification[];
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  toggleSound: () => void;
  addNotification: (
    notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'> & {
      id?: string;
      playSound?: boolean;
      showToast?: boolean;
    }
  ) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  dismissToast: (id: string) => void;
  simulateAlert: (type?: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-welcome',
    type: 'system',
    title: 'MaaProject Online',
    message: 'Welcome to the platform. 24/7 AI-guided support and verified public schemes are available.',
    timestamp: Date.now() - 1000 * 60 * 15,
    read: true,
    severity: 'info',
    actionRoute: 'landing'
  },
  {
    id: 'notif-kb-update',
    type: 'knowledge',
    title: 'Knowledge Base Synced',
    message: '10 verified official documentation articles and welfare programs updated.',
    timestamp: Date.now() - 1000 * 60 * 5,
    read: false,
    severity: 'success',
    actionRoute: 'knowledge'
  }
];

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem('maa_notifications');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}
    return INITIAL_NOTIFICATIONS;
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('maa_sound_enabled');
      if (saved !== null) {
        return JSON.parse(saved);
      }
    } catch (e) {}
    return true;
  });

  const [toasts, setToasts] = useState<AppNotification[]>([]);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('maa_notifications', JSON.stringify(notifications));
    } catch (e) {}
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem('maa_sound_enabled', JSON.stringify(soundEnabled));
    } catch (e) {}
  }, [soundEnabled]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Update browser document title with unread counter
  useEffect(() => {
    const originalTitle = 'MaaProject • Intelligent Public Welfare & Support Assistant';
    if (unreadCount > 0) {
      document.title = `(${unreadCount}) New Alert • MaaProject`;
    } else {
      document.title = originalTitle;
    }
  }, [unreadCount]);

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const nextVal = !prev;
      if (nextVal) {
        playNotificationSound('alert', 0.4);
      }
      return nextVal;
    });
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addNotification = useCallback(
    ({
      id,
      type,
      title,
      message,
      severity = 'info',
      actionRoute,
      actionPayload,
      playSound = true,
      showToast = true
    }: Omit<AppNotification, 'id' | 'timestamp' | 'read'> & {
      id?: string;
      playSound?: boolean;
      showToast?: boolean;
    }) => {
      const notifId = id || `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const newNotif: AppNotification = {
        id: notifId,
        type,
        title,
        message,
        timestamp: Date.now(),
        read: false,
        severity,
        actionRoute,
        actionPayload
      };

      setNotifications((prev) => [newNotif, ...prev]);

      // Trigger auditory alert if enabled
      if (playSound && soundEnabled) {
        playNotificationSound(type === 'message' ? 'message' : type === 'ticket' ? 'ticket' : 'alert', 0.45);
      }

      // Trigger visual toast popup
      if (showToast) {
        setToasts((prev) => [newNotif, ...prev.slice(0, 2)]);
        // Auto dismiss after 5 seconds
        setTimeout(() => {
          dismissToast(notifId);
        }, 5000);
      }
    },
    [soundEnabled, dismissToast]
  );

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    dismissToast(id);
  }, [dismissToast]);

  const clearAll = useCallback(() => {
    setNotifications([]);
    setToasts([]);
  }, []);

  const simulateAlert = useCallback(
    (type: NotificationType = 'message') => {
      const templates: Record<NotificationType, { title: string; message: string; severity: 'info' | 'success' | 'warning' | 'error'; actionRoute?: AppNotification['actionRoute'] }> = {
        message: {
          title: 'New AI Response Received',
          message: 'Maa AI has answered your query regarding community healthcare subsidies.',
          severity: 'info',
          actionRoute: 'chat'
        },
        ticket: {
          title: 'Ticket Status Updated: #TK-8402',
          message: 'Your inquiry has been reviewed by District Support. Resolution in progress.',
          severity: 'success',
          actionRoute: 'tickets'
        },
        system: {
          title: 'System Health: Operational',
          message: 'All 10 knowledge vectors and verification nodes are functioning normally.',
          severity: 'info',
          actionRoute: 'landing'
        },
        knowledge: {
          title: 'New Scheme Added to Directory',
          message: 'Senior Citizen Solar Subsidy 2026 guidelines are now searchable.',
          severity: 'success',
          actionRoute: 'knowledge'
        },
        alert: {
          title: 'Urgent Notice Broadcast',
          message: 'Emergency monsoon helpline numbers have been refreshed across all centers.',
          severity: 'warning',
          actionRoute: 'docs'
        }
      };

      const tpl = templates[type] || templates.message;
      addNotification({
        type,
        title: tpl.title,
        message: tpl.message,
        severity: tpl.severity,
        actionRoute: tpl.actionRoute,
        playSound: true,
        showToast: true
      });
    },
    [addNotification]
  );

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        toasts,
        soundEnabled,
        setSoundEnabled,
        toggleSound,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
        dismissToast,
        simulateAlert
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
