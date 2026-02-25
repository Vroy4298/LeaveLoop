import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { CalendarDays, Send } from 'lucide-react';

const leaveTypes = ['Annual', 'Sick', 'Casual', 'Maternity', 'Paternity', 'Unpaid'];

const ApplyLeave = () => {
    const [form, setForm] = useState({
        leaveType: 'Annual', fromDate: '', toDate: '', reason: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (new Date(form.toDate) < new Date(form.fromDate)) {
            toast.error('End date cannot be before start date');
            return;
        }
        setLoading(true);
        try {
            await API.post('/leaves', form);
            toast.success('Leave application submitted!');
            setForm({ leaveType: 'Annual', fromDate: '', toDate: '', reason: '' });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Submission failed');
        } finally {
            setLoading(false);
        }
    };

    const days = form.fromDate && form.toDate
        ? Math.max(0, Math.ceil((new Date(form.toDate) - new Date(form.fromDate)) / (1000 * 60 * 60 * 24)) + 1)
        : 0;

    return (
        <DashboardLayout title="Apply for Leave">
            <div className="max-w-xl mx-auto">
                <div className="card">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                            <CalendarDays size={20} className="text-blue-600" />
                        </div>
                        <div>
                            <h2 className="section-title">Leave Application</h2>
                            <p className="text-slate-400 text-xs">Fill in the details below</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="label">Leave Type</label>
                            <select name="leaveType" value={form.leaveType} onChange={handleChange} className="input">
                                {leaveTypes.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="label">From Date</label>
                                <input type="date" name="fromDate" value={form.fromDate} onChange={handleChange}
                                    required className="input" min={new Date().toISOString().split('T')[0]} />
                            </div>
                            <div>
                                <label className="label">To Date</label>
                                <input type="date" name="toDate" value={form.toDate} onChange={handleChange}
                                    required className="input" min={form.fromDate || new Date().toISOString().split('T')[0]} />
                            </div>
                        </div>

                        {days > 0 && (
                            <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-sm text-blue-700 font-medium">
                                📅 Duration: <span className="font-bold">{days} day{days > 1 ? 's' : ''}</span>
                            </div>
                        )}

                        <div>
                            <label className="label">Reason</label>
                            <textarea name="reason" value={form.reason} onChange={handleChange}
                                required rows={4} placeholder="Briefly describe the reason for your leave…"
                                className="input resize-none" />
                        </div>

                        <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
                            <Send size={16} />
                            {loading ? 'Submitting…' : 'Submit Application'}
                        </button>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ApplyLeave;
