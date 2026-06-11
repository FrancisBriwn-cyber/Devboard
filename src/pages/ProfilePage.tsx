import { useState, useEffect } from 'react';
import { useFetch } from '../hooks/useFetch';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { ParticleTextEffect } from '@/components/ui/particle-text-effect';

const AVATARS = [
  'https://api.dicebear.com/7.x/micah/svg?seed=Felix&backgroundColor=b6e3f4',
  'https://api.dicebear.com/7.x/micah/svg?seed=Aneka&backgroundColor=ffd5dc',
  'https://api.dicebear.com/7.x/micah/svg?seed=Bella&backgroundColor=c0aede',
  'https://api.dicebear.com/7.x/micah/svg?seed=Chase&backgroundColor=d1f4d1',
  'https://api.dicebear.com/7.x/micah/svg?seed=Zara&backgroundColor=ffdfbf',
  'https://api.dicebear.com/7.x/micah/svg?seed=Leo&backgroundColor=b6e3f4',
  'https://api.dicebear.com/7.x/micah/svg?seed=Mia&backgroundColor=ffd5dc',
  'https://api.dicebear.com/7.x/micah/svg?seed=Noah&backgroundColor=c0aede',
  'https://api.dicebear.com/7.x/micah/svg?seed=Lily&backgroundColor=d1f4d1',
  'https://api.dicebear.com/7.x/micah/svg?seed=Jake&backgroundColor=ffdfbf',
  'https://api.dicebear.com/7.x/micah/svg?seed=Luna&backgroundColor=b6e3f4',
  'https://api.dicebear.com/7.x/micah/svg?seed=Kai&backgroundColor=ffd5dc',
  'https://api.dicebear.com/7.x/micah/svg?seed=Adrian&backgroundColor=e0f2fe',
  'https://api.dicebear.com/7.x/micah/svg?seed=Diana&backgroundColor=fce7f3',
  'https://api.dicebear.com/7.x/micah/svg?seed=Marcus&backgroundColor=ede9fe',
  'https://api.dicebear.com/7.x/micah/svg?seed=Serena&backgroundColor=dcfce7',
  'https://api.dicebear.com/7.x/micah/svg?seed=Victor&backgroundColor=fef3c7',
  'https://api.dicebear.com/7.x/micah/svg?seed=Elena&backgroundColor=e0f2fe',
];

const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: '#f7df1e', TypeScript: '#3178c6', Python: '#3572A5',
  Rust: '#dea584', Go: '#00ADD8', CSS: '#563d7c', HTML: '#e34c26',
  Vue: '#42b883', Swift: '#fa7343', Kotlin: '#7f52ff', Dart: '#00b4ab',
  Ruby: '#701516', PHP: '#777bb4', Shell: '#89e051', Java: '#b07219',
  'C++': '#f34b7d', C: '#555555',
};

const REPO_BORDER_COLORS = [
  'border-l-blue-400', 'border-l-violet-400', 'border-l-emerald-400',
  'border-l-orange-400', 'border-l-pink-400', 'border-l-cyan-400',
];

const INPUT = 'w-full bg-slate-50 dark:bg-zinc-700/50 border border-slate-200 dark:border-zinc-600 rounded-xl px-3 py-2.5 text-sm text-slate-800 dark:text-white placeholder-slate-300 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition';

/* ── GitHub contribution graph colours ── */
function ghCell(i: number): string {
  const s = Math.abs(Math.sin(i * 127.1 + i * 0.33 + 311.7));
  const b = s < 0.42 ? 0 : s < 0.62 ? 1 : s < 0.78 ? 2 : s < 0.92 ? 3 : 4;
  return ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'][b];
}

function GitHubBanner() {
  return (
    <div className="h-44 rounded-t-2xl relative overflow-hidden" style={{ background: '#0d1117' }}>

      {/* contribution graph fills the banner */}
      <div className="absolute inset-0 px-5 py-4 flex flex-col gap-[3px]">
        {Array.from({ length: 7 }, (_, row) => (
          <div key={row} className="flex gap-[3px] flex-1">
            {Array.from({ length: 53 }, (_, col) => (
              <div key={col} className="flex-1 rounded-[2px]"
                style={{ backgroundColor: ghCell(row * 53 + col) }} />
            ))}
          </div>
        ))}
      </div>

      {/* left + right edge fade */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0d1117]/80 via-transparent to-[#0d1117]/80 pointer-events-none" />
      {/* top + bottom fade */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d1117]/60 via-transparent to-[#0d1117]/70 pointer-events-none" />

      {/* top-left — commit count */}
      <div className="absolute top-3 left-5 z-10 flex items-center gap-1.5 text-[11px] font-mono text-white/50">
        <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" className="text-green-500/70">
          <path d="M11.93 8.5a4.002 4.002 0 0 1-7.86 0H.75a.75.75 0 0 1 0-1.5h3.32a4.002 4.002 0 0 1 7.86 0h3.32a.75.75 0 0 1 0 1.5h-3.32ZM8 6a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z"/>
        </svg>
        <span>247 contributions this year</span>
      </div>

      {/* top-right — branch badge */}
      <div className="absolute top-3 right-5 z-10 flex items-center gap-1.5 border border-white/10 bg-white/5 backdrop-blur-sm px-2.5 py-1 rounded-full">
        <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor" className="text-green-400">
          <path d="M9.5 3.25a2.25 2.25 0 1 1 3 2.122V6A2.5 2.5 0 0 1 10 8.5H6a1 1 0 0 0-1 1v1.128a2.251 2.251 0 1 1-1.5 0V5.372a2.25 2.25 0 1 1 1.5 0v1.836A2.492 2.492 0 0 1 6 7h4a1 1 0 0 0 1-1v-.628A2.25 2.25 0 0 1 9.5 3.25Z"/>
        </svg>
        <span className="text-white/70 text-[11px] font-mono">main</span>
      </div>

      {/* bottom-left — terminal prompt */}
      <div className="absolute bottom-3 left-5 z-10 flex items-center gap-1.5 font-mono text-[11px]">
        <span className="text-green-500">$</span>
        <span className="text-green-300/80">git push origin main</span>
        <span className="w-[7px] h-[13px] bg-green-400/70 rounded-[1px] animate-pulse" />
      </div>

      {/* bottom-right — language badge */}
      <div className="absolute bottom-3 right-5 z-10 flex items-center gap-1.5 text-[11px] font-mono text-white/40">
        <span className="w-2 h-2 rounded-full bg-yellow-400" />
        <span>TypeScript</span>
        <span className="mx-1 text-white/20">·</span>
        <span className="w-2 h-2 rounded-full bg-blue-400" />
        <span>React</span>
      </div>
    </div>
  );
}

interface GitHubUser {
  login: string; name: string | null; avatar_url: string; bio: string | null;
  public_repos: number; followers: number; following: number; html_url: string;
  location?: string | null; company?: string | null; blog?: string | null;
  twitter_username?: string | null; email?: string | null;
}
interface GitHubRepo {
  id: number; name: string; description: string | null;
  stargazers_count: number; language: string | null; html_url: string; fork: boolean;
}

interface ProfileForm {
  full_name: string; title: string; bio: string;
  phone: string; dob: string; location: string;
  github: string; twitter: string; linkedin: string; website: string;
}

export default function ProfilePage() {
  const profile    = useAuthStore((s) => s.profile);
  const setProfile = useAuthStore((s) => s.setProfile);
  const session    = useAuthStore((s) => s.session);

  const [avatar, setAvatar]           = useState(profile?.avatar ?? AVATARS[0]);
  const [showPicker, setShowPicker]   = useState(false);
  const [editMode, setEditMode]       = useState(false);
  const [saving, setSaving]           = useState(false);
  const [saved, setSaved]             = useState(false);

  const [form, setForm] = useState<ProfileForm>({
    full_name: '', title: '', bio: '',
    phone: '', dob: '', location: '',
    github: '', twitter: '', linkedin: '', website: '',
  });

  // Sync form from store whenever profile loads/changes
  useEffect(() => {
    if (!profile) return;
    setAvatar(profile.avatar ?? AVATARS[0]);
    setForm({
      full_name: profile.full_name ?? '',
      title:     profile.title     ?? '',
      bio:       profile.bio       ?? '',
      phone:     profile.phone     ?? '',
      dob:       profile.dob       ?? '',
      location:  profile.location  ?? '',
      github:    profile.github    ?? '',
      twitter:   profile.twitter   ?? '',
      linkedin:  profile.linkedin  ?? '',
      website:   profile.website   ?? '',
    });
  }, [profile]);

  const handleSaveProfile = async () => {
    if (!session) return;
    setSaving(true);
    const payload = { id: session.user.id, email: session.user.email, avatar, ...form };
    await supabase.from('profiles').upsert(payload);
    setProfile({ ...payload, email: session.user.email ?? '' });
    setSaving(false); setSaved(true); setEditMode(false);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleSaveAvatar = async () => {
    if (!session) return;
    setSaving(true);
    await supabase.from('profiles').upsert({ id: session.user.id, email: session.user.email, avatar });
    setProfile({ ...profile!, avatar });
    setSaving(false); setSaved(true); setShowPicker(false);
    setTimeout(() => setSaved(false), 2500);
  };

  /* ── GitHub explorer ── */
  const [username, setUsername] = useState('');
  const [query, setQuery]       = useState('');
  const handleSearch = () => { if (username.trim()) setQuery(username.trim()); };

  // Auto-load the user's linked GitHub when profile loads or github username changes
  useEffect(() => {
    if (profile?.github) {
      setQuery(profile.github);
      setUsername(profile.github);
    }
  }, [profile?.github]);

  const { data: ghUser, loading: ghLoading, error: ghError } =
    useFetch<GitHubUser>(query ? `https://api.github.com/users/${query}` : '');
  const { data: repos, loading: reposLoading } =
    useFetch<GitHubRepo[]>(query ? `https://api.github.com/users/${query}/repos?sort=stars&per_page=6` : '');
  const ownRepos = Array.isArray(repos) ? repos.filter((r) => !r.fork) : [];

  const displayName  = form.full_name || session?.user.email?.split('@')[0] || 'Your Name';
  const displayTitle = form.title || 'Add your title';

  /* ── helpers ── */
  const field = (key: keyof ProfileForm, val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const InfoRow = ({ icon, text, href }: { icon: React.ReactNode; text: string; href?: string }) => (
    <div className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-zinc-400">
      <span className="text-slate-400 dark:text-zinc-500 shrink-0">{icon}</span>
      {href
        ? <a href={href} target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:underline truncate">{text}</a>
        : <span className="truncate">{text}</span>
      }
    </div>
  );

  const GhIntroRow = ({ icon, text, href }: { icon: React.ReactNode; text: string; href?: string }) => (
    <div className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-zinc-400">
      <span className="text-slate-400 dark:text-zinc-500 shrink-0">{icon}</span>
      {href
        ? <a href={href} target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:underline truncate">{text}</a>
        : <span className="truncate">{text}</span>
      }
    </div>
  );

  /* ── icons ── */
  const PinIcon   = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
  const PhoneIcon = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.18 2 2 0 0 1 3.59 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.57a16 16 0 0 0 6.52 6.52l.97-.97a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
  const GlobeIcon = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
  const GhIcon    = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>;
  const TwIcon    = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>;
  const LiIcon    = () => <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24" className="text-slate-400"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;
  const CakeIcon  = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"/><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1"/><path d="M2 21h20"/><path d="M7 8v2"/><path d="M12 8v2"/><path d="M17 8v2"/><path d="M7 4h.01"/><path d="M12 4h.01"/><path d="M17 4h.01"/></svg>;
  const HomeIcon  = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
  const MailIcon  = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;

  return (
    <div className="relative min-h-full overflow-hidden bg-slate-100/80 dark:bg-zinc-950/88 px-4 md:px-8 py-6 md:py-8">
      <ParticleTextEffect backgroundMode words={["Profile", "DevBoard", "Your Story"]} particleColor="primary" />
      <div className="absolute inset-0 bg-slate-100/70 dark:bg-zinc-950/70 pointer-events-none" />
      <div className="max-w-5xl mx-auto space-y-6 md:space-y-8">

        {/* ── Page header ── */}
        <div>
          <p className="text-xs text-slate-400 dark:text-zinc-500 mb-0.5">
            Home / <span className="text-indigo-500 font-medium">Profile</span>
          </p>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">User Profile</h1>
        </div>

        {/* ════════════════════════════════════════
            MY PROFILE
            ════════════════════════════════════════ */}

        {/* Profile card */}
        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-sm overflow-visible">

          {/* Banner */}
          <GitHubBanner />

          {/* Info row: spacer | avatar+name | edit button */}
          <div className="flex flex-col md:flex-row md:items-end px-4 md:px-8 pb-5 gap-3 md:gap-6">
            <div className="hidden md:block flex-1 pb-1" />

            {/* Avatar + name + title */}
            <div className="flex flex-col items-center shrink-0 -mt-12 md:-mt-14 relative self-center">
              <div className="relative group cursor-pointer" onClick={() => setShowPicker((v) => !v)}>
                <img src={avatar} alt="avatar"
                  className="w-24 h-24 rounded-full border-4 border-white dark:border-zinc-800 shadow-2xl object-cover" />
                <div className="absolute inset-0 rounded-full bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>
                  </svg>
                </div>
              </div>

              {/* Avatar picker */}
              {showPicker && (
                <div className="absolute top-full mt-2 w-80 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700/50 rounded-2xl shadow-xl p-5 z-50">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-slate-500 dark:text-zinc-400 text-xs font-semibold uppercase tracking-wider">Choose Avatar</p>
                    <button onClick={() => setShowPicker(false)} className="text-slate-300 hover:text-slate-500 text-xs">✕</button>
                  </div>
                  <div className="grid grid-cols-6 gap-2 max-h-52 overflow-y-auto mb-4">
                    {AVATARS.map((a) => (
                      <button key={a} onClick={() => setAvatar(a)}
                        className={`rounded-full p-0.5 border-2 transition-all ${avatar === a ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10' : 'border-transparent hover:border-slate-300 dark:hover:border-zinc-500'}`}>
                        <img src={a} alt="" className="w-full aspect-square rounded-full" />
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleSaveAvatar} disabled={saving}
                      className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition disabled:opacity-50">
                      {saving ? 'Saving…' : 'Save'}
                    </button>
                    <button onClick={() => setShowPicker(false)} className="text-slate-400 px-3 py-1.5 rounded-lg text-sm hover:text-slate-600 transition">Cancel</button>
                  </div>
                </div>
              )}

              <p className="mt-2 font-bold text-slate-800 dark:text-white text-base leading-tight">{displayName}</p>
              <p className="text-sm text-slate-400 dark:text-zinc-500">{displayTitle}</p>
            </div>

            {/* Right — Edit Profile / Save */}
            <div className="flex md:flex-1 justify-center md:justify-end items-center gap-3 md:pb-1">
              {saved && <span className="text-emerald-500 text-sm font-medium">✓ Saved!</span>}
              <button
                onClick={() => setEditMode((v) => !v)}
                className={`inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl transition shadow-sm ${editMode ? 'bg-slate-100 dark:bg-zinc-700 text-slate-600 dark:text-zinc-300' : 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-indigo-500/30'}`}
              >
                {editMode
                  ? <><svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>Cancel</>
                  : <><svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>Edit Profile</>
                }
              </button>
            </div>
          </div>

          {/* Tab bar */}
          <div className="border-t border-slate-100 dark:border-zinc-700/50 px-8">
            <button className="flex items-center gap-2 py-3 text-sm font-semibold text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500 -mb-px">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Profile
            </button>
          </div>
        </div>

        {/* Two-column: Introduction + Edit / Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">

          {/* LEFT — Introduction */}
          <div className="lg:col-span-1 bg-white dark:bg-zinc-800 rounded-2xl shadow-sm p-5">
            <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-4">Introduction</h3>

            {form.bio
              ? <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed mb-4">{form.bio}</p>
              : <p className="text-slate-300 dark:text-zinc-600 text-sm italic mb-4">No bio yet. Click Edit Profile to add one.</p>
            }

            <div className="space-y-3">
              {form.location  && <InfoRow icon={<PinIcon />}   text={form.location} />}
              {form.phone     && <InfoRow icon={<PhoneIcon />} text={form.phone} />}
              {form.dob       && <InfoRow icon={<CakeIcon />}  text={new Date(form.dob).toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' })} />}
              {form.website   && <InfoRow icon={<GlobeIcon />} text={form.website.replace(/^https?:\/\//, '')} href={form.website.startsWith('http') ? form.website : `https://${form.website}`} />}
              {form.github    && <InfoRow icon={<GhIcon />}    text={`github.com/${form.github}`} href={`https://github.com/${form.github}`} />}
              {form.twitter   && <InfoRow icon={<TwIcon />}    text={`@${form.twitter}`} />}
              {form.linkedin  && <InfoRow icon={<LiIcon />}    text={`linkedin.com/in/${form.linkedin}`} href={`https://linkedin.com/in/${form.linkedin}`} />}

              {!form.location && !form.phone && !form.dob && !form.website && !form.github && !form.twitter && !form.linkedin && (
                <p className="text-slate-300 dark:text-zinc-600 text-xs italic">No details yet — click Edit Profile.</p>
              )}
            </div>
          </div>

          {/* RIGHT — Edit form or profile summary */}
          <div className="lg:col-span-2">
            {editMode ? (
              <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-sm p-6">
                <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-5">Edit Profile</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {([
                    { key: 'full_name', label: 'Full Name',      placeholder: 'John Doe',             type: 'text' },
                    { key: 'title',     label: 'Title / Role',   placeholder: 'Full Stack Developer',  type: 'text' },
                    { key: 'phone',     label: 'Phone',          placeholder: '+234 800 000 0000',      type: 'tel'  },
                    { key: 'dob',       label: 'Date of Birth',  placeholder: '',                      type: 'date' },
                    { key: 'location',  label: 'Location',       placeholder: 'Lagos, Nigeria',         type: 'text' },
                    { key: 'website',   label: 'Website',        placeholder: 'yoursite.com',           type: 'text' },
                    { key: 'github',    label: 'GitHub',         placeholder: 'username',               type: 'text' },
                    { key: 'twitter',   label: 'Twitter / X',    placeholder: 'username',               type: 'text' },
                    { key: 'linkedin',  label: 'LinkedIn',       placeholder: 'yourname',               type: 'text' },
                  ] as { key: keyof ProfileForm; label: string; placeholder: string; type: string }[]).map(({ key, label, placeholder, type }) => (
                    <div key={key}>
                      <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">{label}</label>
                      <input
                        type={type}
                        value={form[key]}
                        onChange={(e) => field(key, e.target.value)}
                        placeholder={placeholder}
                        className={INPUT}
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">Bio</label>
                  <textarea
                    value={form.bio}
                    onChange={(e) => field('bio', e.target.value)}
                    placeholder="Write a short bio about yourself…"
                    rows={3}
                    className={`${INPUT} resize-none`}
                  />
                </div>
                <div className="flex items-center gap-3 mt-5">
                  <button onClick={handleSaveProfile} disabled={saving}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition disabled:opacity-50 shadow-sm shadow-indigo-500/30">
                    {saving ? 'Saving…' : 'Save Profile'}
                  </button>
                  <button onClick={() => setEditMode(false)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 px-4 py-2.5 rounded-xl text-sm transition">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-sm p-6">
                {form.full_name ? (
                  <>
                    <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-4">Profile Summary</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {([
                        { label: 'Full Name',   value: form.full_name },
                        { label: 'Title',       value: form.title },
                        { label: 'Email',       value: session?.user.email ?? '' },
                        { label: 'Phone',       value: form.phone },
                        { label: 'Date of Birth', value: form.dob ? new Date(form.dob).toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' }) : '' },
                        { label: 'Location',    value: form.location },
                        { label: 'GitHub',      value: form.github    ? `@${form.github}`   : '' },
                        { label: 'Twitter',     value: form.twitter   ? `@${form.twitter}`  : '' },
                        { label: 'LinkedIn',    value: form.linkedin  ? `in/${form.linkedin}` : '' },
                        { label: 'Website',     value: form.website   ? form.website.replace(/^https?:\/\//, '') : '' },
                      ] as { label: string; value: string }[]).filter((r) => r.value).map(({ label, value }) => (
                        <div key={label} className="bg-slate-50 dark:bg-zinc-700/50 rounded-xl px-4 py-3">
                          <p className="text-xs text-slate-400 dark:text-zinc-500 uppercase tracking-wider font-semibold mb-0.5">{label}</p>
                          <p className="text-sm text-slate-800 dark:text-white font-medium truncate">{value}</p>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-3">
                      <svg width="22" height="22" fill="none" stroke="#6366f1" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </div>
                    <p className="text-slate-600 dark:text-zinc-300 font-semibold text-sm mb-1">Complete your profile</p>
                    <p className="text-slate-400 dark:text-zinc-500 text-xs mb-3">Add your details so others can find and connect with you</p>
                    <button onClick={() => setEditMode(true)}
                      className="bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition">
                      Get Started
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ════════════════════════════════════════
            GITHUB EXPLORER
            ════════════════════════════════════════ */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-5 bg-indigo-500 rounded-full" />
            <h2 className="text-sm font-bold text-slate-700 dark:text-zinc-200 uppercase tracking-wider">GitHub Explorer</h2>
          </div>

          <div className="flex flex-col gap-2 mb-6">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 text-sm font-mono pointer-events-none">~/</span>
                <input
                  placeholder="Search any GitHub username…"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700/60 rounded-xl pl-10 pr-4 py-3 text-sm font-mono text-slate-800 dark:text-white placeholder-slate-300 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition"
                />
              </div>
              <button onClick={handleSearch}
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-xl text-sm font-semibold transition shadow-sm">
                Search →
              </button>
            </div>

            {/* Quick shortcuts */}
            <div className="flex items-center gap-2 flex-wrap">
              {profile?.github && (
                <button
                  onClick={() => { setQuery(profile.github!); setUsername(profile.github!); }}
                  className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                    query === profile.github
                      ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-500 dark:text-indigo-400'
                      : 'bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-700/50 text-slate-500 dark:text-zinc-400 hover:border-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-400'
                  }`}
                >
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                  </svg>
                  My GitHub (@{profile.github})
                </button>
              )}
              {!profile?.github && (
                <p className="text-xs text-slate-400 dark:text-zinc-600 italic">
                  Save your GitHub username in Edit Profile to auto-load your repos here.
                </p>
              )}
            </div>
          </div>

          {ghLoading && query && (
            <div className="flex justify-center py-16">
              <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {ghError && !ghLoading && (
            <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-sm p-8 text-center">
              <p className="text-red-400 font-mono text-sm mb-1">{ghError}</p>
              <p className="text-slate-400 dark:text-zinc-500 text-xs">Double-check the username and try again</p>
            </div>
          )}

          {ghUser && !ghLoading && (
            <div className="space-y-5">
              {/* GitHub profile card */}
              <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-sm overflow-visible">
                <GitHubBanner />

                <div className="flex flex-col md:flex-row md:items-end px-4 md:px-8 pb-5 gap-3 md:gap-6">
                  <div className="flex gap-6 md:gap-8 md:flex-1 pb-1 justify-center md:justify-start">
                    {[
                      { value: ghUser.public_repos, label: 'Repositories', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg> },
                      { value: ghUser.followers,    label: 'Followers',    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
                      { value: ghUser.following,    label: 'Following',    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
                    ].map(({ value, label, icon }) => (
                      <div key={label} className="flex flex-col items-center gap-1 pt-4">
                        <span className="text-slate-400 dark:text-zinc-500">{icon}</span>
                        <p className="text-xl font-bold text-slate-800 dark:text-white leading-none">{value.toLocaleString()}</p>
                        <p className="text-xs text-slate-400 dark:text-zinc-500">{label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col items-center shrink-0 -mt-12 md:-mt-14 self-center">
                    <img src={ghUser.avatar_url} alt={ghUser.login}
                      className="w-24 h-24 rounded-full border-4 border-white dark:border-zinc-800 shadow-2xl object-cover" />
                    <div className="flex items-center gap-2 mt-2">
                      <p className="font-bold text-slate-800 dark:text-white text-base leading-tight">{ghUser.name || ghUser.login}</p>
                      {profile?.github && ghUser.login.toLowerCase() === profile.github.toLowerCase() && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-500 dark:text-indigo-400 border border-indigo-500/20 font-semibold">You</span>
                      )}
                    </div>
                    <p className="text-sm text-slate-400 dark:text-zinc-500">@{ghUser.login}</p>
                  </div>
                  <div className="flex md:flex-1 justify-center md:justify-end md:pb-1">
                    <a href={ghUser.html_url} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition shadow-sm shadow-indigo-500/30">
                      View on GitHub
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                    </a>
                  </div>
                </div>

                <div className="border-t border-slate-100 dark:border-zinc-700/50 px-8">
                  <button className="flex items-center gap-2 py-3 text-sm font-semibold text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500 -mb-px">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                    Repositories
                  </button>
                </div>
              </div>

              {/* Two-column: GitHub intro + repos */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
                <div className="lg:col-span-1 bg-white dark:bg-zinc-800 rounded-2xl shadow-sm p-5">
                  <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-3">Introduction</h3>
                  {ghUser.bio
                    ? <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed mb-4">{ghUser.bio}</p>
                    : <p className="text-slate-300 dark:text-zinc-600 text-sm italic mb-4">No bio available.</p>
                  }
                  <div className="space-y-3">
                    {ghUser.company          && <GhIntroRow icon={<HomeIcon />}  text={ghUser.company.replace(/^@/, '')} />}
                    {ghUser.email            && <GhIntroRow icon={<MailIcon />}  text={ghUser.email} />}
                    {ghUser.blog             && <GhIntroRow icon={<GlobeIcon />} text={ghUser.blog.replace(/^https?:\/\//, '')} href={ghUser.blog.startsWith('http') ? ghUser.blog : `https://${ghUser.blog}`} />}
                    {ghUser.location         && <GhIntroRow icon={<PinIcon />}   text={ghUser.location} />}
                    {ghUser.twitter_username && <GhIntroRow icon={<TwIcon />}    text={`@${ghUser.twitter_username}`} />}
                    {!ghUser.company && !ghUser.email && !ghUser.blog && !ghUser.location && !ghUser.twitter_username && (
                      <p className="text-slate-300 dark:text-zinc-600 text-xs italic">No additional details.</p>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-widest">Top Repositories</h3>
                    {reposLoading && <span className="text-xs text-slate-400 font-mono animate-pulse">loading…</span>}
                  </div>
                  {ownRepos.length === 0 && !reposLoading && (
                    <div className="bg-white dark:bg-zinc-800 rounded-2xl p-8 text-center text-slate-400 text-sm">No public repositories found.</div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {ownRepos.map((repo, i) => (
                      <a key={repo.id} href={repo.html_url} target="_blank" rel="noopener noreferrer"
                        className={`bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700/50 border-l-4 ${REPO_BORDER_COLORS[i % REPO_BORDER_COLORS.length]} rounded-2xl p-5 hover:shadow-md transition group`}>
                        <div className="flex items-start justify-between mb-1.5">
                          <h4 className="font-semibold text-slate-800 dark:text-white text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition font-mono truncate">{repo.name}</h4>
                          <span className="text-slate-300 dark:text-zinc-600 group-hover:text-indigo-400 transition text-xs shrink-0 ml-2">↗</span>
                        </div>
                        {repo.description && (
                          <p className="text-slate-400 dark:text-zinc-500 text-xs mb-3 line-clamp-2 leading-relaxed">{repo.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-zinc-500">
                          {repo.language && (
                            <span className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: LANGUAGE_COLORS[repo.language] ?? '#94a3b8' }} />
                              <span className="font-mono">{repo.language}</span>
                            </span>
                          )}
                          <span className="ml-auto">⭐ {repo.stargazers_count}</span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {!ghUser && !ghLoading && !ghError && (
            <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-sm flex flex-col items-center justify-center py-16 text-center">
              <div className="relative w-16 h-16 mb-4">
                <div className="absolute inset-0 bg-indigo-200/60 dark:bg-indigo-500/20 rounded-full blur-xl" />
                <div className="relative w-16 h-16 bg-white dark:bg-zinc-700 border border-slate-200 dark:border-zinc-600 rounded-2xl flex items-center justify-center shadow-sm">
                  <svg width="22" height="22" fill="none" stroke="#6366f1" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                  </svg>
                </div>
              </div>
              <p className="text-slate-600 dark:text-zinc-300 font-semibold text-sm mb-1">Search a GitHub user</p>
              <p className="text-slate-400 dark:text-zinc-500 text-xs font-mono">type a username above and hit Search</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
