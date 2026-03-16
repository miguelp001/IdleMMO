import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';

export const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useGame();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '📢';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-green-500 bg-green-900/20';
      case 'error':
        return 'border-red-500 bg-red-900/20';
      case 'warning':
        return 'border-yellow-500 bg-yellow-900/20';
      case 'info':
        return 'border-blue-500 bg-blue-900/20';
      default:
        return 'border-gray-500 bg-gray-900/20';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={`p-4 rounded-lg border-2 shadow-lg backdrop-blur-sm ${getNotificationColor(
              notification.type
            )}`}
          >
            <div className="flex items-start space-x-3">
              <span className="text-xl flex-shrink-0">
                {getNotificationIcon(notification.type)}
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white text-sm mb-1">
                  {notification.title}
                </h3>
                <p className="text-dark-300 text-sm leading-relaxed">
                  {notification.message}
                </p>
                {notification.actions && notification.actions.length > 0 && (
                  <div className="flex space-x-2 mt-3">
                    {notification.actions.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          action.action();
                          removeNotification(notification.id);
                        }}
                        className="px-3 py-1 text-xs bg-dark-700 hover:bg-dark-600 text-white rounded transition-colors"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="text-dark-400 hover:text-white transition-colors flex-shrink-0"
              >
                ✕
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}; 