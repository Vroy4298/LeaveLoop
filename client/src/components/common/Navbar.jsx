import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Bell, Sun, Moon } from 'lucide-react';

const Navbar = ({ title }) => {
    const { user } = useAuth();
    const { isDark, toggleTheme } = useTheme();

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

                {/* Bell */}
                <button className="relative p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
                    <Bell size={18} />
                </button>

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
