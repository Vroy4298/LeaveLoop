import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard, User, CalendarDays, Clock, Receipt,
    FileText, Users, CheckSquare, LogOut, ChevronRight, Building2,
} from 'lucide-react';

const employeeLinks = [
    { to: '/employee', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/employee/profile', label: 'My Profile', icon: User },
    { to: '/employee/apply-leave', label: 'Apply Leave', icon: CalendarDays },
    { to: '/employee/leave-history', label: 'Leave History', icon: Clock },
    { to: '/employee/submit-reimbursement', label: 'Submit Expense', icon: Receipt },
    { to: '/employee/reimbursement-history', label: 'Expense History', icon: FileText },
];

const managerLinks = [
    { to: '/manager', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/manager/leave-approval', label: 'Leave Approvals', icon: CheckSquare },
    { to: '/manager/reimbursement-approval', label: 'Expense Approvals', icon: Receipt },
    { to: '/manager/employees', label: 'Employees', icon: Users },
];

const adminLinks = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/users', label: 'User Management', icon: Users },
];

const roleLinks = { employee: employeeLinks, manager: managerLinks, admin: adminLinks };
const roleColors = { employee: 'from-blue-600 to-indigo-700', manager: 'from-violet-600 to-purple-700', admin: 'from-rose-600 to-pink-700' };
const roleLabel = { employee: 'Employee Portal', manager: 'Manager Portal', admin: 'Admin Portal' };

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const links = roleLinks[user?.role] || [];

    const handleLogout = () => { logout(); navigate('/login'); };

    return (
        <aside className="w-64 min-h-screen bg-sidebar flex flex-col shadow-xl">
            {/* Brand */}
            <div className={`p-6 bg-gradient-to-br ${roleColors[user?.role]}`}>
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                        <Building2 size={20} className="text-white" />
                    </div>
                    <div>
                        <p className="text-white font-bold text-sm leading-tight">HR Portal</p>
                        <p className="text-white/70 text-xs">{roleLabel[user?.role]}</p>
                    </div>
                </div>
            </div>

            {/* User Info */}
            <div className="px-4 py-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                        {user?.profilePhoto
                            ? <img src={user.profilePhoto} alt="avatar" className="w-9 h-9 rounded-full object-cover" />
                            : <span className="text-white font-semibold text-sm">{user?.name?.[0]?.toUpperCase()}</span>
                        }
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-white text-sm font-semibold truncate">{user?.name}</p>
                        <p className="text-slate-400 text-xs capitalize truncate">{user?.role}</p>
                    </div>
                </div>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                {links.map(({ to, label, icon: Icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={to === '/employee' || to === '/manager' || to === '/admin'}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group
               ${isActive
                                ? 'bg-white/10 text-white'
                                : 'text-slate-400 hover:bg-white/5 hover:text-white'}`
                        }
                    >
                        <Icon size={17} className="flex-shrink-0" />
                        <span className="flex-1">{label}</span>
                        <ChevronRight size={14} className="opacity-0 group-hover:opacity-50 transition-opacity" />
                    </NavLink>
                ))}
            </nav>

            {/* Logout */}
            <div className="px-3 py-4 border-t border-white/5">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 text-sm font-medium transition-all duration-150"
                >
                    <LogOut size={17} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
