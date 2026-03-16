import { useState, useCallback } from 'react';
import { Notification } from '../types/game';

export const useNotificationSystem = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto-remove notification after duration
    if (notification.duration) {
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, notification.duration);
    }
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const getNotificationsByType = useCallback((type: Notification['type']) => {
    return notifications.filter(notification => notification.type === type);
  }, [notifications]);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    getNotificationsByType,
  };
}; 