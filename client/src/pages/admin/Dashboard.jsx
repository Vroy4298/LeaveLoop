import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatusBadge from '../../components/common/StatusBadge';
import API from '../../api/axios';
import { Users, CalendarDays, Receipt, ShieldCheck } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color, sub }) => (
    <div className="card flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
            <Icon size={22} className="text-white" />
        </div>
        <div>
            <p className="text-sm text-slate-500 font-medium">{title}</p>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
            {sub && <p className="text-xs text-slate-400">{sub}</p>}
        </div>
    </div>
);

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [leaves, setLeaves] = useState([]);
    const [reimb, setReimb] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([API.get('/users'), API.get('/leaves'), API.get('/reimbursements')])
            .then(([u, l, r]) => {
                setUsers(u.data.users);
                setLeaves(l.data.leaves);
                setReimb(r.data.reimbursements);
            })
            .finally(() => setLoading(false));
    }, []);

    const roleCount = (role) => users.filter(u => u.role === role).length;
    const totalApproved = reimb.filter(r => r.status === 'Approved').reduce((s, r) => s + r.amount, 0);

    return (
        <DashboardLayout title="Admin Dashboard">
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                        <StatCard title="Total Users" value={users.length} icon={Users} color="bg-indigo-500" sub={`${roleCount('employee')} emp · ${roleCount('manager')} mgr`} />
                        <StatCard title="Total Leaves" value={leaves.length} icon={CalendarDays} color="bg-blue-500" sub={`${leaves.filter(l => l.status === 'Pending').length} pending`} />
                        <StatCard title="Total Claims" value={reimb.length} icon={Receipt} color="bg-violet-500" sub={`₹${totalApproved.toLocaleString()} approved`} />
                        <StatCard title="Admins" value={roleCount('admin')} icon={ShieldCheck} color="bg-rose-500" />
                    </div>

                    {/* Role breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { role: 'admin', label: 'Admins', color: 'from-rose-500 to-pink-600' },
                            { role: 'manager', label: 'Managers', color: 'from-violet-500 to-purple-600' },
                            { role: 'employee', label: 'Employees', color: 'from-blue-500 to-indigo-600' },
                        ].map(({ role, label, color }) => (
                            <div key={role} className={`rounded-2xl bg-gradient-to-br ${color} p-6 text-white shadow-lg`}>
                                <p className="text-white/70 text-sm font-medium">{label}</p>
                                <p className="text-4xl font-bold mt-1">{roleCount(role)}</p>
                                <p className="text-white/60 text-xs mt-1 capitalize">{role} accounts</p>
                            </div>
                        ))}
                    </div>

                    {/* Recent Users */}
                    <div className="card">
                        <h2 className="section-title mb-4">Recently Joined Users</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-100">
                                        {['Name', 'Email', 'Role', 'Department', 'Joined'].map(h => (
                                            <th key={h} className="text-left py-3 px-3 text-slate-500 font-medium">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.slice(0, 8).map(u => (
                                        <tr key={u._id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                            <td className="py-3 px-3 font-medium text-slate-700">{u.name}</td>
                                            <td className="py-3 px-3 text-slate-500">{u.email}</td>
                                            <td className="py-3 px-3">
                                                <StatusBadge status={u.role === 'admin' ? 'Approved' : u.role === 'manager' ? 'Pending' : 'Rejected'} />
                                            </td>
                                            <td className="py-3 px-3 text-slate-400">{u.department || '—'}</td>
                                            <td className="py-3 px-3 text-slate-400 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default AdminDashboard;
