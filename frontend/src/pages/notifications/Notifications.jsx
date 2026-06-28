import React, { useEffect, useState } from 'react';
import notificationService from '../../services/notificationService.js';
import { format } from 'date-fns';
import { cn } from '../../utils/utils.js';

export function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const data = await notificationService.getNotifications(1, 20);
      setNotifications(data.data.notifications);
    } catch (err) {
      console.error("Failed to load notifications", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => 
        prev.map(n => n._id === id ? { ...n, isRead: true } : n)
      );
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    // In a real app, you'd hit an endpoint to mark all as read.
    // For now, we'll just mock the state update for all unread items.
    const unreadIds = notifications.filter(n => !n.isRead).map(n => n._id);
    for (const id of unreadIds) {
      await handleMarkAsRead(id);
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch (err) {
      console.error("Failed to delete notification", err);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="font-headline font-bold text-2xl text-on-surface tracking-tight mb-1 flex items-center gap-2">
            Inbox
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-primary text-background text-xs font-bold rounded-full">
                {unreadCount} New
              </span>
            )}
          </h2>
          <p className="text-on-surface-variant text-sm">Manage your system alerts and status updates.</p>
        </div>
        
        {unreadCount > 0 && (
          <button 
            onClick={handleMarkAllAsRead}
            className="text-sm font-medium text-primary hover:text-white transition-colors"
          >
            Mark all as read
          </button>
        )}
      </header>

      {/* Notifications Feed */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="py-24 text-center text-on-surface-variant flex flex-col items-center">
             <span className="material-symbols-outlined animate-spin text-[40px] text-primary mb-4">progress_activity</span>
             <p className="text-sm">Syncing inbox...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-surface-container border border-outline-variant rounded-2xl p-16 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[32px] text-on-surface-variant">notifications_off</span>
            </div>
            <h3 className="text-lg font-headline font-semibold text-white mb-2">You're all caught up!</h3>
            <p className="text-sm text-on-surface-variant max-w-sm">There are no new notifications or system alerts at this time.</p>
          </div>
        ) : (
          <div className="bg-surface-container border border-outline-variant rounded-2xl overflow-hidden divide-y divide-outline-variant/50 shadow-sm">
            {notifications.map(notif => (
              <div 
                key={notif._id} 
                className={cn(
                  "p-6 flex flex-col sm:flex-row gap-5 transition-all relative overflow-hidden group", 
                  !notif.isRead ? "bg-surface-container hover:bg-surface-container-high" : "bg-surface-container-low opacity-70 hover:opacity-100"
                )}
              >
                {/* Unread Indicator Line */}
                {!notif.isRead && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                )}

                {/* Icon */}
                <div className={cn("w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-sm", 
                  notif.notificationType === 'downtime_alert' ? "bg-red-500/10 text-red-500 border border-red-500/20" :
                  notif.notificationType === 'recovery_alert' ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                  "bg-primary/10 text-primary border border-primary/20"
                )}>
                   <span className="material-symbols-outlined text-[24px]">
                     {notif.notificationType === 'downtime_alert' ? 'error' : notif.notificationType === 'recovery_alert' ? 'check_circle' : 'notifications'}
                   </span>
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                    <h3 className={cn("font-semibold truncate", !notif.isRead ? "text-white" : "text-on-surface")}>
                      {notif.title}
                    </h3>
                    <span className="text-xs font-mono text-outline whitespace-nowrap">
                      {format(new Date(notif.createdAt), 'MMM dd, HH:mm')}
                    </span>
                  </div>
                  <p className="text-on-surface-variant text-sm leading-relaxed mb-3">
                    {notif.message}
                  </p>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-3 mt-2">
                    {!notif.isRead && (
                      <button 
                        onClick={() => handleMarkAsRead(notif._id)} 
                        className="text-xs font-medium text-primary hover:text-white transition-colors bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded"
                      >
                        Mark as Read
                      </button>
                    )}
                    <button 
                      onClick={() => handleDelete(notif._id)}
                      className="text-xs font-medium text-outline hover:text-red-400 transition-colors bg-surface-container-low hover:bg-red-500/10 px-3 py-1.5 rounded border border-outline-variant/50 hover:border-red-500/20 flex items-center gap-1 opacity-0 group-hover:opacity-100 focus:opacity-100"
                      title="Delete Notification"
                    >
                      <span className="material-symbols-outlined text-[14px]">delete</span>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
