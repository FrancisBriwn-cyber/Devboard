import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

const INPUT = 'w-full bg-transparent border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition';

function mapAuthError(msg: string): string {
  if (msg.includes('Invalid login credentials')) return 'Wrong email or password.';
  if (msg.includes('Email not confirmed'))        return 'Please confirm your email first.';
  if (msg.includes('Too many requests'))          return 'Too many attempts. Wait a moment.';
  return msg;
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
    if (!email || !password) { setError('Please fill in both fields.'); return; }
    setLoading(true); setError('');
    const { data, error: authErr } = await supabase.auth.signInWithPassword({ email, password });
    if (authErr) { setError(mapAuthError(authErr.message)); setLoading(false); return; }
    setSession(data.session);
    navigate('/dashboard');
  };

  const handleForgot = async () => {
    if (!resetEmail.trim()) { setResetError('Enter your email address.'); return; }
    setResetLoading(true); setResetError('');
    const { error: err } = await supabase.auth.resetPasswordForEmail(resetEmail.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setResetLoading(false);
    if (err) { setResetError(err.message); return; }
    setMode('sent');
  };

  return (
    <div className="min-h-screen flex bg-[#09090b] text-white">

      {/* ── LEFT ── */}
      <div className="hidden lg:flex w-[480px] shrink-0 flex-col justify-between p-14 border-r border-zinc-900">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm">D</div>
          <span className="font-semibold text-sm tracking-tight">DevBoard</span>
        </div>

        {/* Main copy */}
        <div>
          <p className="text-zinc-600 text-xs font-mono mb-6 tracking-widest uppercase">Developer Career OS</p>

          <h1 className="text-[2.6rem] font-black leading-[1.1] tracking-tight text-white mb-6">
            Your job<br />search,<br />organised.
          </h1>

          <div className="w-8 h-px bg-blue-600 mb-6" />

          <p className="text-zinc-500 text-sm leading-relaxed max-w-[260px]">
            Track applications, browse remote jobs, and manage your developer profile — in one place.
          </p>

          {/* Simple feature list */}
          <ul className="mt-8 space-y-3">
            {[
              'Application tracker with Kanban & list view',
              'Live remote job board — 1,000+ roles',
              'GitHub profile explorer',
              'Developer news from Hacker News',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-zinc-500">
                <span className="w-1 h-1 rounded-full bg-blue-500 shrink-0 mt-[7px]" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-zinc-700 text-xs">© 2025 DevBoard</p>
      </div>

      {/* ── RIGHT ── */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-10 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm">D</div>
            <span className="font-semibold text-sm">DevBoard</span>
          </div>

          {/* ════ SIGN IN ════ */}
          {mode === 'signin' && (
            <>
              <h2 className="text-2xl font-bold mb-1">Sign in</h2>
              <p className="text-zinc-500 text-sm mb-8">Enter your credentials to continue.</p>

              {error && (
                <p className="text-red-400 text-sm mb-5 px-4 py-2.5 bg-red-500/8 border border-red-500/15 rounded-lg">{error}</p>
              )}

              <div className="space-y-3 mb-4">
                <input
                  type="email" placeholder="Email address" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={INPUT}
                />
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'} placeholder="Password" value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    className={`${INPUT} pr-11`}
                  />
                  <button type="button" onClick={() => setShowPass(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition">
                    {showPass
                      ? <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      : <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </button>
                </div>
              </div>

              <div className="flex justify-end mb-6">
                <button onClick={() => { setMode('forgot'); setResetEmail(email); }}
                  className="text-xs text-zinc-500 hover:text-zinc-300 transition">
                  Forgot password?
                </button>
              </div>

              <button onClick={handleLogin} disabled={loading}
                className="w-full bg-white text-black py-3 rounded-lg text-sm font-bold hover:bg-zinc-100 transition disabled:opacity-40 flex items-center justify-center gap-2">
                {loading
                  ? <><div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" /> Signing in…</>
                  : 'Continue'
                }
              </button>

              <p className="text-center text-zinc-600 text-sm mt-6">
                No account?{' '}
                <Link to="/register" className="text-white hover:text-zinc-300 transition font-medium">Sign up free</Link>
              </p>
            </>
          )}

          {/* ════ FORGOT ════ */}
          {mode === 'forgot' && (
            <>
              <button onClick={() => setMode('signin')}
                className="flex items-center gap-2 text-zinc-500 hover:text-zinc-300 text-sm transition mb-8">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
                Back
              </button>
              <h2 className="text-2xl font-bold mb-1">Reset password</h2>
              <p className="text-zinc-500 text-sm mb-8">We'll email you a secure link.</p>

              {resetError && (
                <p className="text-red-400 text-sm mb-5 px-4 py-2.5 bg-red-500/8 border border-red-500/15 rounded-lg">{resetError}</p>
              )}

              <input type="email" placeholder="Email address" value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleForgot()}
                className={`${INPUT} mb-4`} autoFocus />

              <button onClick={handleForgot} disabled={resetLoading}
                className="w-full bg-white text-black py-3 rounded-lg text-sm font-bold hover:bg-zinc-100 transition disabled:opacity-40 flex items-center justify-center gap-2">
                {resetLoading
                  ? <><div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" /> Sending…</>
                  : 'Send reset link'
                }
              </button>
            </>
          )}

          {/* ════ SENT ════ */}
          {mode === 'sent' && (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center mx-auto mb-5">
                <svg width="20" height="20" fill="none" stroke="#22c55e" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <h2 className="text-xl font-bold mb-2">Check your inbox</h2>
              <p className="text-zinc-500 text-sm mb-1">Reset link sent to</p>
              <p className="text-white text-sm font-medium mb-6">{resetEmail}</p>
              <button onClick={() => setMode('signin')}
                className="text-zinc-500 hover:text-zinc-300 text-sm transition">← Back to sign in</button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
