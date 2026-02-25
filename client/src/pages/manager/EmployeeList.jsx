import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import API from '../../api/axios';
import { Users, Search } from 'lucide-react';

const EmployeeList = () => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.get('/users')
            .then(({ data }) => setUsers(data.users))
            .finally(() => setLoading(false));
    }, []);

    const filtered = users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        (u.department || '').toLowerCase().includes(search.toLowerCase())
    );

    const roleColor = { admin: 'bg-rose-100 text-rose-600', manager: 'bg-violet-100 text-violet-600', employee: 'bg-blue-100 text-blue-600' };

    return (
        <DashboardLayout title="Employee Directory">
            <div className="card">
                <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                            <Users size={20} className="text-indigo-600" />
                        </div>
                        <div>
                            <h2 className="section-title">All Employees</h2>
                            <p className="text-xs text-slate-400">{filtered.length} member{filtered.length !== 1 ? 's' : ''}</p>
                        </div>
                    </div>
                    <div className="relative">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                            placeholder="Search by name, email, dept…"
                            className="input pl-9 w-64 text-sm" />
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    {['Employee', 'Email', 'Department', 'Designation', 'Role', 'Joined'].map(h => (
                                        <th key={h} className="text-left py-3 px-3 text-slate-500 font-medium">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(u => (
                                    <tr key={u._id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                        <td className="py-3 px-3">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-indigo-500 flex items-center justify-center flex-shrink-0">
                                                    <span className="text-white text-xs font-bold">{u.name?.[0]?.toUpperCase()}</span>
                                                </div>
                                                <span className="font-medium text-slate-800">{u.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-3 text-slate-500">{u.email}</td>
                                        <td className="py-3 px-3 text-slate-500">{u.department || '—'}</td>
                                        <td className="py-3 px-3 text-slate-500">{u.designation || '—'}</td>
                                        <td className="py-3 px-3">
                                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${roleColor[u.role]}`}>{u.role}</span>
                                        </td>
                                        <td className="py-3 px-3 text-slate-400 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filtered.length === 0 && (
                            <p className="text-center text-slate-400 text-sm py-8">No employees match your search.</p>
                        )}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default EmployeeList;
