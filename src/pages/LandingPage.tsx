import { Link } from 'react-router-dom';

const FEATURES = [
  {
    title: 'Job Tracker',
    desc: 'Track every application with a Kanban board. Manage status, notes, and follow-ups — all in one place.',
    icon: (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
  },
  {
    title: 'Live Job Board',
    desc: 'Browse thousands of remote jobs updated in real time. Filter by role, location, and salary.',
    icon: (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
  },
  {
    title: 'GitHub Explorer',
    desc: 'Connect your GitHub profile. Showcase your repos and explore any developer\'s public portfolio instantly.',
    icon: (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
      </svg>
    ),
  },
  {
    title: 'Developer News',
    desc: 'Stay sharp with top stories from Hacker News, filtered by the tech topics you actually care about.',
    icon: (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 0-2 2z"/>
        <path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6z"/>
      </svg>
    ),
  },
];

const STATS = [
  { value: '1,000+', label: 'Remote Jobs Listed' },
  { value: '100%',   label: 'Free to Use' },
  { value: '5+',     label: 'Built-in Tools' },
  { value: '24/7',   label: 'Real-time Updates' },
];

const CHECKS = [
  'Track applications across every stage',
  'Browse and apply to remote jobs directly',
  'Manage your developer profile & GitHub',
  'Get daily insights from the dev community',
];

export default function LandingPage() {
  return (
    <div className="bg-white text-[#0f172a] font-sans">

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm">D</div>
            <span className="font-bold text-lg text-[#0f172a] tracking-tight">DevBoard</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-blue-600 transition">Features</a>
            <a href="#about"    className="hover:text-blue-600 transition">About</a>
            <a href="#stats"    className="hover:text-blue-600 transition">Why Us</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/login"
              className="text-sm font-medium text-slate-600 hover:text-blue-600 transition px-4 py-2">
              Sign In
            </Link>
            <Link to="/register"
              className="text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition shadow-sm">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="max-w-7xl mx-auto px-6 py-24 flex flex-col lg:flex-row items-center gap-16">
        {/* Left */}
        <div className="flex-1">
          <span className="inline-block text-xs font-semibold text-blue-600 border border-blue-200 bg-blue-50 rounded-full px-4 py-1.5 mb-6 tracking-widest uppercase">
            Developer Career OS
          </span>
          <h1 className="text-5xl lg:text-6xl font-black text-[#0f172a] leading-[1.08] tracking-tight mb-6">
            Your job search,<br />finally organised.
          </h1>
          <p className="text-slate-500 text-lg leading-relaxed max-w-lg mb-8">
            DevBoard is an all-in-one career dashboard built for developers. Track applications, browse live remote jobs, explore GitHub profiles, and stay current with dev news.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/register"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-7 py-3.5 rounded-lg transition shadow-md shadow-blue-200">
              Get Started — It's Free
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
            </Link>
            <Link to="/login"
              className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium px-5 py-3.5 rounded-lg border border-slate-200 hover:border-slate-300 transition">
              Sign In
            </Link>
          </div>
        </div>

        {/* Right — Dashboard mockup */}
        <div className="flex-1 w-full max-w-lg">
          <div className="bg-[#0f172a] rounded-2xl p-4 shadow-2xl shadow-slate-300">
            {/* Mock topbar */}
            <div className="flex items-center gap-1.5 mb-4 px-1">
              <div className="w-3 h-3 rounded-full bg-rose-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
            </div>
            {/* Mock stat cards */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              {[
                { label: 'Total Applied', value: '24', color: 'bg-blue-500/15 border-blue-500/20 text-blue-400' },
                { label: 'Interviews',    value: '6',  color: 'bg-amber-500/15 border-amber-500/20 text-amber-400' },
                { label: 'Offers',        value: '2',  color: 'bg-emerald-500/15 border-emerald-500/20 text-emerald-400' },
                { label: 'Rejected',      value: '4',  color: 'bg-rose-500/15 border-rose-500/20 text-rose-400' },
              ].map((c) => (
                <div key={c.label} className={`border rounded-xl p-3 ${c.color}`}>
                  <p className="text-xs font-semibold opacity-70 mb-1">{c.label}</p>
                  <p className="text-3xl font-black text-white">{c.value}</p>
                </div>
              ))}
            </div>
            {/* Mock job rows */}
            <div className="bg-white/5 rounded-xl p-3 space-y-2">
              {[
                { role: 'Frontend Engineer', co: 'Stripe',    status: 'Interview', badge: 'bg-amber-500/20 text-amber-300' },
                { role: 'React Developer',   co: 'Vercel',    status: 'Applied',   badge: 'bg-blue-500/20 text-blue-300' },
                { role: 'Full Stack Dev',    co: 'Supabase',  status: 'Offer',     badge: 'bg-emerald-500/20 text-emerald-300' },
              ].map((j) => (
                <div key={j.role} className="flex items-center justify-between py-1.5">
                  <div>
                    <p className="text-white text-xs font-semibold">{j.role}</p>
                    <p className="text-slate-500 text-xs">{j.co}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${j.badge}`}>{j.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">What We Offer</span>
            <h2 className="text-4xl font-black text-[#0f172a] mt-3 tracking-tight">Everything you need to land the job</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title}
                className="group bg-white border border-slate-200 rounded-2xl p-7 cursor-default
                  hover:bg-blue-600 hover:border-blue-600 transition-all duration-300">
                <div className="w-14 h-14 rounded-xl bg-blue-50 group-hover:bg-white/20 flex items-center justify-center text-blue-600 group-hover:text-white mb-5 transition-all duration-300">
                  {f.icon}
                </div>
                <h3 className="font-bold text-[#0f172a] group-hover:text-white text-lg mb-3 transition-colors duration-300">{f.title}</h3>
                <p className="text-slate-500 group-hover:text-blue-100 text-sm leading-relaxed transition-colors duration-300">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section id="about" className="py-24">
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">

          {/* Left — visual */}
          <div className="flex-1 relative">
            <div className="bg-[#0f172a] rounded-2xl overflow-hidden shadow-xl p-6">
              <p className="text-slate-500 text-xs font-mono mb-4">devboard.app/dashboard</p>
              <div className="space-y-3">
                <div className="h-2.5 bg-blue-500/30 rounded w-3/4" />
                <div className="h-2.5 bg-slate-700 rounded w-full" />
                <div className="h-2.5 bg-slate-700 rounded w-5/6" />
                <div className="h-2.5 bg-emerald-500/30 rounded w-2/3 mt-2" />
                <div className="h-2.5 bg-slate-700 rounded w-full" />
                <div className="h-2.5 bg-amber-500/30 rounded w-4/5" />
              </div>
              <div className="mt-6 grid grid-cols-3 gap-2">
                {['bg-blue-500/20', 'bg-amber-500/20', 'bg-emerald-500/20'].map((c, i) => (
                  <div key={i} className={`${c} rounded-xl h-16`} />
                ))}
              </div>
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-5 -right-5 bg-blue-600 text-white text-xs font-bold px-5 py-3 rounded-xl shadow-lg shadow-blue-200">
              100% Free to Use
            </div>
          </div>

          {/* Right — copy */}
          <div className="flex-1">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">About DevBoard</span>
            <h2 className="text-4xl font-black text-[#0f172a] mt-3 mb-5 leading-tight tracking-tight">
              Built by a developer,<br />for developers.
            </h2>
            <p className="text-slate-500 text-base leading-relaxed mb-6">
              DevBoard was built to solve a real problem — keeping track of job applications across dozens of platforms is messy, stressful, and time-consuming. We built one clean dashboard so you can focus on what matters: getting hired.
            </p>
            <p className="text-slate-500 text-base leading-relaxed mb-8">
              Whether you're actively job hunting or passively exploring, DevBoard gives you the tools to stay organised, informed, and ahead of the competition.
            </p>

            <ul className="space-y-3 mb-8">
              {CHECKS.map((c) => (
                <li key={c} className="flex items-center gap-3 text-slate-600 text-sm">
                  <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                    <svg width="10" height="10" fill="none" stroke="white" strokeWidth="3" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  {c}
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-5">
              <Link to="/register"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition shadow-md shadow-blue-200">
                Get Started Free
              </Link>
              <Link to="/login" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition">
                Already a member? Sign in →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section id="stats" className="bg-[#0f172a] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="text-5xl font-black text-blue-400 mb-2">{s.value}</p>
                <p className="text-slate-400 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-4xl font-black text-[#0f172a] mb-4 tracking-tight">Ready to take control of your job search?</h2>
          <p className="text-slate-500 text-lg mb-8">Join developers who are already managing their careers smarter with DevBoard.</p>
          <Link to="/register"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-xl transition shadow-lg shadow-blue-200 text-base">
            Create Your Free Account
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-xs">D</div>
            <span className="font-bold text-sm text-[#0f172a]">DevBoard</span>
          </div>
          <p className="text-slate-400 text-sm">© 2025 DevBoard. Built for developers.</p>
          <div className="flex items-center gap-5 text-sm text-slate-500">
            <Link to="/login"    className="hover:text-blue-600 transition">Sign In</Link>
            <Link to="/register" className="hover:text-blue-600 transition">Register</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
