import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatusBadge from '../../components/common/StatusBadge';
import API from '../../api/axios';
import { CalendarDays, Receipt, Clock, CheckCircle } from 'lucide-react';

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

const EmployeeDashboard = () => {
    const [leaves, setLeaves] = useState([]);
    const [reimbursements, setReimbursements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [lRes, rRes] = await Promise.all([
                    API.get('/leaves/my'),
                    API.get('/reimbursements/my'),
                ]);
                setLeaves(lRes.data.leaves);
                setReimbursements(rRes.data.reimbursements);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const count = (arr, status) => arr.filter(i => i.status === status).length;

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
