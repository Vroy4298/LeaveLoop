import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Zap, ArrowRight, Mail, Lock, User, Info } from 'lucide-react';

const shimmerStyle = `
  .ll-shimmer {
    background: linear-gradient(90deg, #a78bfa, #818cf8, #38bdf8, #a78bfa);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: ll-shimmer 4s linear infinite;
  }
  @keyframes ll-shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes ll-float {
    from { opacity:0; transform:translateY(28px); }
    to   { opacity:1; transform:translateY(0); }
  }
  .ll-float { animation: ll-float 0.6s ease-out forwards; }
  .ll-blob1 { position:absolute; width:420px; height:420px; border-radius:50%; background:rgba(139,92,246,0.18); filter:blur(100px); top:-100px; right:-80px; pointer-events:none; }
  .ll-blob2 { position:absolute; width:320px; height:320px; border-radius:50%; background:rgba(59,130,246,0.12); filter:blur(80px);  bottom:-60px; left:-60px; pointer-events:none; }
`;

const Field = ({ label, icon: Icon, children }) => (
    <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">{label}</label>
        <div className="relative">
            <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 z-10" />
            {children}
        </div>
    </div>
);

const inputClass = "w-full bg-white/5 border border-white/10 text-white placeholder-slate-600 text-sm rounded-xl pl-10 pr-4 py-3 outline-none focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20 transition-all";
const inputClassPr = "w-full bg-white/5 border border-white/10 text-white placeholder-slate-600 text-sm rounded-xl pl-10 pr-10 py-3 outline-none focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20 transition-all";

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        setLoading(true);
        try {
            // Only send name, email, password — backend forces role: 'employee'
            const user = await register({ name: form.name, email: form.email, password: form.password });
            toast.success(`Welcome to LeaveLoop, ${user.name}! 🎉`);
            navigate('/employee');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a14] flex items-center justify-center p-4 overflow-hidden">
            <style>{shimmerStyle}</style>

            <div className="ll-blob1" />
            <div className="ll-blob2" />

            <div className="relative w-full max-w-md ll-float">
                {/* Brand */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2.5 mb-4">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
                            <Zap size={22} className="text-white" />
                        </div>
                        <span className="text-2xl font-black text-white tracking-tight">
                            Leave<span className="ll-shimmer">Loop</span>
                        </span>
                    </Link>
                    <h1 className="text-3xl font-bold text-white">Create your account</h1>
                    <p className="text-slate-400 mt-1 text-sm">Join your team on LeaveLoop</p>
                </div>

                {/* form card */}
                <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
                    {/* Role notice */}
                    <div className="flex items-start gap-2.5 mb-5 px-3 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
                        <Info size={14} className="text-blue-400 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-blue-300 leading-relaxed">
                            All new accounts start as <strong>Employee</strong>. Your department and designation will be assigned by your admin after account creation.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        <Field label="Full Name" icon={User}>
                            <input type="text" name="name" value={form.name} onChange={handleChange} required
                                placeholder="John Doe" className={inputClass} />
                        </Field>

                        <Field label="Email" icon={Mail}>
                            <input type="email" name="email" value={form.email} onChange={handleChange} required
                                placeholder="you@company.com" className={inputClass} />
                        </Field>

                        <Field label="Password" icon={Lock}>
                            <input type={showPass ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} required
                                placeholder="Min 6 characters" minLength={6}
                                className={inputClassPr} />
                            <button type="button" onClick={() => setShowPass(!showPass)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
                        </Field>

                        <Field label="Confirm Password" icon={Lock}>
                            <input type={showConfirm ? 'text' : 'password'} name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required
                                placeholder="Re-enter password"
                                className={inputClassPr} />
                            <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                                {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
                        </Field>

                        <button type="submit" disabled={loading}
                            className="group w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-violet-600/30 disabled:opacity-60 disabled:cursor-not-allowed mt-2">
                            {loading ? (
                                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>Create Account <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" /></>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-500 mt-6">
                        Already have an account?{' '}
                        <Link to="/login" className="text-violet-400 font-semibold hover:text-violet-300 transition-colors">
                            Sign In
                        </Link>
                    </p>
                </div>

                <p className="text-center mt-5 text-xs text-slate-600">
                    <Link to="/" className="hover:text-slate-400 transition-colors">← Back to LeaveLoop</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
