import { useEffect, useState, useCallback, useMemo } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatusBadge from '../../components/common/StatusBadge';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import {
    CheckSquare, X, Check, AlertCircle, Sparkles, Brain,
    BarChart3, Clock, User, Calendar, ChevronDown, ChevronUp, Zap,
    Search, Filter,
} from 'lucide-react';

// ─── Urgency helpers ─────────────────────────────────────────────────────────
const URGENCY_CONFIG = {
    High:   { bg: 'bg-red-500/15',    text: 'text-red-400',    border: 'border-red-500/30',   dot: 'bg-red-400',    label: 'High Priority'   },
    Medium: { bg: 'bg-amber-500/15',  text: 'text-amber-400',  border: 'border-amber-500/30', dot: 'bg-amber-400',  label: 'Medium Priority' },
    Low:    { bg: 'bg-emerald-500/15',text: 'text-emerald-400',border: 'border-emerald-500/30',dot: 'bg-emerald-400',label: 'Low Priority'    },
};

const UrgencyBadge = ({ urgency }) => {
    const cfg = URGENCY_CONFIG[urgency];
    if (!cfg) return null;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} animate-pulse`} />
            {cfg.label}
        </span>
    );
};

// ─── Skeleton card ────────────────────────────────────────────────────────────
const SkeletonCard = () => (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 animate-pulse">
        <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700" />
            <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
            </div>
        </div>
        <div className="space-y-2">
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full" />
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-5/6" />
        </div>
    </div>
);

// ─── AI skeleton (inline) ─────────────────────────────────────────────────────
const AISkeleton = () => (
    <div className="mt-3 rounded-xl bg-slate-900 border border-violet-500/20 p-4 animate-pulse space-y-2">
        <div className="h-3 bg-slate-700 rounded w-4/5" />
        <div className="h-3 bg-slate-700 rounded w-3/5" />
        <div className="flex gap-2 mt-2">
            <div className="h-6 w-20 bg-slate-700 rounded-full" />
            <div className="h-6 w-16 bg-slate-700 rounded-full" />
        </div>
    </div>
);

// ─── Reject modal ─────────────────────────────────────────────────────────────
const RejectModal = ({ onConfirm, onCancel }) => {
    const [reason, setReason] = useState('');
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm border border-slate-100 dark:border-slate-700">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center gap-3">
                    <div className="w-9 h-9 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                        <AlertCircle size={18} className="text-red-500" />
                    </div>
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100">Reason for Rejection</h3>
                </div>
                <div className="px-6 py-5 space-y-4">
                    <textarea
                        value={reason}
                        onChange={e => setReason(e.target.value)}
                        rows={3}
                        placeholder="Provide a reason so the employee understands…"
                        className="input resize-none text-sm"
                    />
                    <div className="flex gap-3">
                        <button onClick={onCancel} className="btn-secondary flex-1">Cancel</button>
                        <button
                            onClick={() => onConfirm(reason)}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-2 px-4 rounded-xl transition-colors"
                        >
                            Confirm Reject
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Rank-all modal ───────────────────────────────────────────────────────────
const RankAllModal = ({ data, onClose }) => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
        <div
            className="bg-slate-900 rounded-3xl shadow-2xl w-full max-w-2xl border border-violet-500/30 overflow-hidden"
            style={{ maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}
        >
            {/* Header */}
            <div className="px-6 py-5 border-b border-violet-500/20 flex items-center justify-between bg-gradient-to-r from-violet-900/40 to-slate-900">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                        <Brain size={18} className="text-white" />
                    </div>
                    <div>
                        <h2 className="font-bold text-white text-lg">AI Priority Ranking</h2>
                        <p className="text-violet-300 text-xs">{data.length} pending leave{data.length !== 1 ? 's' : ''} ranked by urgency</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                >
                    <X size={16} />
                </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto p-5 space-y-3">
                {data.map((item, idx) => {
                    const cfg = URGENCY_CONFIG[item.urgency] || URGENCY_CONFIG.Low;
                    const days = Math.ceil((new Date(item.toDate) - new Date(item.fromDate)) / 86400000) + 1;
                    return (
                        <div
                            key={String(item._id)}
                            className={`rounded-2xl border ${cfg.border} bg-slate-800/60 p-4 flex gap-4 items-start`}
                        >
                            {/* Rank badge */}
                            <div className={`w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center text-xs font-bold ${cfg.bg} ${cfg.text} border ${cfg.border}`}>
                                #{idx + 1}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <span className="font-semibold text-white text-sm">{item.name}</span>
                                    <span className="text-slate-400 text-xs">{item.department}</span>
                                    <UrgencyBadge urgency={item.urgency} />
                                    <span className={`ml-auto text-xs font-bold ${cfg.text}`}>Score: {item.score}/10</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-slate-400 mb-2">
                                    <span className="flex items-center gap-1"><Calendar size={11} />{new Date(item.fromDate).toLocaleDateString()} – {new Date(item.toDate).toLocaleDateString()}</span>
                                    <span className="flex items-center gap-1"><Clock size={11} />{days} day{days !== 1 ? 's' : ''}</span>
                                    <span className="px-2 py-0.5 rounded-md bg-slate-700 text-slate-300">{item.leaveType}</span>
                                </div>
                                <p className="text-xs text-slate-300 italic">"{item.priorityReason}"</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-violet-500/20 bg-slate-900">
                <p className="text-xs text-slate-500 text-center">Powered by GPT-4 • Rankings are advisory only</p>
            </div>
        </div>
    </div>
);

// ─── Leave card ───────────────────────────────────────────────────────────────
const LeaveCard = ({ leave: l, onApprove, onRejectClick }) => {
    const [aiState, setAiState] = useState(
        l.aiSummary?.text
            ? { status: 'done', data: l.aiSummary }
            : { status: 'idle', data: null }
    );
    const [expanded, setExpanded] = useState(false);

    const days = Math.ceil((new Date(l.toDate) - new Date(l.fromDate)) / 86400000) + 1;

    const fetchAI = useCallback(async () => {
        setAiState({ status: 'loading', data: null });
        setExpanded(true);
        try {
            const { data } = await API.get(`/ai/summarize/${l._id}`);
            setAiState({ status: 'done', data: data.aiSummary });
        } catch (err) {
            setAiState({ status: 'error', data: null });
            toast.error('AI summary failed');
        }
    }, [l._id]);

    const cfg = URGENCY_CONFIG[aiState.data?.urgency];

    return (
        <div className="group rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
            {/* Card header */}
            <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md">
                            {l.user?.name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div>
                            <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{l.user?.name}</p>
                            <p className="text-xs text-slate-400">{l.user?.department || 'No department'}</p>
                        </div>
                    </div>
                    <StatusBadge status={l.status} />
                </div>

                {/* Meta info */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-slate-500 dark:text-slate-400 mb-3">
                    <span className="flex items-center gap-1.5"><Calendar size={11} className="text-slate-400" />{new Date(l.fromDate).toLocaleDateString()} → {new Date(l.toDate).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1.5"><Clock size={11} className="text-slate-400" />{days} day{days !== 1 ? 's' : ''}</span>
                    <span className="flex items-center gap-1.5 col-span-2"><User size={11} className="text-slate-400" /><span className="font-medium text-slate-700 dark:text-slate-300">{l.leaveType}</span> leave</span>
                </div>

                {/* Reason */}
                <p className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50 rounded-lg px-3 py-2 line-clamp-2">
                    {l.reason || 'No reason provided'}
                </p>

                {/* Rejection note */}
                {l.status === 'Rejected' && l.rejectionReason && (
                    <div className="mt-2 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                        <p className="text-xs text-red-600 dark:text-red-400 italic">"{l.rejectionReason}"</p>
                    </div>
                )}
            </div>

            {/* AI Panel */}
            {(aiState.status !== 'idle' || l.aiSummary?.text) && (
                <div className="border-t border-violet-500/20 bg-slate-900 px-5 py-4">
                    {aiState.status === 'loading' && <AISkeleton />}

                    {aiState.status === 'done' && aiState.data && (
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-1.5">
                                    <Sparkles size={12} className="text-violet-400" />
                                    <span className="text-xs font-semibold text-violet-300">AI Analysis</span>
                                </div>
                                {cfg && (
                                    <div className="flex items-center gap-2">
                                        <UrgencyBadge urgency={aiState.data.urgency} />
                                        <span className="text-xs font-bold text-violet-400">{aiState.data.score}/10</span>
                                    </div>
                                )}
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed">{aiState.data.text}</p>
                            {/* Score bar */}
                            <div className="mt-3">
                                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                                    <span>Priority Score</span>
                                    <span className="text-violet-400 font-semibold">{aiState.data.score}/10</span>
                                </div>
                                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-400 transition-all duration-700"
                                        style={{ width: `${(aiState.data.score / 10) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {aiState.status === 'error' && (
                        <p className="text-xs text-red-400 flex items-center gap-1.5">
                            <AlertCircle size={12} /> Failed to load AI summary. <button onClick={fetchAI} className="underline">Retry</button>
                        </p>
                    )}
                </div>
            )}

            {/* Actions footer */}
            <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-700 flex items-center gap-2">
                {/* AI button — always visible for all statuses */}
                {aiState.status === 'idle' && !l.aiSummary?.text ? (
                    <button
                        onClick={fetchAI}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20 hover:bg-violet-100 dark:hover:bg-violet-900/40 rounded-lg border border-violet-200 dark:border-violet-700 transition-all duration-200"
                    >
                        <Brain size={12} /> 🤖 AI Summary
                    </button>
                ) : aiState.status === 'done' ? (
                    <button
                        onClick={fetchAI}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-violet-400 bg-violet-900/20 hover:bg-violet-900/40 rounded-lg border border-violet-700 transition-all duration-200"
                    >
                        <Sparkles size={12} /> Refresh AI
                    </button>
                ) : null}

                <div className="ml-auto flex items-center gap-1.5">
                    {l.status === 'Pending' && (
                        <>
                            <button
                                onClick={() => onApprove(l._id)}
                                title="Approve"
                                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 rounded-lg border border-emerald-200 dark:border-emerald-700 transition-all"
                            >
                                <Check size={12} /> Approve
                            </button>
                            <button
                                onClick={() => onRejectClick(l._id)}
                                title="Reject"
                                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg border border-red-200 dark:border-red-800 transition-all"
                            >
                                <X size={12} /> Reject
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

// ─── Main page ────────────────────────────────────────────────────────────────
const LeaveApproval = () => {
    const [leaves, setLeaves]           = useState([]);
    const [loading, setLoading]         = useState(true);
    const [filter, setFilter]           = useState('Pending');
    const [search, setSearch]           = useState('');
    const [deptFilter, setDeptFilter]   = useState('All');
    const [rejectTarget, setRejectTarget] = useState(null);
    const [rankModal, setRankModal]     = useState(null);   // null | ranked[]
    const [rankLoading, setRankLoading] = useState(false);

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

    const handleApprove      = (id)    => updateStatus(id, 'Approved');
    const handleRejectClick  = (id)    => setRejectTarget(id);
    const handleRejectConfirm = (reason) => {
        updateStatus(rejectTarget, 'Rejected', reason);
        setRejectTarget(null);
    };

    const handleRankAll = async () => {
        setRankLoading(true);
        try {
            const { data } = await API.get('/ai/summary-all');
            setRankModal(data.ranked);
        } catch (err) {
            toast.error('Failed to rank pending leaves');
        } finally {
            setRankLoading(false);
        }
    };

    const filtered = useMemo(() => {
        return leaves.filter(l => {
            const matchStatus = filter === 'All' || l.status === filter;
            const matchSearch = !search.trim() ||
                l.user?.name?.toLowerCase().includes(search.toLowerCase());
            const matchDept   = deptFilter === 'All' ||
                (l.user?.department || '') === deptFilter;
            return matchStatus && matchSearch && matchDept;
        });
    }, [leaves, filter, search, deptFilter]);

    const departments = useMemo(() => {
        const depts = [...new Set(leaves.map(l => l.user?.department).filter(Boolean))];
        return ['All', ...depts.sort()];
    }, [leaves]);

    const pendingCount = leaves.filter(l => l.status === 'Pending').length;

    return (
        <DashboardLayout title="Leave Approvals">
            {/* Reject modal */}
            {rejectTarget && (
                <RejectModal
                    onConfirm={handleRejectConfirm}
                    onCancel={() => setRejectTarget(null)}
                />
            )}

            {/* Rank-all modal */}
            {rankModal && (
                <RankAllModal data={rankModal} onClose={() => setRankModal(null)} />
            )}

            <div className="card">
                {/* ── Header ── */}
                <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                            <CheckSquare size={20} className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h2 className="section-title">Leave Requests</h2>
                            <p className="text-xs text-slate-400">{pendingCount} pending review</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                        {/* Rank all button */}
                        {pendingCount > 0 && (
                            <button
                                onClick={handleRankAll}
                                disabled={rankLoading}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 disabled:opacity-60 shadow-lg shadow-violet-500/25 transition-all duration-200 active:scale-95"
                            >
                                {rankLoading ? (
                                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <Zap size={14} />
                                )}
                                ✨ Rank All Pending
                            </button>
                        )}

                        {/* Filter pills */}
                        <div className="flex gap-1 bg-slate-100 dark:bg-slate-700/50 p-1 rounded-lg">
                            {['All', 'Pending', 'Approved', 'Rejected'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`text-xs font-medium px-3 py-1.5 rounded-md transition-all ${
                                        filter === f
                                            ? 'bg-white dark:bg-slate-800 shadow text-slate-800 dark:text-slate-100'
                                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                                    }`}
                                >
                                    {f}
                                    {f === 'Pending' && pendingCount > 0 && (
                                        <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-300">
                                            {pendingCount}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Search & Department Filter ── */}
                <div className="flex flex-col sm:flex-row gap-3 mb-5">
                    <div className="relative flex-1">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by employee name…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 dark:text-slate-200 transition-all"
                        />
                    </div>
                    <div className="relative">
                        <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <select
                            value={deptFilter}
                            onChange={e => setDeptFilter(e.target.value)}
                            className="pl-9 pr-8 py-2 text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 dark:text-slate-200 appearance-none cursor-pointer transition-all"
                        >
                            {departments.map(d => (
                                <option key={d} value={d}>{d === 'All' ? 'All Departments' : d}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* ── Content ── */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mb-4">
                            <BarChart3 size={28} className="text-slate-400" />
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">No {filter.toLowerCase()} leave requests</p>
                        <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">All caught up! 🎉</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {filtered.map(l => (
                            <LeaveCard
                                key={l._id}
                                leave={l}
                                onApprove={handleApprove}
                                onRejectClick={handleRejectClick}
                            />
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default LeaveApproval;
