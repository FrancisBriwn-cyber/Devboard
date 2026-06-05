import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

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

const INPUT =
  'w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700/60 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition';

const STEPS = [
  { num: 1, label: 'Account' },
  { num: 2, label: 'Personal' },
  { num: 3, label: 'Profile' },
];

const LEFT_CONTENT = {
  1: { title: 'Start your journey.', body: 'Create your login credentials to get started on DevBoard.' },
  2: { title: 'Tell us about yourself.', body: 'Add your contact and personal details so your profile is complete from day one.' },
  3: { title: 'Make it yours.', body: 'Pick an avatar and connect your social profiles to help others find you.' },
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);
  const setProfile = useAuthStore((s) => s.setProfile);

  const [step, setStep]         = useState(1);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');

  /* ── Step 1 ── */
  const [fullName, setFullName]           = useState('');
  const [email, setEmail]                 = useState('');
  const [password, setPassword]           = useState('');
  const [confirmPass, setConfirmPass]     = useState('');
  const [showPass, setShowPass]           = useState(false);

  /* ── Step 2 ── */
  const [phone, setPhone]       = useState('');
  const [dob, setDob]           = useState('');
  const [location, setLocation] = useState('');
  const [title, setTitle]       = useState('');
  const [bio, setBio]           = useState('');

  /* ── Step 3 ── */
  const [avatar, setAvatar]     = useState(AVATARS[0]);
  const [github, setGithub]     = useState('');
  const [twitter, setTwitter]   = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [website, setWebsite]   = useState('');

  const validateStep1 = (): string => {
    if (!fullName.trim())     return 'Full name is required.';
    if (!email.trim())        return 'Email is required.';
    if (password.length < 6)  return 'Password must be at least 6 characters.';
    if (password !== confirmPass) return 'Passwords do not match.';
    return '';
  };

  const handleNext = () => {
    setError('');
    if (step === 1) {
      const err = validateStep1();
      if (err) { setError(err); return; }
    }
    setStep((s) => s + 1);
  };

  const handleBack = () => { setError(''); setStep((s) => s - 1); };

  const handleRegister = async () => {
    setLoading(true);
    setError('');

    const { data, error: authError } = await supabase.auth.signUp({ email, password });
    if (authError) { setError(authError.message); setLoading(false); return; }

    if (data.user) {
      const profileData = {
        id: data.user.id,
        email,
        avatar,
        full_name: fullName,
        phone,
        dob,
        location,
        title,
        bio,
        github,
        twitter,
        linkedin,
        website,
      };
      await supabase.from('profiles').insert(profileData);

      if (data.session) {
        // Email confirmation not required — go straight to dashboard
        setSession(data.session);
        setProfile(profileData);
        navigate('/dashboard');
      } else {
        // Supabase requires email confirmation first
        setPendingEmail(email);
      }
    }
    setLoading(false);
  };

  /* ── Email confirmation screen ── */
  if (pendingEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-900 px-8">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg width="28" height="28" fill="none" stroke="#60a5fa" strokeWidth="1.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">Confirm your email</h2>
          <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed mb-2">
            We sent a confirmation link to
          </p>
          <p className="text-blue-500 font-semibold text-sm mb-6">{pendingEmail}</p>
          <p className="text-slate-400 dark:text-zinc-500 text-xs leading-relaxed mb-8">
            Click the link in the email to activate your account. <br />
            Check your spam folder if you don't see it.
          </p>
          <Link to="/login" className="inline-flex items-center gap-2 text-sm text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300 transition">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
            Go to sign in
          </Link>
        </div>
      </div>
    );
  }

  const { title: leftTitle, body: leftBody } = LEFT_CONTENT[step as keyof typeof LEFT_CONTENT];

  return (
    <div className="min-h-screen flex">

      {/* ── Left branding panel ── */}
      <div className="hidden lg:flex w-5/12 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex-col justify-between p-12 sticky top-0 h-screen">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white font-black text-sm">D</span>
          <span className="text-white font-bold text-lg tracking-tight">DevBoard</span>
        </div>

        <div>
          {/* Step tracker */}
          <div className="flex flex-col gap-5 mb-10">
            {STEPS.map(({ num, label }) => (
              <div key={num} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-all ${
                  step > num  ? 'bg-white text-blue-700' :
                  step === num ? 'bg-white/20 text-white ring-2 ring-white ring-offset-2 ring-offset-transparent' :
                  'bg-white/10 text-white/40'
                }`}>
                  {step > num
                    ? <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    : num
                  }
                </div>
                <span className={`text-sm font-semibold transition-all ${step >= num ? 'text-white' : 'text-white/40'}`}>{label}</span>
                {num < STEPS.length && (
                  <div className={`ml-auto w-px h-6 ${step > num ? 'bg-white/50' : 'bg-white/20'}`} />
                )}
              </div>
            ))}
          </div>

          <h2 className="text-3xl font-bold text-white leading-snug mb-3">{leftTitle}</h2>
          <p className="text-blue-200 text-sm leading-relaxed">{leftBody}</p>
        </div>

        <p className="text-blue-300 text-sm">© 2025 DevBoard</p>
      </div>

      {/* ── Right form panel ── */}
      <div className="w-full lg:w-7/12 bg-white dark:bg-zinc-900 overflow-y-auto">
        <div className="min-h-screen flex items-start justify-center p-8 py-12">
          <div className="w-full max-w-lg">

            {/* Mobile step pills */}
            <div className="flex items-center gap-2 mb-7 lg:hidden">
              {STEPS.map(({ num, label }, i) => (
                <div key={num} className="flex items-center gap-2">
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    step === num ? 'bg-blue-600 text-white' :
                    step > num  ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600' :
                    'bg-slate-100 dark:bg-zinc-800 text-slate-400'
                  }`}>
                    {step > num
                      ? <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      : <span>{num}</span>
                    }
                    {label}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`h-px w-4 ${step > num ? 'bg-blue-400' : 'bg-slate-200 dark:bg-zinc-700'}`} />
                  )}
                </div>
              ))}
            </div>

            {/* Heading */}
            <div className="mb-7">
              <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-1 tracking-tight">
                {step === 1 && 'Create your account'}
                {step === 2 && 'Personal details'}
                {step === 3 && 'Profile setup'}
              </h1>
              <p className="text-slate-400 dark:text-zinc-500 text-sm">
                {step === 1 && 'Enter your credentials to get started'}
                {step === 2 && 'Contact info and background — all fields are optional'}
                {step === 3 && 'Choose an avatar and connect your social profiles'}
              </p>
            </div>

            {/* Error banner */}
            {error && (
              <div className="mb-5 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
              </div>
            )}

            {/* ═══════════════════════════════
                STEP 1 — Account credentials
                ═══════════════════════════════ */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-zinc-400 mb-1.5">Full Name <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={INPUT}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-zinc-400 mb-1.5">Email address <span className="text-red-400">*</span></label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={INPUT}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-zinc-400 mb-1.5">Password <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      placeholder="Min. 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`${INPUT} pr-11`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 transition"
                    >
                      {showPass
                        ? <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        : <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      }
                    </button>
                  </div>
                  {/* Strength indicator */}
                  {password && (
                    <div className="mt-2 flex gap-1">
                      {[6, 8, 10].map((len, i) => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-all ${
                          password.length >= len
                            ? i === 0 ? 'bg-red-400' : i === 1 ? 'bg-yellow-400' : 'bg-emerald-400'
                            : 'bg-slate-200 dark:bg-zinc-700'
                        }`} />
                      ))}
                      <span className="text-xs text-slate-400 dark:text-zinc-500 ml-2">
                        {password.length < 6 ? 'Too short' : password.length < 8 ? 'Weak' : password.length < 10 ? 'Good' : 'Strong'}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-zinc-400 mb-1.5">Confirm Password <span className="text-red-400">*</span></label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                    className={`${INPUT} ${confirmPass && confirmPass !== password ? 'ring-2 ring-red-400 border-red-300' : ''}`}
                  />
                  {confirmPass && confirmPass !== password && (
                    <p className="text-xs text-red-400 mt-1.5">Passwords do not match</p>
                  )}
                </div>
              </div>
            )}

            {/* ═══════════════════════════════
                STEP 2 — Personal details
                ═══════════════════════════════ */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-zinc-400 mb-1.5">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+234 800 000 0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={INPUT}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-zinc-400 mb-1.5">Date of Birth</label>
                    <input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className={INPUT}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-zinc-400 mb-1.5">Location / Address</label>
                  <div className="relative">
                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                    <input
                      type="text"
                      placeholder="Lagos, Nigeria"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className={`${INPUT} pl-9`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-zinc-400 mb-1.5">Job Title / Role</label>
                  <div className="relative">
                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                      <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                    </svg>
                    <input
                      type="text"
                      placeholder="e.g. Full Stack Developer"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className={`${INPUT} pl-9`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-zinc-400 mb-1.5">Bio / About You</label>
                  <textarea
                    placeholder="Write a short intro about yourself…"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    className={`${INPUT} resize-none`}
                  />
                  <p className="text-xs text-slate-400 dark:text-zinc-600 mt-1 text-right">{bio.length}/200</p>
                </div>
              </div>
            )}

            {/* ═══════════════════════════════
                STEP 3 — Profile setup
                ═══════════════════════════════ */}
            {step === 3 && (
              <div className="space-y-6">

                {/* Avatar grid */}
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-zinc-400 mb-2.5">Choose your avatar</label>
                  <div className="grid grid-cols-6 gap-2.5">
                    {AVATARS.map((a) => (
                      <div
                        key={a}
                        onClick={() => setAvatar(a)}
                        className={`cursor-pointer rounded-full p-1 border-2 transition-all ${
                          avatar === a
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10 shadow-md shadow-blue-200/50'
                            : 'border-transparent hover:border-slate-300 dark:hover:border-zinc-600'
                        }`}
                      >
                        <img src={a} alt="avatar" className="w-10 h-10 rounded-full" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Social links */}
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-zinc-400 mb-3">Social & Links <span className="text-xs font-normal text-slate-400 dark:text-zinc-500">(optional)</span></p>
                  <div className="grid grid-cols-2 gap-3">

                    {/* GitHub */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-500 mb-1.5 uppercase tracking-wider">GitHub</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-mono">@</span>
                        <input
                          type="text"
                          placeholder="username"
                          value={github}
                          onChange={(e) => setGithub(e.target.value)}
                          className={`${INPUT} pl-7`}
                        />
                      </div>
                    </div>

                    {/* Twitter */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-500 mb-1.5 uppercase tracking-wider">Twitter / X</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-mono">@</span>
                        <input
                          type="text"
                          placeholder="username"
                          value={twitter}
                          onChange={(e) => setTwitter(e.target.value)}
                          className={`${INPUT} pl-7`}
                        />
                      </div>
                    </div>

                    {/* LinkedIn */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-500 mb-1.5 uppercase tracking-wider">LinkedIn</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-mono">in/</span>
                        <input
                          type="text"
                          placeholder="yourname"
                          value={linkedin}
                          onChange={(e) => setLinkedin(e.target.value)}
                          className={`${INPUT} pl-8`}
                        />
                      </div>
                    </div>

                    {/* Website */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-500 mb-1.5 uppercase tracking-wider">Website</label>
                      <div className="relative">
                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                          <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
                          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                        </svg>
                        <input
                          type="text"
                          placeholder="yoursite.com"
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          className={`${INPUT} pl-8`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Navigation buttons ── */}
            <div className="flex items-center gap-3 mt-8">
              {step > 1 && (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-zinc-800 transition"
                >
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
                  Back
                </button>
              )}

              {step < 3 ? (
                <button
                  onClick={handleNext}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-semibold text-sm transition shadow-lg shadow-blue-900/40"
                >
                  Continue
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                </button>
              ) : (
                <button
                  onClick={handleRegister}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-semibold text-sm transition shadow-lg shadow-blue-900/40 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading
                    ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Creating account…</>
                    : <>Create account <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg></>
                  }
                </button>
              )}
            </div>

            {/* Skip on step 2 & 3 */}
            {step > 1 && (
              <button
                onClick={step < 3 ? handleNext : handleRegister}
                className="w-full text-center text-xs text-slate-400 dark:text-zinc-600 hover:text-slate-500 dark:hover:text-zinc-400 mt-3 transition"
              >
                {step === 2 ? 'Skip for now →' : 'Skip and finish →'}
              </button>
            )}

            <p className="text-sm text-center text-slate-400 dark:text-zinc-500 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-400 font-medium hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
