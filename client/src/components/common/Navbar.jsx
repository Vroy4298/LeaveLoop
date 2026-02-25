import { useAuth } from '../../context/AuthContext';
import { Bell } from 'lucide-react';

const Navbar = ({ title }) => {
    const { user } = useAuth();

    return (
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
            <h1 className="text-lg font-semibold text-slate-800">{title}</h1>
            <div className="flex items-center gap-4">
                <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                    <Bell size={18} />
                </button>
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center">
                        {user?.profilePhoto
                            ? <img src={user.profilePhoto} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
                            : <span className="text-white font-semibold text-xs">{user?.name?.[0]?.toUpperCase()}</span>
                        }
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-sm font-medium text-slate-700 leading-tight">{user?.name}</p>
                        <p className="text-xs text-slate-400 capitalize">{user?.department || user?.role}</p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
