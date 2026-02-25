import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { UserPlus, Trash2, Pencil, X, Check, Users } from 'lucide-react';

const EMPTY_FORM = { name: '', email: '', password: '', role: 'employee', department: '', designation: '' };
const roleColor = { admin: 'bg-rose-100 text-rose-600', manager: 'bg-violet-100 text-violet-600', employee: 'bg-blue-100 text-blue-600' };

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editUser, setEditUser] = useState(null); // null = create mode
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);

    const fetchUsers = () => {
        API.get('/users').then(({ data }) => setUsers(data.users)).finally(() => setLoading(false));
    };
    useEffect(() => { fetchUsers(); }, []);

    const openCreate = () => { setEditUser(null); setForm(EMPTY_FORM); setShowModal(true); };
    const openEdit = (u) => {
        setEditUser(u);
        setForm({ name: u.name, email: u.email, password: '', role: u.role, department: u.department || '', designation: u.designation || '' });
        setShowModal(true);
    };
    const closeModal = () => { setShowModal(false); setEditUser(null); };

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editUser) {
                const { data } = await API.put(`/users/${editUser._id}`, { name: form.name, role: form.role, department: form.department, designation: form.designation });
                setUsers(prev => prev.map(u => u._id === editUser._id ? data.user : u));
                toast.success('User updated successfully');
            } else {
                const { data } = await API.post('/users', form);
                setUsers(prev => [data.user, ...prev]);
                toast.success('User created successfully');
            }
            closeModal();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Save failed');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this user? This cannot be undone.')) return;
        try {
            await API.delete(`/users/${id}`);
            setUsers(prev => prev.filter(u => u._id !== id));
            toast.success('User deleted');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Delete failed');
        }
    };

    return (
        <DashboardLayout title="User Management">
            <div className="card">
                {/* Header */}
                <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center">
                            <Users size={20} className="text-rose-600" />
                        </div>
                        <div>
                            <h2 className="section-title">All Users</h2>
                            <p className="text-xs text-slate-400">{users.length} registered users</p>
                        </div>
                    </div>
                    <button onClick={openCreate} className="btn-primary flex items-center gap-2">
                        <UserPlus size={16} />
                        Add User
                    </button>
                </div>

                {/* Table */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    {['Name', 'Email', 'Role', 'Department', 'Designation', 'Joined', 'Actions'].map(h => (
                                        <th key={h} className="text-left py-3 px-3 text-slate-500 font-medium">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u._id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                        <td className="py-3 px-3">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-indigo-500 flex items-center justify-center flex-shrink-0">
                                                    <span className="text-white text-xs font-bold">{u.name?.[0]?.toUpperCase()}</span>
                                                </div>
                                                <span className="font-medium text-slate-800">{u.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-3 text-slate-500">{u.email}</td>
                                        <td className="py-3 px-3">
                                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${roleColor[u.role]}`}>{u.role}</span>
                                        </td>
                                        <td className="py-3 px-3 text-slate-500">{u.department || '—'}</td>
                                        <td className="py-3 px-3 text-slate-500">{u.designation || '—'}</td>
                                        <td className="py-3 px-3 text-slate-400 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                                        <td className="py-3 px-3">
                                            <div className="flex items-center gap-1">
                                                <button onClick={() => openEdit(u)}
                                                    className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                                                    <Pencil size={14} />
                                                </button>
                                                <button onClick={() => handleDelete(u._id)}
                                                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {users.length === 0 && (
                            <p className="text-center text-slate-400 text-sm py-10">No users found.</p>
                        )}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                            <h3 className="font-semibold text-slate-800">{editUser ? 'Edit User' : 'Create New User'}</h3>
                            <button onClick={closeModal} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
                                <X size={18} />
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="px-6 py-5 space-y-4">
                            <div>
                                <label className="label">Full Name</label>
                                <input type="text" name="name" value={form.name} onChange={handleChange} required className="input" placeholder="John Doe" />
                            </div>
                            {!editUser && (
                                <>
                                    <div>
                                        <label className="label">Email</label>
                                        <input type="email" name="email" value={form.email} onChange={handleChange} required className="input" placeholder="user@company.com" />
                                    </div>
                                    <div>
                                        <label className="label">Password</label>
                                        <input type="password" name="password" value={form.password} onChange={handleChange} required className="input" placeholder="Min 6 characters" minLength={6} />
                                    </div>
                                </>
                            )}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="label">Department</label>
                                    <input type="text" name="department" value={form.department} onChange={handleChange} className="input" placeholder="Engineering" />
                                </div>
                                <div>
                                    <label className="label">Designation</label>
                                    <input type="text" name="designation" value={form.designation} onChange={handleChange} className="input" placeholder="Developer" />
                                </div>
                            </div>
                            <div>
                                <label className="label">Role</label>
                                <select name="role" value={form.role} onChange={handleChange} className="input">
                                    <option value="employee">Employee</option>
                                    <option value="manager">Manager</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={closeModal} className="btn-secondary flex-1">Cancel</button>
                                <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
                                    <Check size={16} />
                                    {saving ? 'Saving…' : editUser ? 'Save Changes' : 'Create User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default UserManagement;
