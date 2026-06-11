import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { ParticleTextEffect } from '@/components/ui/particle-text-effect';

const INPUT = 'w-full bg-slate-50 dark:bg-zinc-700/50 border border-slate-200 dark:border-zinc-600 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition';

/* ── Tech banner ── */
function SettingsBanner() {
  const floats = [
    { text: '"theme": "dark"',        cls: 'top-4 left-[52%]' },
    { text: 'AUTH_ENABLED=true',       cls: 'top-6 right-10' },
    { text: 'NODE_ENV="production"',   cls: 'bottom-5 left-[38%]' },
    { text: '{ "version": "2.1.0" }', cls: 'bottom-4 right-8' },
    { text: 'localhost:5173',          cls: 'top-[38%] right-[22%]' },
    { text: 'config.json',             cls: 'bottom-7 left-8' },
    { text: '0xFF4088',                cls: 'top-[30%] left-[68%]' },
    { text: 'SECURE=true',             cls: 'top-5 left-[28%]' },
  ];

  return (
    <div className="h-44 rounded-2xl relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0d1117 0%, #0f172a 60%, #0d1117 100%)' }}>

      {/* SVG dot grid */}
      <svg className="absolute inset-0 w-full h-full opacity-100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="cfg-dots" width="22" height="22" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1" fill="rgba(99,102,241,0.35)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cfg-dots)" />
      </svg>

      {/* Left indigo glow */}
      <div className="absolute left-0 top-0 bottom-0 w-48 bg-gradient-to-r from-indigo-600/25 to-transparent pointer-events-none" />
      {/* Top glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

      {/* Floating config snippets */}
      {floats.map((f, i) => (
        <span key={i} className={`absolute font-mono text-[11px] text-indigo-300/30 select-none whitespace-nowrap ${f.cls}`}>
          {f.text}
        </span>
      ))}

      {/* Horizontal scan line */}
      <div className="absolute left-0 right-0 h-px top-1/2 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />

      {/* Main content */}
      <div className="absolute inset-0 flex items-center justify-between px-8">
        <div className="flex items-center gap-4">
          {/* Gear icon in glassy box */}
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center backdrop-blur-sm shadow-lg shadow-indigo-900/30">
            <svg width="26" height="26" fill="none" stroke="#818cf8" strokeWidth="1.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </div>
          <div>
            <p className="text-indigo-400/70 text-xs font-mono mb-1 tracking-widest uppercase">System</p>
            <h1 className="text-2xl font-black text-white tracking-tight">Settings</h1>
            <p className="text-white/35 text-xs font-mono mt-0.5">Configuration &amp; preferences</p>
          </div>
        </div>

        {/* Version badge */}
        <div className="hidden sm:flex flex-col items-end gap-1.5">
          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white/60 text-xs font-mono">DevBoard v2.1</span>
          </div>
          <span className="text-white/20 text-[10px] font-mono">{new Date().toISOString().split('T')[0]}</span>
        </div>
      </div>
    </div>
  );
}

const SECTION_ACCENTS: Record<string, string> = {
  blue:   'border-t-4 border-t-blue-500',
  purple: 'border-t-4 border-t-violet-500',
  amber:  'border-t-4 border-t-amber-400',
  slate:  'border-t-4 border-t-slate-400',
  rose:   'border-t-4 border-t-rose-500',
};

function Section({ title, desc, accent = 'blue', icon, children }: {
  title: string; desc?: string; accent?: string; icon?: React.ReactNode; children: React.ReactNode
}) {
  return (
    <div className={`bg-white dark:bg-zinc-800 rounded-2xl shadow-sm overflow-hidden ${SECTION_ACCENTS[accent] ?? ''}`}>
      <div className="px-6 py-4 border-b border-slate-100 dark:border-zinc-700/50 flex items-center gap-3">
        {icon && <span className="text-slate-400 dark:text-zinc-500">{icon}</span>}
        <div>
          <h2 className="text-sm font-bold text-slate-800 dark:text-white">{title}</h2>
          {desc && <p className="text-xs text-slate-400 dark:text-zinc-500 mt-0.5">{desc}</p>}
        </div>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4 border-b border-slate-100 dark:border-zinc-700/40 last:border-0 last:pb-0 first:pt-0">
      <div className="shrink-0">
        <p className="text-sm font-medium text-slate-700 dark:text-zinc-200">{label}</p>
        {hint && <p className="text-xs text-slate-400 dark:text-zinc-500 mt-0.5">{hint}</p>}
      </div>
      <div className="sm:max-w-xs w-full">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const navigate   = useNavigate();
  const session    = useAuthStore((s) => s.session);
  const profile    = useAuthStore((s) => s.profile);
  const setSession = useAuthStore((s) => s.setSession);
  const setProfile = useAuthStore((s) => s.setProfile);
  const { dark, toggle } = useThemeStore();

  /* ── Change email ── */
  const [newEmail, setNewEmail]     = useState('');
  const [emailMsg, setEmailMsg]     = useState('');
  const [emailErr, setEmailErr]     = useState('');
  const [emailLoading, setEmailLoading] = useState(false);

  const handleChangeEmail = async () => {
    if (!newEmail.trim() || newEmail === session?.user.email) return;
    setEmailLoading(true); setEmailErr(''); setEmailMsg('');
    const { error } = await supabase.auth.updateUser({ email: newEmail.trim() });
    setEmailLoading(false);
    if (error) { setEmailErr(error.message); return; }
    setEmailMsg(`Confirmation sent to ${newEmail.trim()}. Check your inbox.`);
    setNewEmail('');
  };

  /* ── Change password ── */
  const [curPass, setCurPass]   = useState('');
  const [newPass, setNewPass]   = useState('');
  const [confPass, setConfPass] = useState('');
  const [passMsg, setPassMsg]   = useState('');
  const [passErr, setPassErr]   = useState('');
  const [passLoading, setPassLoading] = useState(false);
  const [showCur, setShowCur]   = useState(false);
  const [showNew, setShowNew]   = useState(false);

  const handleChangePassword = async () => {
    if (!curPass || !newPass || !confPass) { setPassErr('All fields are required.'); return; }
    if (newPass.length < 6)  { setPassErr('New password must be at least 6 characters.'); return; }
    if (newPass !== confPass) { setPassErr('New passwords do not match.'); return; }
    setPassLoading(true); setPassErr(''); setPassMsg('');

    // Verify current password
    const { error: verifyErr } = await supabase.auth.signInWithPassword({
      email: session?.user.email ?? '', password: curPass,
    });
    if (verifyErr) { setPassLoading(false); setPassErr('Current password is incorrect.'); return; }

    const { error } = await supabase.auth.updateUser({ password: newPass });
    setPassLoading(false);
    if (error) { setPassErr(error.message); return; }
    setPassMsg('Password updated successfully.'); setCurPass(''); setNewPass(''); setConfPass('');
  };

  /* ── Sign out ── */
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null); setProfile(null);
    navigate('/login');
  };

  /* ── Delete account ── */
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const CONFIRM_PHRASE = 'delete my account';

  const handleDeleteAccount = async () => {
    if (deleteInput.toLowerCase() !== CONFIRM_PHRASE) return;
    setDeleteLoading(true);
    // Delete profile data first
    if (session?.user.id) {
      await supabase.from('profiles').delete().eq('id', session.user.id);
    }
    await supabase.auth.signOut();
    setSession(null); setProfile(null);
    navigate('/login');
  };

  const EyeOff = () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
  const EyeOn  = () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;

  return (
    <div className="relative min-h-full overflow-hidden bg-slate-100/80 dark:bg-zinc-950/88 px-4 md:px-8 py-6 md:py-8">
      <ParticleTextEffect backgroundMode words={["Settings", "Control", "Theme"]} particleColor="primary" />
      <div className="absolute inset-0 bg-slate-100/70 dark:bg-zinc-950/75 pointer-events-none" />
      <div className="max-w-2xl mx-auto space-y-5">

        {/* ── Tech banner ── */}
        <SettingsBanner />

        {/* ── Account info ── */}
        <Section title="Account" desc="Your DevBoard account details" accent="blue"
          icon={<svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}>
          <div className="flex items-center gap-4 pb-5 border-b border-slate-100 dark:border-zinc-700/40 mb-1">
            {profile?.avatar
              ? <img src={profile.avatar} alt="avatar" className="w-14 h-14 rounded-2xl border-2 border-slate-200 dark:border-zinc-600 object-cover shrink-0" />
              : <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-xl font-bold shrink-0">
                  {session?.user.email?.[0].toUpperCase()}
                </div>
            }
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-800 dark:text-white truncate">
                {profile?.full_name || session?.user.email?.split('@')[0]}
              </p>
              <p className="text-sm text-slate-400 dark:text-zinc-500 truncate">{session?.user.email}</p>
              {profile?.title && <p className="text-xs text-slate-400 dark:text-zinc-600 mt-0.5">{profile.title}</p>}
            </div>
            <Link to="/profile"
              className="shrink-0 flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-600 text-slate-500 dark:text-zinc-400 hover:border-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition font-medium">
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Edit Profile
            </Link>
          </div>

          {/* Change email */}
          <Row label="Email address" hint="Update the email you sign in with">
            <div className="space-y-2">
              <input type="email" placeholder={session?.user.email ?? ''} value={newEmail}
                onChange={e => { setNewEmail(e.target.value); setEmailErr(''); setEmailMsg(''); }}
                className={INPUT} />
              {emailErr && <p className="text-xs text-red-400">{emailErr}</p>}
              {emailMsg && <p className="text-xs text-emerald-500">{emailMsg}</p>}
              <button onClick={handleChangeEmail} disabled={emailLoading || !newEmail.trim() || newEmail === session?.user.email}
                className="w-full py-2 rounded-xl bg-slate-800 dark:bg-zinc-700 hover:bg-slate-700 dark:hover:bg-zinc-600 disabled:opacity-40 text-white text-xs font-semibold transition">
                {emailLoading ? 'Sending…' : 'Change email'}
              </button>
            </div>
          </Row>
        </Section>

        {/* ── Change password ── */}
        <Section title="Password" desc="Update your sign-in password" accent="purple"
          icon={<svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>}>
          <div className="space-y-3">
            {[
              { label: 'Current password', val: curPass, set: setCurPass, show: showCur, toggle: () => setShowCur(v => !v) },
              { label: 'New password',     val: newPass, set: setNewPass, show: showNew, toggle: () => setShowNew(v => !v) },
              { label: 'Confirm new password', val: confPass, set: setConfPass, show: false, toggle: null },
            ].map(({ label, val, set, show, toggle: tog }) => (
              <div key={label}>
                <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">{label}</label>
                <div className="relative">
                  <input type={show ? 'text' : 'password'} placeholder="••••••••" value={val}
                    onChange={e => { set(e.target.value); setPassErr(''); setPassMsg(''); }}
                    className={`${INPUT} ${tog ? 'pr-9' : ''}`} />
                  {tog && (
                    <button type="button" onClick={tog}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 transition">
                      {show ? <EyeOff /> : <EyeOn />}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {passErr && (
              <p className="flex items-center gap-1.5 text-xs text-red-400">
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {passErr}
              </p>
            )}
            {passMsg && (
              <p className="flex items-center gap-1.5 text-xs text-emerald-500">
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                {passMsg}
              </p>
            )}

            <button onClick={handleChangePassword} disabled={passLoading || !curPass || !newPass || !confPass}
              className="w-full py-2.5 rounded-xl bg-slate-800 dark:bg-zinc-700 hover:bg-slate-700 dark:hover:bg-zinc-600 disabled:opacity-40 text-white text-sm font-semibold transition">
              {passLoading ? 'Updating…' : 'Update password'}
            </button>
          </div>
        </Section>

        {/* ── Appearance ── */}
        <Section title="Appearance" desc="Customise how DevBoard looks" accent="amber"
          icon={<svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>}>
          <Row label="Theme" hint="Choose between light and dark mode">
            <div className="flex bg-slate-100 dark:bg-zinc-700/50 rounded-xl p-1 gap-1">
              <button onClick={() => { if (dark) toggle(); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
                  !dark ? 'bg-white dark:bg-zinc-600 text-slate-800 shadow-sm' : 'text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300'
                }`}>
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                Light
              </button>
              <button onClick={() => { if (!dark) toggle(); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
                  dark ? 'bg-zinc-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'
                }`}>
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                Dark
              </button>
            </div>
          </Row>
        </Section>

        {/* ── Session ── */}
        <Section title="Session" desc="Manage your active sign-in" accent="slate"
          icon={<svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-700 dark:text-zinc-200 font-medium">Sign out</p>
              <p className="text-xs text-slate-400 dark:text-zinc-500 mt-0.5">Ends your current session on this device</p>
            </div>
            <button onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-600 text-slate-600 dark:text-zinc-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-zinc-700 transition">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Sign out
            </button>
          </div>
        </Section>

        {/* ── Danger Zone ── */}
        <Section title="Danger Zone" desc="Irreversible actions — proceed with caution" accent="rose"
          icon={<svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>}>
          {!showDeleteConfirm ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-rose-600 dark:text-rose-400 font-medium">Delete account</p>
                <p className="text-xs text-slate-400 dark:text-zinc-500 mt-0.5">Permanently deletes your account and all data</p>
              </div>
              <button onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-rose-200 dark:border-rose-500/30 text-rose-500 dark:text-rose-400 text-sm font-medium hover:bg-rose-50 dark:hover:bg-rose-500/10 transition">
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                Delete account
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-xl">
                <svg width="16" height="16" fill="none" stroke="#f43f5e" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" className="shrink-0 mt-0.5">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                <p className="text-xs text-rose-600 dark:text-rose-400 leading-relaxed">
                  This will permanently delete your account, profile, and all tracked applications. <strong>This cannot be undone.</strong>
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1.5">
                  Type <span className="text-rose-500 font-bold font-mono">delete my account</span> to confirm
                </label>
                <input value={deleteInput} onChange={e => setDeleteInput(e.target.value)}
                  placeholder="delete my account"
                  className="w-full bg-white dark:bg-zinc-700/50 border border-rose-200 dark:border-rose-500/30 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-rose-500 transition font-mono" />
              </div>

              <div className="flex gap-3">
                <button onClick={handleDeleteAccount}
                  disabled={deleteLoading || deleteInput.toLowerCase() !== CONFIRM_PHRASE}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white text-sm font-semibold transition">
                  {deleteLoading ? 'Deleting…' : 'Delete my account'}
                </button>
                <button onClick={() => { setShowDeleteConfirm(false); setDeleteInput(''); }}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-600 text-slate-600 dark:text-zinc-400 text-sm hover:bg-slate-50 dark:hover:bg-zinc-700 transition">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </Section>

      </div>
    </div>
  );
}
