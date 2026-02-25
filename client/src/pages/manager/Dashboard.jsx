import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatusBadge from '../../components/common/StatusBadge';
import API from '../../api/axios';
import { Users, CheckSquare, Receipt, Clock } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="card flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
            <Icon size={22} className="text-white" />
        </div>
        <div>
            <p className="text-sm text-slate-500 font-medium">{title}</p>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
        </div>
    </div>
);

const ManagerDashboard = () => {
    const [leaves, setLeaves] = useState([]);
    const [reimbursements, setReimbursements] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            API.get('/leaves'),
            API.get('/reimbursements'),
            API.get('/users'),
        ]).then(([l, r, u]) => {
            setLeaves(l.data.leaves);
            setReimbursements(r.data.reimbursements);
            setUsers(u.data.users);
        }).finally(() => setLoading(false));
    }, []);

    const pending = (arr) => arr.filter(i => i.status === 'Pending').length;

    return (
        <DashboardLayout title="Manager Dashboard">
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                        <StatCard title="Total Employees" value={users.length} icon={Users} color="bg-indigo-500" />
                        <StatCard title="Pending Leaves" value={pending(leaves)} icon={Clock} color="bg-amber-500" />
                        <StatCard title="Pending Expenses" value={pending(reimbursements)} icon={Receipt} color="bg-violet-500" />
                        <StatCard title="Total Leaves" value={leaves.length} icon={CheckSquare} color="bg-emerald-500" />
                    </div>

                    {/* Pending Leave Requests */}
                    <div className="card">
                        <h2 className="section-title mb-4">Pending Leave Requests</h2>
                        {leaves.filter(l => l.status === 'Pending').length === 0 ? (
                            <p className="text-slate-400 text-sm text-center py-6">No pending leave requests.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-100">
                                            {['Employee', 'Type', 'From', 'To', 'Status'].map(h => (
                                                <th key={h} className="text-left py-3 px-3 text-slate-500 font-medium">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {leaves.filter(l => l.status === 'Pending').slice(0, 6).map(l => (
                                            <tr key={l._id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                                <td className="py-3 px-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold text-xs">
                                                            {l.user?.name?.[0]?.toUpperCase()}
                                                        </div>
                                                        <span className="font-medium text-slate-700">{l.user?.name}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-3 text-slate-500">{l.leaveType}</td>
                                                <td className="py-3 px-3 text-slate-500">{new Date(l.fromDate).toLocaleDateString()}</td>
                                                <td className="py-3 px-3 text-slate-500">{new Date(l.toDate).toLocaleDateString()}</td>
                                                <td className="py-3 px-3"><StatusBadge status={l.status} /></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Pending Reimbursements */}
                    <div className="card">
                        <h2 className="section-title mb-4">Pending Expense Claims</h2>
                        {reimbursements.filter(r => r.status === 'Pending').length === 0 ? (
                            <p className="text-slate-400 text-sm text-center py-6">No pending expense claims.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-100">
                                            {['Employee', 'Title', 'Amount', 'Status'].map(h => (
                                                <th key={h} className="text-left py-3 px-3 text-slate-500 font-medium">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reimbursements.filter(r => r.status === 'Pending').slice(0, 6).map(r => (
                                            <tr key={r._id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                                <td className="py-3 px-3 font-medium text-slate-700">{r.user?.name}</td>
                                                <td className="py-3 px-3 text-slate-500">{r.title}</td>
                                                <td className="py-3 px-3 font-semibold text-slate-700">₹{r.amount.toLocaleString()}</td>
                                                <td className="py-3 px-3"><StatusBadge status={r.status} /></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default ManagerDashboard;
