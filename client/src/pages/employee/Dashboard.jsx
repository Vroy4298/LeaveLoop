import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatusBadge from '../../components/common/StatusBadge';
import API from '../../api/axios';
import { CalendarDays, Receipt, Clock, CheckCircle, Umbrella } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="card flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
            <Icon size={22} className="text-white" />
        </div>
        <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{title}</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
        </div>
    </div>
);

const BalanceBar = ({ label, used, total, color }) => {
    const remaining = Math.max(0, total - used);
    const pct = total > 0 ? (remaining / total) * 100 : 0;
    return (
        <div>
            <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-600 dark:text-slate-300">{label}</span>
                <span className="text-slate-400">{remaining} / {total} days left</span>
            </div>
            <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-700 ${color}`}
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
};

const EmployeeDashboard = () => {
    const [leaves, setLeaves] = useState([]);
    const [reimbursements, setReimbursements] = useState([]);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [lRes, rRes, pRes] = await Promise.all([
                    API.get('/leaves/my'),
                    API.get('/reimbursements/my'),
                    API.get('/auth/me'),
                ]);
                setLeaves(lRes.data.leaves);
                setReimbursements(rRes.data.reimbursements);
                setProfile(pRes.data.user);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const count = (arr, status) => arr.filter(i => i.status === status).length;

    // Calculate used days per type from approved leaves
    const usedDays = (type) => leaves
        .filter(l => l.leaveType === type && l.status === 'Approved')
        .reduce((sum, l) => {
            const d = Math.ceil((new Date(l.toDate) - new Date(l.fromDate)) / (1000 * 60 * 60 * 24)) + 1;
            return sum + d;
        }, 0);

    const balance = profile?.leaveBalance || { Annual: 15, Sick: 10, Casual: 7 };

    return (
        <DashboardLayout title="Dashboard">
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                        <StatCard title="Total Leaves" value={leaves.length} icon={CalendarDays} color="bg-blue-500" />
                        <StatCard title="Pending Leaves" value={count(leaves, 'Pending')} icon={Clock} color="bg-amber-500" />
                        <StatCard title="Approved Leaves" value={count(leaves, 'Approved')} icon={CheckCircle} color="bg-emerald-500" />
                        <StatCard title="Total Reimbursements" value={reimbursements.length} icon={Receipt} color="bg-violet-500" />
                    </div>

                    {/* Leave Balance Widget */}
                    <div className="card">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-sky-100 dark:bg-sky-900/30 rounded-xl flex items-center justify-center">
                                <Umbrella size={20} className="text-sky-600 dark:text-sky-400" />
                            </div>
                            <div>
                                <h2 className="section-title">Leave Balance</h2>
                                <p className="text-xs text-slate-400">Annual quota remaining for this year</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <BalanceBar
                                label="Annual Leave"
                                used={usedDays('Annual')}
                                total={balance.Annual ?? 15}
                                color="bg-blue-500"
                            />
                            <BalanceBar
                                label="Sick Leave"
                                used={usedDays('Sick')}
                                total={balance.Sick ?? 10}
                                color="bg-rose-500"
                            />
                            <BalanceBar
                                label="Casual Leave"
                                used={usedDays('Casual')}
                                total={balance.Casual ?? 7}
                                color="bg-amber-500"
                            />
                        </div>
                    </div>

                    {/* Recent Leaves */}
                    <div className="card">
                        <h2 className="section-title mb-4">Recent Leave Requests</h2>
                        {leaves.length === 0 ? (
                            <p className="text-slate-400 text-sm text-center py-8">No leave requests yet.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-100">
                                            <th className="text-left py-3 px-2 text-slate-500 font-medium">Type</th>
                                            <th className="text-left py-3 px-2 text-slate-500 font-medium">From</th>
                                            <th className="text-left py-3 px-2 text-slate-500 font-medium">To</th>
                                            <th className="text-left py-3 px-2 text-slate-500 font-medium">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {leaves.slice(0, 5).map(l => (
                                            <tr key={l._id} className="border-b border-slate-50 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                                <td className="py-3 px-2 font-medium text-slate-700 dark:text-slate-200">{l.leaveType}</td>
                                                <td className="py-3 px-2 text-slate-500 dark:text-slate-400">{new Date(l.fromDate).toLocaleDateString()}</td>
                                                <td className="py-3 px-2 text-slate-500 dark:text-slate-400">{new Date(l.toDate).toLocaleDateString()}</td>
                                                <td className="py-3 px-2"><StatusBadge status={l.status} /></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Recent Reimbursements */}
                    <div className="card">
                        <h2 className="section-title mb-4">Recent Reimbursements</h2>
                        {reimbursements.length === 0 ? (
                            <p className="text-slate-400 text-sm text-center py-8">No reimbursements yet.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-100">
                                            <th className="text-left py-3 px-2 text-slate-500 font-medium">Title</th>
                                            <th className="text-left py-3 px-2 text-slate-500 font-medium">Amount</th>
                                            <th className="text-left py-3 px-2 text-slate-500 font-medium">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reimbursements.slice(0, 5).map(r => (
                                            <tr key={r._id} className="border-b border-slate-50 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                                <td className="py-3 px-2 font-medium text-slate-700 dark:text-slate-200">{r.title}</td>
                                                <td className="py-3 px-2 text-slate-500 dark:text-slate-400">₹{r.amount.toLocaleString()}</td>
                                                <td className="py-3 px-2"><StatusBadge status={r.status} /></td>
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

export default EmployeeDashboard;
