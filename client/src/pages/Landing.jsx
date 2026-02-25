import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    CalendarDays, Receipt, Users, ShieldCheck,
    ArrowRight, CheckCircle2, Zap, Globe
} from 'lucide-react';

/* ─── tiny inline CSS animations ─── */
const styles = `
@keyframes floatUp {
  from { opacity: 0; transform: translateY(40px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes pulse-ring {
  0%   { transform: scale(0.9); opacity: 0.6; }
  70%  { transform: scale(1.15); opacity: 0; }
  100% { transform: scale(1.15); opacity: 0; }
}
@keyframes drift {
  0%,100% { transform: translateY(0)   rotate(0deg); }
  33%      { transform: translateY(-18px) rotate(3deg); }
  66%      { transform: translateY(10px) rotate(-2deg); }
}
@keyframes shimmer {
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
}
@keyframes fadeSlideIn {
  from { opacity: 0; transform: translateX(-20px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes spin-slow { to { transform: rotate(360deg); } }

.animate-float   { animation: floatUp 0.7s ease-out forwards; }
.animate-drift   { animation: drift 7s ease-in-out infinite; }
.animate-shimmer {
  background: linear-gradient(90deg, #a78bfa, #818cf8, #38bdf8, #a78bfa);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 4s linear infinite;
}
.animate-spin-slow { animation: spin-slow 12s linear infinite; }
.pulse-ring::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  border: 2px solid rgba(139,92,246,0.5);
  animation: pulse-ring 2s ease-out infinite;
}
.glass {
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255,255,255,0.1);
}
.card-hover {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.card-hover:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.3);
}
`;

const features = [
    { icon: CalendarDays, color: 'from-blue-500 to-cyan-400', title: 'Smart Leave Management', desc: 'Apply, track and manage leaves with multi-type support and automatic duration calculation.' },
    { icon: Receipt, color: 'from-violet-500 to-fuchsia-400', title: 'Expense Reimbursements', desc: 'Submit expense claims with receipts and track approval status in real time.' },
    { icon: Users, color: 'from-emerald-500 to-teal-400', title: 'Team Directory', desc: 'Browse your organisation hierarchy, roles, departments and designations at a glance.' },
    { icon: ShieldCheck, color: 'from-rose-500 to-orange-400', title: 'Role-Based Access', desc: 'Granular permissions for Admin, Manager and Employee roles with JWT-secured APIs.' },
];

const stats = [
    { value: '3', label: 'User Roles' },
    { value: '100%', label: 'Secure JWT Auth' },
    { value: '∞', label: 'Scalable' },
    { value: '24/7', label: 'Always On' },
];

const steps = [
    { n: '01', title: 'Register', desc: 'Create your account in seconds.' },
    { n: '02', title: 'Set Up Your Team', desc: 'Admin adds employees and managers.' },
    { n: '03', title: 'Start Managing', desc: 'Apply leaves, submit expenses, approve instantly.' },
];

export default function Landing() {
    const heroRef = useRef(null);

    /* subtle mouse-parallax on hero */
    useEffect(() => {
        const hero = heroRef.current;
        if (!hero) return;
        const handleMove = (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            hero.style.transform = `perspective(800px) rotateX(${-y * 0.3}deg) rotateY(${x * 0.3}deg)`;
        };
        window.addEventListener('mousemove', handleMove);
        return () => window.removeEventListener('mousemove', handleMove);
    }, []);

    return (
        <>
            <style>{styles}</style>

            {/* ═══ BACKGROUND ═══ */}
            <div className="min-h-screen bg-[#0a0a14] text-white overflow-x-hidden">

                {/* floating blobs */}
                <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
                    <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-violet-600/20 blur-[120px] animate-drift" style={{ animationDelay: '0s' }} />
                    <div className="absolute top-1/3 -right-32 w-[500px] h-[500px] rounded-full bg-blue-600/15 blur-[100px] animate-drift" style={{ animationDelay: '2s' }} />
                    <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full bg-fuchsia-600/10 blur-[80px] animate-drift" style={{ animationDelay: '4s' }} />
                </div>

                {/* ═══ NAV ═══ */}
                <nav className="relative z-10 flex items-center justify-between px-6 md:px-16 py-5">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
                            <Zap size={18} className="text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">Leave<span className="text-violet-400">Loop</span></span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link to="/login"
                            className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-4 py-2">
                            Sign In
                        </Link>
                        <Link to="/register"
                            className="text-sm font-semibold bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white px-5 py-2 rounded-xl transition-all shadow-lg shadow-violet-600/30">
                            Get Started
                        </Link>
                    </div>
                </nav>

                {/* ═══ HERO ═══ */}
                <section className="relative z-10 flex flex-col items-center text-center px-6 pt-20 pb-28">
                    {/* badge */}
                    <div className="mb-6 inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs text-slate-300 animate-float" style={{ animationDelay: '0.1s', opacity: 0 }}>
                        <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                        HR Management, Simplified
                    </div>

                    {/* headline */}
                    <h1 ref={heroRef} className="text-5xl md:text-7xl font-black leading-none tracking-tight mb-6 animate-float transition-transform duration-300" style={{ animationDelay: '0.2s', opacity: 0 }}>
                        <span className="animate-shimmer">Leave</span>
                        <span className="text-white">Loop</span>
                        <br />
                        <span className="text-3xl md:text-5xl font-bold text-slate-300">Your HR, on&nbsp;
                            <span className="animate-shimmer">autopilot.</span>
                        </span>
                    </h1>

                    <p className="max-w-xl text-slate-400 text-lg leading-relaxed mb-10 animate-float" style={{ animationDelay: '0.35s', opacity: 0 }}>
                        Manage employee leaves, expense reimbursements, and team approvals —
                        all in one beautiful, role-aware platform.
                    </p>

                    {/* CTA buttons */}
                    <div className="flex flex-wrap justify-center gap-4 animate-float" style={{ animationDelay: '0.5s', opacity: 0 }}>
                        <Link to="/register"
                            className="group flex items-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-semibold px-8 py-3.5 rounded-2xl transition-all shadow-xl shadow-violet-600/30 text-base">
                            Start for Free
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link to="/login"
                            className="flex items-center gap-2 glass text-white font-semibold px-8 py-3.5 rounded-2xl hover:bg-white/10 transition-all text-base">
                            Sign In to Dashboard
                        </Link>
                    </div>

                    {/* stats row */}
                    <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-2xl animate-float" style={{ animationDelay: '0.65s', opacity: 0 }}>
                        {stats.map(s => (
                            <div key={s.label} className="glass rounded-2xl py-4 px-3 text-center">
                                <p className="text-2xl font-black animate-shimmer">{s.value}</p>
                                <p className="text-xs text-slate-400 mt-1">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ═══ FEATURES ═══ */}
                <section className="relative z-10 px-6 md:px-16 py-24">
                    <div className="text-center mb-14">
                        <span className="text-xs font-semibold uppercase tracking-widest text-violet-400">Features</span>
                        <h2 className="text-3xl md:text-5xl font-bold mt-2">Everything you need,<br /><span className="text-slate-400">nothing you don't.</span></h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
                        {features.map((f, i) => (
                            <div key={f.title} className="glass rounded-3xl p-6 card-hover"
                                style={{ animation: `floatUp 0.6s ease-out ${0.1 * i + 0.2}s both` }}>
                                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-lg`}>
                                    <f.icon size={22} className="text-white" />
                                </div>
                                <h3 className="font-bold text-base mb-2">{f.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ═══ HOW IT WORKS ═══ */}
                <section className="relative z-10 px-6 md:px-16 py-24">
                    <div className="text-center mb-14">
                        <span className="text-xs font-semibold uppercase tracking-widest text-blue-400">How It Works</span>
                        <h2 className="text-3xl md:text-5xl font-bold mt-2">Up and running<br /><span className="text-slate-400">in 3 steps.</span></h2>
                    </div>
                    <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {steps.map((s, i) => (
                            <div key={s.n} className="relative text-center card-hover"
                                style={{ animation: `floatUp 0.6s ease-out ${0.15 * i + 0.2}s both` }}>
                                <div className="relative inline-flex w-16 h-16 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-600/30 pulse-ring">
                                    <span className="text-lg font-black">{s.n}</span>
                                </div>
                                {i < steps.length - 1 && (
                                    <div className="hidden sm:block absolute top-8 left-[calc(50%+40px)] right-[-calc(50%-40px)] h-px bg-gradient-to-r from-violet-500/40 to-transparent" />
                                )}
                                <h3 className="font-bold text-base mb-1">{s.title}</h3>
                                <p className="text-slate-400 text-sm">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ═══ CTA BANNER ═══ */}
                <section className="relative z-10 px-6 md:px-16 py-20">
                    <div className="max-w-3xl mx-auto glass rounded-3xl p-10 md:p-14 text-center relative overflow-hidden">
                        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-violet-600/20 blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-blue-600/20 blur-2xl pointer-events-none" />
                        <Globe size={36} className="text-violet-400 mx-auto mb-4 animate-spin-slow" />
                        <h2 className="text-3xl md:text-4xl font-black mb-3">Ready to take control<br />of your HR?</h2>
                        <p className="text-slate-400 mb-8 text-base">Join LeaveLoop today and transform how you manage your workforce.</p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link to="/register"
                                className="group flex items-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 px-8 py-3.5 rounded-2xl font-semibold transition-all shadow-xl shadow-violet-600/30 text-sm">
                                Create Free Account <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link to="/login"
                                className="px-8 py-3.5 rounded-2xl font-semibold glass hover:bg-white/10 transition-all text-sm">
                                Login Instead
                            </Link>
                        </div>
                    </div>
                </section>

                {/* ═══ FOOTER ═══ */}
                <footer className="relative z-10 text-center py-8 text-slate-600 text-sm border-t border-white/5">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
                            <Zap size={12} className="text-white" />
                        </div>
                        <span className="font-semibold text-slate-400">LeaveLoop</span>
                    </div>
                    <p>© {new Date().getFullYear()} LeaveLoop. Built for modern teams.</p>
                    <div className="flex justify-center gap-6 mt-3 text-slate-500">
                        {['Leave Management', 'Expense Claims', 'Role-Based Access'].map(t => (
                            <span key={t} className="flex items-center gap-1 text-xs">
                                <CheckCircle2 size={12} className="text-emerald-500" /> {t}
                            </span>
                        ))}
                    </div>
                </footer>
            </div>
        </>
    );
}
