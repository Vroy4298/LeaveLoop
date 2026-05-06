import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Bell, Sun, Moon, CheckCheck, X } from 'lucide-react';
import API from '../../api/axios';

const typeStyles = {
    success: 'text-emerald-400',
    warning: 'text-amber-400',
    info:    'text-blue-400',
};

const Navbar = ({ title }) => {
    const { user } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const [notifications, setNotifications] = useState([]);
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    // Fetch notifications
    useEffect(() => {
        const fetchNotifs = async () => {
            try {
                const { data } = await API.get('/notifications');
                setNotifications(data.notifications);
            } catch { /* silently fail */ }
        };
        fetchNotifs();
        const interval = setInterval(fetchNotifs, 30000); // poll every 30s
        return () => clearInterval(interval);
    }, []);

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const unreadCount = notifications.filter(n => !n.read).length;

    const handleMarkAllRead = async () => {
        try {
            await API.put('/notifications/read');
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch { /* silently fail */ }
    };

    return (
        <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm transition-colors duration-200">
            <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{title}</h1>
            <div className="flex items-center gap-3">
                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    className="relative p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                    {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </button>

                {/* Notification Bell */}
                <div className="relative" ref={ref}>
                    <button
                        id="notification-bell"
                        onClick={() => setOpen(!open)}
                        className="relative p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        <Bell size={18} />
                        {unreadCount > 0 && (
                            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </button>

                    {open && (
                        <div className="absolute right-0 top-11 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden">
                            {/* Header */}
                            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                                <span className="font-semibold text-sm text-slate-800 dark:text-slate-100">
                                    Notifications {unreadCount > 0 && <span className="ml-1 text-xs text-violet-500">({unreadCount} new)</span>}
                                </span>
                                <div className="flex items-center gap-2">
                                    {unreadCount > 0 && (
                                        <button
                                            onClick={handleMarkAllRead}
                                            title="Mark all as read"
                                            className="p-1.5 text-slate-400 hover:text-emerald-500 rounded-lg transition-colors"
                                        >
                                            <CheckCheck size={14} />
                                        </button>
                                    )}
                                    <button onClick={() => setOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition-colors">
                                        <X size={14} />
                                    </button>
                                </div>
                            </div>

                            {/* Notification list */}
                            <div className="max-h-72 overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="py-8 text-center text-sm text-slate-400">
                                        <Bell size={24} className="mx-auto mb-2 opacity-30" />
                                        No notifications yet
                                    </div>
                                ) : (
                                    notifications.map(n => (
                                        <div key={n._id}
                                            className={`px-4 py-3 border-b border-slate-50 dark:border-slate-700 transition-colors ${n.read ? 'opacity-60' : 'bg-violet-50/30 dark:bg-violet-900/10'}`}
                                        >
                                            <p className={`text-xs font-medium leading-relaxed ${typeStyles[n.type] || 'text-slate-700 dark:text-slate-200'}`}>
                                                {n.message}
                                            </p>
                                            <p className="text-[10px] text-slate-400 mt-1">
                                                {new Date(n.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* User Info */}
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center">
                        {user?.profilePhoto
                            ? <img src={user.profilePhoto} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
                            : <span className="text-white font-semibold text-xs">{user?.name?.[0]?.toUpperCase()}</span>
                        }
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-200 leading-tight">{user?.name}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-400 capitalize">{user?.department || user?.role}</p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
