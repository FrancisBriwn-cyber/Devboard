import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

const INPUT = 'w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700/60 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition';

function mapAuthError(msg: string): string {
  if (msg.includes('Invalid login credentials')) return 'Wrong email or password. Please try again.';
  if (msg.includes('Email not confirmed'))        return 'Please confirm your email before signing in. Check your inbox.';
  if (msg.includes('Too many requests'))          return 'Too many attempts. Please wait a moment and try again.';
  if (msg.includes('User not found'))             return 'No account found with that email address.';
  return msg;
}

export default function LoginPage() {
  const navigate   = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);

  /* sign-in fields */
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  /* forgot-password mode */
  const [mode, setMode]           = useState<'signin' | 'forgot' | 'sent'>('signin');
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError]     = useState('');

  /* ── Sign in ── */
  const handleLogin = async () => {
    if (!email || !password) { setError('Please enter your email and password.'); return; }
    setLoading(true); setError('');
    const { data, error: authErr } = await supabase.auth.signInWithPassword({ email, password });
    if (authErr) { setError(mapAuthError(authErr.message)); setLoading(false); return; }
    setSession(data.session);
    navigate('/dashboard');
  };

  /* ── Forgot password ── */
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
    <div className="min-h-screen flex">

      {/* ── Left branding panel ── */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex-col justify-between p-12">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white font-black text-sm">D</span>
          <span className="text-white font-bold text-lg tracking-tight">DevBoard</span>
        </div>
        <div>
          <h2 className="text-4xl font-bold text-white leading-snug mb-4">
            {mode === 'forgot' ? 'Reset your\npassword.' : mode === 'sent' ? 'Check your\ninbox.' : 'Your job search,\norganised.'}
          </h2>
          <p className="text-blue-200 text-base leading-relaxed">
            {mode === 'forgot'
              ? "Enter your email and we'll send you a secure link to reset your password."
              : mode === 'sent'
              ? "We've sent a password reset link to your email. It expires in 1 hour."
              : 'Track applications, browse live jobs, and stay on top of your career journey — all in one place.'}
          </p>
        </div>
        <p className="text-blue-300 text-sm">© 2025 DevBoard</p>
      </div>

      {/* ── Right form panel ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white dark:bg-zinc-900 p-8">
        <div className="w-full max-w-md">

          {/* ════════ SIGN IN ════════ */}
          {mode === 'signin' && (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2 tracking-tight">Welcome back</h1>
                <p className="text-slate-400 dark:text-zinc-500">Sign in to continue to DevBoard</p>
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
                  <label className="block text-sm font-medium text-slate-600 dark:text-zinc-400 mb-1.5">Email</label>
                  <input type="email" placeholder="you@example.com" value={email}
                    onChange={(e) => setEmail(e.target.value)} className={INPUT} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-zinc-400 mb-1.5">Password</label>
                  <div className="relative">
                    <input type={showPass ? 'text' : 'password'} placeholder="••••••••" value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                      className={`${INPUT} pr-11`} />
                    <button type="button" onClick={() => setShowPass(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 transition">
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
                  className="text-xs text-blue-500 hover:text-blue-400 transition">
                  Forgot password?
                </button>
              </div>

              <button onClick={handleLogin} disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-semibold text-sm transition shadow-lg shadow-blue-900/40 disabled:opacity-50">
                {loading
                  ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Signing in…</>
                  : 'Sign in'
                }
              </button>

              <p className="text-sm text-center text-slate-400 dark:text-zinc-500 mt-6">
                Don't have an account?{' '}
                <Link to="/register" className="text-blue-400 font-medium hover:underline">Create one</Link>
              </p>
            </>
          )}

          {/* ════════ FORGOT PASSWORD ════════ */}
          {mode === 'forgot' && (
            <>
              <button onClick={() => { setMode('signin'); setResetError(''); }}
                className="flex items-center gap-1.5 text-sm text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300 transition mb-8">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
                Back to sign in
              </button>

              <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2 tracking-tight">Forgot password?</h1>
                <p className="text-slate-400 dark:text-zinc-500 text-sm">Enter your email and we'll send you a reset link.</p>
              </div>

              {resetError && (
                <div className="mb-5 flex items-start gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" className="shrink-0 mt-0.5">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {resetError}
                </div>
              )}

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-zinc-400 mb-1.5">Email address</label>
                  <input type="email" placeholder="you@example.com" value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleForgot()}
                    className={INPUT} autoFocus />
                </div>
              </div>

              <button onClick={handleForgot} disabled={resetLoading}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-semibold text-sm transition shadow-lg shadow-blue-900/40 disabled:opacity-50">
                {resetLoading
                  ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Sending…</>
                  : 'Send reset link'
                }
              </button>
            </>
          )}

          {/* ════════ EMAIL SENT ════════ */}
          {mode === 'sent' && (
            <>
              <div className="flex flex-col items-center text-center py-8">
                <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mb-5">
                  <svg width="28" height="28" fill="none" stroke="#34d399" strokeWidth="1.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Check your inbox</h2>
                <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed mb-1">
                  We sent a password reset link to
                </p>
                <p className="text-blue-500 font-semibold text-sm mb-6">{resetEmail}</p>
                <p className="text-slate-400 dark:text-zinc-500 text-xs mb-8">
                  Didn't receive it? Check your spam folder, or{' '}
                  <button onClick={() => setMode('forgot')} className="text-blue-400 hover:underline">try again</button>.
                </p>
                <button onClick={() => setMode('signin')}
                  className="text-sm text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300 transition">
                  ← Back to sign in
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
