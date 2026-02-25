import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { Receipt, Send } from 'lucide-react';

const SubmitReimbursement = () => {
    const [form, setForm] = useState({ title: '', amount: '', description: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (Number(form.amount) <= 0) { toast.error('Amount must be greater than 0'); return; }
        setLoading(true);
        try {
            await API.post('/reimbursements', { ...form, amount: Number(form.amount) });
            toast.success('Reimbursement submitted successfully!');
            setForm({ title: '', amount: '', description: '' });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Submission failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout title="Submit Expense">
            <div className="max-w-xl mx-auto">
                <div className="card">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
                            <Receipt size={20} className="text-violet-600" />
                        </div>
                        <div>
                            <h2 className="section-title">Reimbursement Request</h2>
                            <p className="text-slate-400 text-xs">Submit your expense claim below</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="label">Expense Title</label>
                            <input type="text" name="title" value={form.title} onChange={handleChange}
                                required placeholder="e.g. Travel to client site" className="input" />
                        </div>

                        <div>
                            <label className="label">Amount (₹)</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">₹</span>
                                <input type="number" name="amount" value={form.amount} onChange={handleChange}
                                    required min="1" step="0.01" placeholder="0.00" className="input pl-8" />
                            </div>
                        </div>

                        <div>
                            <label className="label">Description</label>
                            <textarea name="description" value={form.description} onChange={handleChange}
                                required rows={4} placeholder="Describe the expense in detail…"
                                className="input resize-none" />
                        </div>

                        <div>
                            <label className="label">Receipt URL <span className="text-slate-400 font-normal">(optional)</span></label>
                            <input type="url" name="receipt" onChange={handleChange}
                                placeholder="https://drive.google.com/…" className="input" />
                        </div>

                        <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
                            <Send size={16} />
                            {loading ? 'Submitting…' : 'Submit Claim'}
                        </button>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default SubmitReimbursement;
