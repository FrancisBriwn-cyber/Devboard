import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const INPUT = 'w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700/60 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition';

export default function ResetPasswordPage() {
  const navigate = useNavigate();

  const [password, setPassword]   = useState('');
  const [confirm, setConfirm]     = useState('');
  const [showPass, setShowPass]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [done, setDone]           = useState(false);
  const [ready, setReady]         = useState(false);
  const [invalid, setInvalid]     = useState(false);

  useEffect(() => {
    // Supabase fires PASSWORD_RECOVERY when the user clicks the reset link
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setReady(true);
    });

    // Also handle the case where the page loads with a valid session already set from the URL hash
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
      else {
        // Give the auth state listener 3 seconds before declaring the link invalid
        const timer = setTimeout(() => {
          supabase.auth.getSession().then(({ data: { session: s } }) => {
            if (!s) setInvalid(true);
          });
        }, 3000);
        return () => clearTimeout(timer);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleReset = async () => {
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    setLoading(true); setError('');
    const { error: err } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setDone(true);
    setTimeout(() => navigate('/login'), 3000);
  };

  /* ── Success state ── */
  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-900 px-8">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg width="28" height="28" fill="none" stroke="#34d399" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">Password updated!</h2>
          <p className="text-slate-500 dark:text-zinc-400 text-sm mb-6">
            Your password has been changed successfully. Redirecting you to sign in…
          </p>
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  /* ── Invalid / expired link ── */
  if (invalid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-900 px-8">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg width="28" height="28" fill="none" stroke="#f43f5e" strokeWidth="1.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">Link expired</h2>
          <p className="text-slate-500 dark:text-zinc-400 text-sm mb-8">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <Link to="/login"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl text-sm font-semibold transition shadow-lg shadow-blue-900/40">
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  /* ── Loading / waiting for auth event ── */
  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-900">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  /* ── Reset form ── */
  return (
    <div className="min-h-screen flex">

      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex-col justify-between p-12">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white font-black text-sm">D</span>
          <span className="text-white font-bold text-lg tracking-tight">DevBoard</span>
        </div>
        <div>
          <h2 className="text-4xl font-bold text-white leading-snug mb-4">Set a new<br />password.</h2>
          <p className="text-blue-200 text-base leading-relaxed">
            Choose a strong password you haven't used before. Make it at least 8 characters.
          </p>
        </div>
        <p className="text-blue-300 text-sm">© 2025 DevBoard</p>
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white dark:bg-zinc-900 p-8">
        <div className="w-full max-w-md">

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2 tracking-tight">New password</h1>
            <p className="text-slate-400 dark:text-zinc-500 text-sm">Enter and confirm your new password below.</p>
          </div>

          {error && (
            <div className="mb-5 flex items-start gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" className="shrink-0 mt-0.5">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-zinc-400 mb-1.5">New Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} placeholder="Min. 6 characters" value={password}
                  onChange={(e) => setPassword(e.target.value)} className={`${INPUT} pr-11`} autoFocus />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 transition">
                  {showPass
                    ? <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
              {/* Strength bar */}
              {password && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex gap-1 flex-1">
                    {[6, 8, 10].map((len, i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all ${
                        password.length >= len
                          ? i === 0 ? 'bg-red-400' : i === 1 ? 'bg-yellow-400' : 'bg-emerald-400'
                          : 'bg-slate-200 dark:bg-zinc-700'
                      }`} />
                    ))}
                  </div>
                  <span className="text-xs text-slate-400 dark:text-zinc-500">
                    {password.length < 6 ? 'Too short' : password.length < 8 ? 'Weak' : password.length < 10 ? 'Good' : 'Strong'}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-zinc-400 mb-1.5">Confirm Password</label>
              <input type="password" placeholder="••••••••" value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleReset()}
                className={`${INPUT} ${confirm && confirm !== password ? 'ring-2 ring-red-400 border-red-300' : ''}`} />
              {confirm && confirm !== password && (
                <p className="text-xs text-red-400 mt-1.5">Passwords do not match</p>
              )}
            </div>
          </div>

          <button onClick={handleReset} disabled={loading || !password || !confirm}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white py-3 rounded-xl font-semibold text-sm transition shadow-lg shadow-blue-900/40">
            {loading
              ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Updating…</>
              : 'Update password'
            }
          </button>

        </div>
      </div>
    </div>
  );
}
