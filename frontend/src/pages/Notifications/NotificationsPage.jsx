import React, { useState, useEffect } from 'react';
import { notificationService } from '../../services/notificationService.js';
import {
  Bell,
  CheckCheck,
  Trash2,
  AlertCircle,
  HelpCircle,
  Clock
} from 'lucide-react';
import Card, { CardContent } from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Badge from '../../components/ui/Badge.jsx';
import toast from 'react-hot-toast';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await notificationService.getNotifications();
      if (res.success && res.data) {
        setNotifications(res.data.results || []);
      }
      
      const countRes = await notificationService.getUnreadCount();
      if (countRes.success) {
        setUnreadCount(countRes.data.count);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRead = async (id) => {
    try {
      const res = await notificationService.readNotification(id);
      if (res.success) {
        toast.success('Notification marked as read');
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await notificationService.deleteNotification(id);
      if (res.success) {
        toast.success('Notification deleted');
        setNotifications(prev => prev.filter(n => n._id !== id));
        // Update unread count if the deleted one was unread
        const deleted = notifications.find(n => n._id === id);
        if (deleted && !deleted.isRead) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const markAllRead = async () => {
    const unread = notifications.filter(n => !n.isRead);
    if (unread.length === 0) return;
    
    try {
      // Loop over and mark read
      await Promise.all(unread.map(n => notificationService.readNotification(n._id)));
      toast.success('All marked as read');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-800 dark:text-slate-100">Notifications</h2>
          <p className="text-xs text-slate-400">Review system warnings, habit reminders, and alerts.</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead} className="flex items-center space-x-1">
            <CheckCheck className="h-4 w-4" />
            <span>Mark all read</span>
          </Button>
        )}
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-20 bg-cardBg-light dark:bg-cardBg-dark border border-borderCol-light dark:border-borderCol-dark rounded-2xl">
          <p className="text-sm text-slate-400">Your notification inbox is currently empty.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notif) => {
            return (
              <Card
                key={notif._id}
                className={`border transition-all ${
                  notif.isRead 
                    ? 'border-borderCol-light dark:border-borderCol-dark opacity-60' 
                    : 'border-primary/20 bg-primary/5 dark:bg-primary/5'
                }`}
              >
                <CardContent className="flex items-start justify-between space-x-4">
                  <div className="flex items-start space-x-3.5 min-w-0">
                    <div className={`p-2.5 rounded-xl mt-0.5 ${
                      notif.isRead 
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-400' 
                        : 'bg-primary/20 text-primary'
                    }`}>
                      <Bell className="h-4 w-4" />
                    </div>
                    <div className="truncate text-left space-y-1">
                      <div className="flex items-center space-x-2 flex-wrap">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">{notif.title}</h4>
                        {!notif.isRead && (
                          <Badge variant="success" className="text-[9px] py-0">New</Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed font-medium whitespace-pre-wrap">
                        {notif.message}
                      </p>
                      <p className="text-[9px] text-slate-400 flex items-center font-bold">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{new Date(notif.createdAt).toLocaleString()}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    {!notif.isRead && (
                      <button
                        onClick={() => handleRead(notif._id)}
                        className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                        title="Mark read"
                      >
                        <CheckCheck className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(notif._id)}
                      className="p-1.5 text-slate-400 hover:text-danger hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-all"
                      title="Delete notification"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
