import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatusBadge from '../../components/common/StatusBadge';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { Trash2, FileText } from 'lucide-react';

const ReimbursementHistory = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.get('/reimbursements/my')
            .then(({ data }) => setItems(data.reimbursements))
            .finally(() => setLoading(false));
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this reimbursement?')) return;
        try {
            await API.delete(`/reimbursements/${id}`);
            toast.success('Deleted successfully');
            setItems(prev => prev.filter(r => r._id !== id));
        } catch (err) {
            toast.error(err.response?.data?.message || 'Delete failed');
        }
    };

    const total = items.reduce((sum, r) => sum + r.amount, 0);
    const approved = items.filter(r => r.status === 'Approved').reduce((s, r) => s + r.amount, 0);

    return (
        <DashboardLayout title="Expense History">
            <div className="space-y-4">
                {/* Summary Chips */}
                <div className="flex flex-wrap gap-3">
                    <div className="bg-white border border-slate-100 rounded-xl px-4 py-2 text-sm shadow-sm">
                        <span className="text-slate-500">Total Claimed: </span>
                        <span className="font-bold text-slate-800">₹{total.toLocaleString()}</span>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2 text-sm shadow-sm">
                        <span className="text-emerald-700">Approved: </span>
                        <span className="font-bold text-emerald-700">₹{approved.toLocaleString()}</span>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
                            <FileText size={20} className="text-violet-600" />
                        </div>
                        <h2 className="section-title">My Reimbursements</h2>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : items.length === 0 ? (
                        <div className="text-center py-12">
                            <FileText size={40} className="text-slate-200 mx-auto mb-3" />
                            <p className="text-slate-400 text-sm">No reimbursements yet.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-100">
                                        {['Title', 'Amount', 'Description', 'Date', 'Status', 'Rejection Reason', 'Action'].map(h => (
                                            <th key={h} className="text-left py-3 px-3 text-slate-500 font-medium">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map(r => (
                                        <tr key={r._id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                            <td className="py-3 px-3 font-medium text-slate-700">{r.title}</td>
                                            <td className="py-3 px-3 text-slate-700 font-semibold">₹{r.amount.toLocaleString()}</td>
                                            <td className="py-3 px-3 text-slate-500 max-w-[180px] truncate">{r.description}</td>
                                            <td className="py-3 px-3 text-slate-400 text-xs">{new Date(r.createdAt).toLocaleDateString()}</td>
                                            <td className="py-3 px-3"><StatusBadge status={r.status} /></td>
                                            <td className="py-3 px-3 max-w-[180px]">
                                                {r.status === 'Rejected' ? (
                                                    r.rejectionReason ? (
                                                        <span className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded-lg italic block" title={r.rejectionReason}>
                                                            {r.rejectionReason}
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs text-slate-400 italic">No reason provided</span>
                                                    )
                                                ) : (
                                                    <span className="text-slate-300 text-xs">—</span>
                                                )}
                                            </td>
                                            <td className="py-3 px-3">
                                                {r.status === 'Pending' ? (
                                                    <button onClick={() => handleDelete(r._id)}
                                                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete claim">
                                                        <Trash2 size={15} />
                                                    </button>
                                                ) : (
                                                    <span className="text-slate-300 text-xs">—</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ReimbursementHistory;
