import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

const INPUT = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500/40 transition backdrop-blur-sm';

function mapAuthError(msg: string): string {
  if (msg.includes('Invalid login credentials')) return 'Wrong email or password. Please try again.';
  if (msg.includes('Email not confirmed'))        return 'Please confirm your email before signing in.';
  if (msg.includes('Too many requests'))          return 'Too many attempts. Please wait a moment.';
  if (msg.includes('User not found'))             return 'No account found with that email.';
  return msg;
}

/* ── Floating stat card ── */
function StatCard({ label, value, color, icon }: { label: string; value: string; color: string; icon: React.ReactNode }) {
  return (
    <div className={`flex items-center gap-3 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl px-4 py-3 shadow-xl`}>
      <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center shrink-0`}>{icon}</div>
      <div>
        <p className="text-white font-bold text-sm leading-none">{value}</p>
        <p className="text-white/40 text-xs mt-0.5">{label}</p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const navigate   = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const [mode, setMode]               = useState<'signin' | 'forgot' | 'sent'>('signin');
  const [resetEmail, setResetEmail]   = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError]   = useState('');

  const handleLogin = async () => {
    if (!email || !password) { setError('Please enter your email and password.'); return; }
    setLoading(true); setError('');
    const { data, error: authErr } = await supabase.auth.signInWithPassword({ email, password });
    if (authErr) { setError(mapAuthError(authErr.message)); setLoading(false); return; }
    setSession(data.session);
    navigate('/dashboard');
  };

  const handleForgot = async () => {
    if (!resetEmail.trim()) { setResetError('Please enter your email address.'); return; }
    setResetLoading(true); setResetError('');
    const { error: err } = await supabase.auth.resetPasswordForEmail(resetEmail.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setResetLoading(false);
    if (err) { setResetError(err.message); return; }
    setMode('sent');
  };

  return (
    <div className="min-h-screen flex bg-[#080b14]">

      {/* ── LEFT: Visual Panel ── */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 overflow-hidden">

        {/* Gradient blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-indigo-600/20 blur-[100px]" />
          <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] rounded-full bg-violet-600/10 blur-[80px]" />
        </div>

        {/* Dot grid */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.07]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>

        {/* Top bar */}
        <div className="relative flex items-center gap-2.5 z-10">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-base shadow-lg shadow-blue-900/50">D</div>
          <span className="text-white font-bold text-lg tracking-tight">DevBoard</span>
        </div>

        {/* Centre content */}
        <div className="relative z-10 space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/15 border border-blue-500/25 rounded-full text-blue-300 text-xs font-medium mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              Your career command centre
            </div>
            <h2 className="text-4xl font-black text-white leading-tight tracking-tight">
              Land your next<br />
              <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">dream role.</span>
            </h2>
            <p className="text-white/40 text-sm mt-4 leading-relaxed max-w-sm">
              Track every application, browse live remote jobs, and get smarter about your job search — all in one beautiful dashboard.
            </p>
          </div>

          {/* Floating stat cards */}
          <div className="space-y-3 max-w-xs">
            <StatCard
              value="247 Jobs" label="Tracked this month"
              color="bg-blue-500/20"
              icon={<svg width="16" height="16" fill="none" stroke="#60a5fa" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>}
            />
            <StatCard
              value="12 Interviews" label="Scheduled this week"
              color="bg-amber-500/20"
              icon={<svg width="16" height="16" fill="none" stroke="#fbbf24" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}
            />
            <StatCard
              value="3 Offers" label="Received this month"
              color="bg-emerald-500/20"
              icon={<svg width="16" height="16" fill="none" stroke="#34d399" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
            />
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2">
            {['Job Tracker', 'GitHub Explorer', 'Live Jobs', 'Dev News', 'Analytics'].map((f) => (
              <span key={f} className="text-xs px-3 py-1.5 bg-white/5 border border-white/10 text-white/50 rounded-full">
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <p className="relative z-10 text-white/20 text-xs">© 2025 DevBoard. Built for developers.</p>
      </div>

      {/* ── RIGHT: Form Panel ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">

        {/* Subtle right-side glow */}
        <div className="absolute top-1/4 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="w-full max-w-md relative z-10">

          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-10 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-base">D</div>
            <span className="text-white font-bold text-lg">DevBoard</span>
          </div>

          {/* ════════ SIGN IN ════════ */}
          {mode === 'signin' && (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Welcome back</h1>
                <p className="text-white/40 text-sm">Sign in to continue to your dashboard</p>
              </div>

              {error && (
                <div className="mb-5 flex items-start gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" className="shrink-0 mt-0.5">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {error}
                </div>
              )}

              <div className="space-y-4 mb-2">
                <div>
                  <label className="block text-xs font-semibold text-white/40 mb-2 uppercase tracking-widest">Email</label>
                  <input type="email" placeholder="you@example.com" value={email}
                    onChange={(e) => setEmail(e.target.value)} className={INPUT} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/40 mb-2 uppercase tracking-widest">Password</label>
                  <div className="relative">
                    <input type={showPass ? 'text' : 'password'} placeholder="••••••••" value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                      className={`${INPUT} pr-11`} />
                    <button type="button" onClick={() => setShowPass(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition">
                      {showPass
                        ? <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        : <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      }
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mb-6">
                <button onClick={() => { setMode('forgot'); setResetEmail(email); setResetError(''); }}
                  className="text-xs text-blue-400 hover:text-blue-300 transition">
                  Forgot password?
                </button>
              </div>

              <button onClick={handleLogin} disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-3.5 rounded-xl font-bold text-sm transition shadow-2xl shadow-blue-900/50 disabled:opacity-50 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative flex items-center gap-2">
                  {loading
                    ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Signing in…</>
                    : <>Sign in <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg></>
                  }
                </span>
              </button>

              <p className="text-sm text-center text-white/30 mt-6">
                Don't have an account?{' '}
                <Link to="/register" className="text-blue-400 font-semibold hover:text-blue-300 transition">Create one free</Link>
              </p>
            </>
          )}

          {/* ════════ FORGOT PASSWORD ════════ */}
          {mode === 'forgot' && (
            <>
              <button onClick={() => { setMode('signin'); setResetError(''); }}
                className="flex items-center gap-1.5 text-sm text-white/30 hover:text-white/60 transition mb-8">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
                Back to sign in
              </button>
              <div className="mb-8">
                <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Forgot password?</h1>
                <p className="text-white/40 text-sm">We'll send you a secure reset link.</p>
              </div>
              {resetError && (
                <div className="mb-5 flex items-start gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" className="shrink-0 mt-0.5">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {resetError}
                </div>
              )}
              <div className="mb-6">
                <label className="block text-xs font-semibold text-white/40 mb-2 uppercase tracking-widest">Email address</label>
                <input type="email" placeholder="you@example.com" value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleForgot()}
                  className={INPUT} autoFocus />
              </div>
              <button onClick={handleForgot} disabled={resetLoading}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-3.5 rounded-xl font-bold text-sm transition shadow-2xl shadow-blue-900/50 disabled:opacity-50">
                {resetLoading
                  ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Sending…</>
                  : 'Send reset link'
                }
              </button>
            </>
          )}

          {/* ════════ EMAIL SENT ════════ */}
          {mode === 'sent' && (
            <div className="flex flex-col items-center text-center py-8">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mb-5">
                <svg width="28" height="28" fill="none" stroke="#34d399" strokeWidth="1.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <h2 className="text-2xl font-black text-white mb-2">Check your inbox</h2>
              <p className="text-white/40 text-sm mb-1">We sent a reset link to</p>
              <p className="text-blue-400 font-semibold text-sm mb-6">{resetEmail}</p>
              <p className="text-white/25 text-xs mb-8">
                Didn't receive it? Check spam, or{' '}
                <button onClick={() => setMode('forgot')} className="text-blue-400 hover:underline">try again</button>.
              </p>
              <button onClick={() => setMode('signin')} className="text-sm text-white/30 hover:text-white/60 transition">
                ← Back to sign in
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
