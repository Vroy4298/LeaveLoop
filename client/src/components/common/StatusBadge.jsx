const StatusBadge = ({ status }) => {
    const styles = {
        Pending: 'bg-amber-100 text-amber-700 border-amber-200',
        Approved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        Rejected: 'bg-red-100 text-red-600 border-red-200',
    };
    const dots = {
        Pending: 'bg-amber-400',
        Approved: 'bg-emerald-400',
        Rejected: 'bg-red-400',
    };
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${styles[status] || 'bg-slate-100 text-slate-600'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${dots[status] || 'bg-slate-400'}`} />
            {status}
        </span>
    );
};

export default StatusBadge;
