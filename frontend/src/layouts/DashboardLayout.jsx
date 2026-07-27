import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { notificationService } from '../services/notificationService.js';
import {
  LayoutDashboard,
  Target,
  Flame,
  Calendar,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Sun,
  Moon,
  Laptop,
  PlusCircle,
  CheckCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

const DashboardLayout = ({ children, onQuickAdd }) => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  
  const location = useLocation();
  const navigate = useNavigate();

  // Load notifications and count periodically
  const fetchNotificationStats = async () => {
    try {
      const countRes = await notificationService.getUnreadCount();
      if (countRes.success) {
        setUnreadCount(countRes.data.count);
      }
      
      const listRes = await notificationService.getNotifications({ limit: 5 });
      if (listRes.success) {
        setNotifications(listRes.data.results);
      }
    } catch (err) {
      console.warn('Silently failed loading notification stats.');
    }
  };

  useEffect(() => {
    fetchNotificationStats();
    const interval = setInterval(fetchNotificationStats, 60000); // refresh every minute
    return () => clearInterval(interval);
  }, []);

  const handleNotificationRead = async (id) => {
    try {
      const res = await notificationService.readNotification(id);
      if (res.success) {
        setUnreadCount(prev => Math.max(0, prev - 1));
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
        toast.success('Notification marked as read');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Goals', path: '/goals', icon: Target },
    { name: 'Habits', path: '/habits', icon: Flame },
    { name: 'Calendar', path: '/calendar', icon: Calendar },
    { name: 'Notes', path: '/notes', icon: FileText },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getPageTitle = () => {
    const matched = menuItems.find(item => item.path === location.pathname);
    if (matched) return matched.name;
    if (location.pathname.startsWith('/goals/')) return 'Goal Details';
    if (location.pathname === '/notifications') return 'Notifications';
    if (location.pathname === '/profile') return 'My Profile';
    return 'GoalFlow';
  };

  return (
    <div className="flex h-screen bg-slateBg-light dark:bg-slateBg-dark text-slate-800 dark:text-slate-100 transition-colors duration-200 overflow-hidden">
      {/* 1. Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-cardBg-light dark:bg-cardBg-dark border-r border-borderCol-light dark:border-borderCol-dark p-5">
        {/* Brand Name */}
        <div className="flex items-center space-x-3 mb-8 px-2">
          <div className="bg-primary p-2 rounded-xl text-white">
            <CheckCircle className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            GoalFlow
          </span>
        </div>

        {/* Links Navigation */}
        <nav className="flex-1 space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-primary/10 text-primary border-l-4 border-primary'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? 'text-primary' : ''}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Card & Logout */}
        <div className="border-t border-borderCol-light dark:border-borderCol-dark pt-4 mt-auto">
          <Link to="/profile" className="flex items-center space-x-3 p-2 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100'}
              alt="Avatar"
              className="h-9 w-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-slate-800 dark:text-slate-100">{user?.name || 'Explorer'}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email || ''}</p>
            </div>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-danger hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-2xl mt-2 transition-all font-medium"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* 2. Mobile Drawer Navigation Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="relative flex flex-col w-64 bg-cardBg-light dark:bg-cardBg-dark border-r border-borderCol-light dark:border-borderCol-dark p-5 z-10 animate-slide-in">
            <div className="flex items-center justify-between mb-8 px-2">
              <div className="flex items-center space-x-3">
                <div className="bg-primary p-2 rounded-xl text-white">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <span className="text-lg font-bold text-slate-800 dark:text-slate-100">GoalFlow</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 space-y-1.5">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                      active ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-borderCol-light dark:border-borderCol-dark pt-4 mt-auto">
              <Link to="/profile" onClick={() => setSidebarOpen(false)} className="flex items-center space-x-3 p-2 rounded-2xl hover:bg-slate-100">
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100'}
                  alt="Avatar"
                  className="h-9 w-9 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{user?.name}</p>
                  <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-danger hover:bg-rose-50 rounded-2xl mt-2 font-medium"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* 3. Main Workspace Container */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 border-b border-borderCol-light dark:border-borderCol-dark bg-cardBg-light dark:bg-cardBg-dark px-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-500 hover:text-slate-700">
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-base font-bold text-slate-800 dark:text-slate-100">
              {getPageTitle()}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* Quick Add Goal Trigger */}
            {onQuickAdd && (
              <button
                onClick={onQuickAdd}
                className="hidden md:inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-primary hover:bg-primary-dark text-white rounded-2xl shadow-soft"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Quick Add</span>
              </button>
            )}

            {/* Theme Swapper dropdown triggers */}
            <div className="flex items-center space-x-1 border border-borderCol-light dark:border-borderCol-dark rounded-xl p-0.5 bg-slate-50 dark:bg-slate-900">
              <button
                onClick={() => setTheme('light')}
                className={`p-1.5 rounded-lg transition-all ${theme === 'light' ? 'bg-white dark:bg-slate-800 shadow text-amber-500' : 'text-slate-400 hover:text-slate-600'}`}
                title="Light Mode"
              >
                <Sun className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`p-1.5 rounded-lg transition-all ${theme === 'dark' ? 'bg-white dark:bg-slate-800 shadow text-indigo-500' : 'text-slate-400 hover:text-slate-600'}`}
                title="Dark Mode"
              >
                <Moon className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setTheme('system')}
                className={`p-1.5 rounded-lg transition-all ${theme === 'system' ? 'bg-white dark:bg-slate-800 shadow text-slate-600' : 'text-slate-400 hover:text-slate-600'}`}
                title="System Mode"
              >
                <Laptop className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Notifications Dropdown Container */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="relative p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-danger animate-pulse" />
                )}
              </button>

              {notifDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setNotifDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-80 bg-cardBg-light dark:bg-cardBg-dark border border-borderCol-light dark:border-borderCol-dark rounded-2xl shadow-xl z-30 p-4">
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">Unread Alerts</h4>
                      <Link to="/notifications" onClick={() => setNotifDropdownOpen(false)} className="text-[10px] text-primary font-bold hover:underline">
                        View All
                      </Link>
                    </div>
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-4">No recent notifications</p>
                    ) : (
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {notifications.map((notif) => (
                          <div
                            key={notif._id}
                            className={`p-2 rounded-xl border text-left transition-all ${
                              notif.isRead 
                                ? 'bg-transparent border-slate-100 dark:border-slate-800 opacity-60' 
                                : 'bg-primary/5 border-primary/20 hover:bg-primary/10'
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate w-4/5">{notif.title}</p>
                              {!notif.isRead && (
                                <button
                                  onClick={() => handleNotificationRead(notif._id)}
                                  className="text-[10px] text-primary hover:underline font-semibold"
                                >
                                  Read
                                </button>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">{notif.message}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Inner Component Render Panel */}
        <main className="flex-1 overflow-y-auto p-6 bg-slateBg-light dark:bg-slateBg-dark">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
