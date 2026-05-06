import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatusBadge from '../../components/common/StatusBadge';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { Trash2, Clock } from 'lucide-react';

const LeaveHistory = () => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchLeaves = async () => {
        try {
            const { data } = await API.get('/leaves/my');
            setLeaves(data.leaves);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchLeaves(); }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this leave request?')) return;
        try {
            await API.delete(`/leaves/${id}`);
            toast.success('Leave request deleted');
            setLeaves(prev => prev.filter(l => l._id !== id));
        } catch (err) {
            toast.error(err.response?.data?.message || 'Delete failed');
        }
    };

    return (
        <DashboardLayout title="Leave History">
            <div className="card">
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                        <Clock size={20} className="text-amber-600" />
                    </div>
                    <h2 className="section-title">My Leave Requests</h2>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : leaves.length === 0 ? (
                    <div className="text-center py-12">
                        <Clock size={40} className="text-slate-200 mx-auto mb-3" />
                        <p className="text-slate-400 text-sm">No leave requests found.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-100 dark:border-slate-700">
                                    {['Type', 'From', 'To', 'Days', 'Reason', 'Status', 'Rejection Reason', 'Action'].map(h => (
                                        <th key={h} className="text-left py-3 px-3 text-slate-500 dark:text-slate-400 font-medium">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {leaves.map(l => {
                                    const days = Math.ceil((new Date(l.toDate) - new Date(l.fromDate)) / (1000 * 60 * 60 * 24)) + 1;
                                    return (
                                        <tr key={l._id} className="border-b border-slate-50 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                            <td className="py-3 px-3 font-medium text-slate-700 dark:text-slate-200">{l.leaveType}</td>
                                            <td className="py-3 px-3 text-slate-500 dark:text-slate-400">{new Date(l.fromDate).toLocaleDateString()}</td>
                                            <td className="py-3 px-3 text-slate-500 dark:text-slate-400">{new Date(l.toDate).toLocaleDateString()}</td>
                                            <td className="py-3 px-3 text-slate-500 dark:text-slate-400">{days}d</td>
                                            <td className="py-3 px-3 text-slate-500 max-w-[180px] truncate">{l.reason}</td>
                                            <td className="py-3 px-3"><StatusBadge status={l.status} /></td>
                                            <td className="py-3 px-3 max-w-[180px]">
                                                {l.status === 'Rejected' ? (
                                                    l.rejectionReason ? (
                                                        <span className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded-lg italic block" title={l.rejectionReason}>
                                                            {l.rejectionReason}
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs text-slate-400 italic">No reason provided</span>
                                                    )
                                                ) : (
                                                    <span className="text-slate-300 text-xs">—</span>
                                                )}
                                            </td>
                                            <td className="py-3 px-3">
                                                {l.status === 'Pending' ? (
                                                    <button onClick={() => handleDelete(l._id)}
                                                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete request">
                                                        <Trash2 size={15} />
                                                    </button>
                                                ) : (
                                                    <span className="text-slate-300 text-xs">—</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default LeaveHistory;
