import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatusBadge from '../../components/common/StatusBadge';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { CheckSquare, X, Check, AlertCircle } from 'lucide-react';

const RejectModal = ({ onConfirm, onCancel }) => {
    const [reason, setReason] = useState('');
    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                    <div className="w-9 h-9 bg-red-100 rounded-xl flex items-center justify-center">
                        <AlertCircle size={18} className="text-red-500" />
                    </div>
                    <h3 className="font-semibold text-slate-800">Reason for Rejection</h3>
                </div>
                <div className="px-6 py-5 space-y-4">
                    <textarea
                        value={reason}
                        onChange={e => setReason(e.target.value)}
                        rows={3}
                        placeholder="Provide a reason so the employee understands why their leave was rejected…"
                        className="input resize-none text-sm"
                    />
                    <div className="flex gap-3">
                        <button onClick={onCancel} className="btn-secondary flex-1">Cancel</button>
                        <button
                            onClick={() => onConfirm(reason)}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-2 px-4 rounded-xl transition-colors">
                            Confirm Reject
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const LeaveApproval = () => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('Pending');
    const [rejectTarget, setRejectTarget] = useState(null); // id being rejected

    useEffect(() => {
        API.get('/leaves')
            .then(({ data }) => setLeaves(data.leaves))
            .finally(() => setLoading(false));
    }, []);

    const updateStatus = async (id, status, rejectionReason = '') => {
        try {
            const { data } = await API.put(`/leaves/${id}/status`, { status, rejectionReason });
            setLeaves(prev => prev.map(l => l._id === id ? data.leave : l));
            toast.success(`Leave ${status.toLowerCase()} successfully`);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Action failed');
        }
    };

    const handleApprove = (id) => updateStatus(id, 'Approved');
    const handleRejectClick = (id) => setRejectTarget(id);
    const handleRejectConfirm = (reason) => {
        updateStatus(rejectTarget, 'Rejected', reason);
        setRejectTarget(null);
    };

    const filtered = leaves.filter(l => filter === 'All' || l.status === filter);

    return (
        <DashboardLayout title="Leave Approvals">
            {rejectTarget && (
                <RejectModal
                    onConfirm={handleRejectConfirm}
                    onCancel={() => setRejectTarget(null)}
                />
            )}
            <div className="card">
                <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                            <CheckSquare size={20} className="text-blue-600" />
                        </div>
                        <h2 className="section-title">Leave Requests</h2>
                    </div>
                    <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                        {['All', 'Pending', 'Approved', 'Rejected'].map(f => (
                            <button key={f} onClick={() => setFilter(f)}
                                className={`text-xs font-medium px-3 py-1.5 rounded-md transition-all ${filter === f ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : filtered.length === 0 ? (
                    <p className="text-slate-400 text-sm text-center py-10">No {filter.toLowerCase()} leave requests.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    {['Employee', 'Dept', 'Type', 'From', 'To', 'Reason', 'Status', 'Rejection Reason', 'Actions'].map(h => (
                                        <th key={h} className="text-left py-3 px-3 text-slate-500 font-medium">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(l => (
                                    <tr key={l._id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                        <td className="py-3 px-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center text-xs font-semibold text-primary-600 flex-shrink-0">
                                                    {l.user?.name?.[0]?.toUpperCase()}
                                                </div>
                                                <span className="font-medium text-slate-700 whitespace-nowrap">{l.user?.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-3 text-slate-400 text-xs">{l.user?.department || '—'}</td>
                                        <td className="py-3 px-3 text-slate-600">{l.leaveType}</td>
                                        <td className="py-3 px-3 text-slate-500 whitespace-nowrap">{new Date(l.fromDate).toLocaleDateString()}</td>
                                        <td className="py-3 px-3 text-slate-500 whitespace-nowrap">{new Date(l.toDate).toLocaleDateString()}</td>
                                        <td className="py-3 px-3 text-slate-500 max-w-[130px] truncate">{l.reason}</td>
                                        <td className="py-3 px-3"><StatusBadge status={l.status} /></td>
                                        <td className="py-3 px-3 max-w-[160px]">
                                            {l.status === 'Rejected' && l.rejectionReason ? (
                                                <span className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded-lg italic block truncate" title={l.rejectionReason}>
                                                    {l.rejectionReason}
                                                </span>
                                            ) : (
                                                <span className="text-slate-300 text-xs">—</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-3">
                                            {l.status === 'Pending' && (
                                                <div className="flex items-center gap-1">
                                                    <button onClick={() => handleApprove(l._id)}
                                                        className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Approve">
                                                        <Check size={15} />
                                                    </button>
                                                    <button onClick={() => handleRejectClick(l._id)}
                                                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Reject">
                                                        <X size={15} />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default LeaveApproval;
