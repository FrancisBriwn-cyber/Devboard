
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { SunIcon, MoonIcon } from './Icons';

function GridIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
}
function ListIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>;
}
function SearchIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
}
function NewsIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 0-2 2z"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6z"/></svg>;
}
function UserIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
}
function LogoutIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
}
function SettingsIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
}

// Core nav — shown everywhere (desktop sidebar + mobile bottom bar)
const navLinks = [
  { path: '/dashboard', label: 'Dashboard', Icon: GridIcon },
  { path: '/tracker',   label: 'Tracker',   Icon: ListIcon },
  { path: '/jobs',      label: 'Jobs',       Icon: SearchIcon },
  { path: '/news',      label: 'News',       Icon: NewsIcon },
  { path: '/profile',   label: 'Profile',    Icon: UserIcon },
];

export default function Sidebar() {
  const location   = useLocation();
  const navigate   = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);
  const setProfile = useAuthStore((s) => s.setProfile);
  const profile    = useAuthStore((s) => s.profile);
  const session    = useAuthStore((s) => s.session);
  const { dark, toggle } = useThemeStore();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
    navigate('/login');
  };

  return (
    // Light mode: dark sidebar  |  Dark mode: white sidebar  |  Hidden on mobile
    <aside className="w-56 shrink-0 hidden md:flex flex-col h-screen sticky top-0
      bg-zinc-950 border-r border-zinc-800/60
      dark:bg-white dark:border-slate-200">

      {/* Logo + theme toggle */}
      <div className="px-5 py-5 flex items-center justify-between
        border-b border-zinc-800/60 dark:border-slate-200">
        <Link to="/dashboard" className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-blue-900/50">
            D
          </span>
          <span className="text-white dark:text-slate-800 font-bold text-base tracking-tight">DevBoard</span>
        </Link>
        <button
          onClick={toggle}
          className="w-7 h-7 rounded-lg flex items-center justify-center transition-all
            bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white
            dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-500 dark:hover:text-slate-800"
          title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {dark ? <SunIcon size={14} /> : <MoonIcon size={14} />}
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navLinks.map(({ path, label, Icon }) => {
          const active = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/70 dark:text-slate-500 dark:hover:text-slate-900 dark:hover:bg-slate-100'
              }`}
            >
              <Icon />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="px-3 py-4 space-y-1 border-t border-zinc-800/60 dark:border-slate-200">
        {/* User info row */}
        <div className="flex items-center gap-3 px-2 py-2">
          {profile?.avatar ? (
            <img src={profile.avatar} alt="avatar"
              className="w-8 h-8 rounded-xl border border-zinc-700 dark:border-slate-200 shrink-0" />
          ) : (
            <div className="w-8 h-8 rounded-xl bg-zinc-700 dark:bg-slate-200 flex items-center justify-center text-white dark:text-slate-700 text-xs font-bold shrink-0">
              {session?.user.email?.[0].toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-white dark:text-slate-800 text-xs font-semibold truncate">
              {session?.user.email?.split('@')[0]}
            </p>
            <p className="text-zinc-500 dark:text-slate-400 text-xs truncate">
              {session?.user.email}
            </p>
          </div>
        </div>

        {/* Settings link */}
        <Link to="/settings"
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all ${
            location.pathname === '/settings'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800/70 dark:text-slate-500 dark:hover:text-slate-900 dark:hover:bg-slate-100'
          }`}>
          <SettingsIcon />
          Settings
        </Link>

        {/* Sign out */}
        <button onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all
            text-zinc-400 hover:text-red-400 hover:bg-red-400/10
            dark:text-slate-500 dark:hover:text-red-500 dark:hover:bg-red-50">
          <LogoutIcon />
          Sign out
        </button>
      </div>
    </aside>
  );
}

/* ── Bottom tab bar shown only on mobile (5 items — no overflow) ── */
export function MobileNav() {
  const location = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50
      bg-zinc-950 dark:bg-white border-t border-zinc-800/60 dark:border-slate-200
      flex items-center justify-around px-2 py-1">
      {navLinks.map(({ path, label, Icon }) => {
        const active = location.pathname === path;
        return (
          <Link
            key={path}
            to={path}
            className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all flex-1 ${
              active
                ? 'text-blue-400 dark:text-blue-600'
                : 'text-zinc-500 dark:text-slate-400'
            }`}
          >
            <Icon />
            <span className="text-[9px] font-medium">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
