import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { User, Mail, Briefcase, Building2, Save } from 'lucide-react';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [form, setForm] = useState({
        name: user?.name || '',
        department: user?.department || '',
        designation: user?.designation || '',
        profilePhoto: user?.profilePhoto || '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await API.put('/auth/profile', form);
            updateUser(data.user);
            toast.success('Profile updated successfully!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout title="My Profile">
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Avatar Card */}
                <div className="card flex items-center gap-5">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                        {user?.profilePhoto
                            ? <img src={user.profilePhoto} alt="avatar" className="w-20 h-20 rounded-2xl object-cover" />
                            : <span className="text-white font-bold text-3xl">{user?.name?.[0]?.toUpperCase()}</span>
                        }
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{user?.name}</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm capitalize">{user?.role} · {user?.department || 'No department'}</p>
                        <p className="text-slate-400 dark:text-slate-500 text-sm">{user?.email}</p>
                    </div>
                </div>

                {/* Edit Form */}
                <div className="card">
                    <h3 className="section-title mb-5">Edit Information</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="label">Full Name</label>
                            <div className="relative">
                                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input type="text" name="name" value={form.name} onChange={handleChange}
                                    className="input pl-10" placeholder="Full name" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="label">Department</label>
                                <div className="relative">
                                    <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input type="text" name="department" value={form.department} onChange={handleChange}
                                        className="input pl-10" placeholder="Engineering" />
                                </div>
                            </div>
                            <div>
                                <label className="label">Designation</label>
                                <div className="relative">
                                    <Briefcase size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input type="text" name="designation" value={form.designation} onChange={handleChange}
                                        className="input pl-10" placeholder="Developer" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="label">Profile Photo URL</label>
                            <input type="url" name="profilePhoto" value={form.profilePhoto} onChange={handleChange}
                                className="input" placeholder="https://..." />
                        </div>

                        {/* Read-only */}
                        <div>
                            <label className="label">Email (read-only)</label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input type="email" value={user?.email} readOnly
                                    className="input pl-10 bg-slate-50 dark:bg-slate-600 cursor-not-allowed text-slate-400 dark:text-slate-500" />
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
                            <Save size={16} />
                            {loading ? 'Saving…' : 'Save Changes'}
                        </button>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Profile;
