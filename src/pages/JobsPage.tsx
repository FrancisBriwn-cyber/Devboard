import { useState, useMemo } from 'react';
import { useFetch } from '../hooks/useFetch';
import { MapPinIcon, DollarIcon, SearchIcon } from '../components/Icons';

interface RemotiveJob {
  id: number;
  url: string;
  title: string;
  company_name: string;
  company_logo: string;
  candidate_required_location: string;
  salary: string;
  job_type: string;
  publication_date: string;
}

interface RemotiveResponse {
  jobs: RemotiveJob[];
}

const CATEGORIES = [
  { value: 'software-dev', label: 'Software Dev' },
  { value: 'design',       label: 'Design' },
  { value: 'marketing',    label: 'Marketing' },
  { value: 'product',      label: 'Product' },
  { value: 'data',         label: 'Data' },
];

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return '1d ago';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}



export default function JobsPage() {
  const [category, setCategory] = useState('software-dev');
  const [search, setSearch] = useState('');

  const url = 'https://remotive.com/api/remote-jobs?category=' + category + '&limit=20';
  const { data, loading, error } = useFetch<RemotiveResponse>(url);

  const filteredJobs = useMemo(() => {
    if (!data?.jobs) return [];
    const seen = new Set<string>();
    const unique = data.jobs.filter((job) => {
      const key = `${job.title.toLowerCase()}-${job.company_name.toLowerCase()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    return unique.filter((job) =>
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company_name.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  return (
    <div className="min-h-full bg-slate-50 dark:bg-zinc-900 px-4 md:px-8 py-6 md:py-8">

      {/* ── Hero Banner ── */}
      <div className="relative bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 rounded-2xl px-8 py-8 mb-8 overflow-hidden">
        {/* Background glows */}
        <div className="absolute top-0 right-0 w-80 h-64 bg-indigo-500/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-1/3 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-6 left-1/4 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative flex items-center justify-between gap-8">
          {/* Left — copy */}
          <div className="flex-1 min-w-0">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-medium rounded-full border border-blue-500/25 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              Find your next opportunity
            </span>
            <h2 className="text-3xl font-black text-white leading-tight mb-3">
              Discover Remote Jobs<br />
              Built for <span className="text-blue-400">Developers</span>
            </h2>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed max-w-md">
              Explore top remote opportunities from reputable companies around the world.
            </p>
            <div className="flex items-center gap-6 flex-wrap">
              {[
                { icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>, color: 'bg-emerald-500/20', label: '100% Remote' },
                { icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>, color: 'bg-blue-500/20', label: 'Real-time Updates' },
                { icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>, color: 'bg-violet-500/20', label: 'Verified Companies' },
              ].map(({ icon, color, label }) => (
                <div key={label} className="flex items-center gap-2 text-xs text-slate-400">
                  <div className={`w-6 h-6 rounded-lg ${color} flex items-center justify-center shrink-0`}>{icon}</div>
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Right — illustration */}
          <div className="hidden lg:block shrink-0 relative w-56 h-40">
            <svg width="200" height="130" viewBox="0 0 200 130" fill="none" className="drop-shadow-2xl">
              {/* Laptop screen bezel */}
              <rect x="18" y="6" width="164" height="100" rx="10" fill="#1e2035" stroke="#4f46e5" strokeWidth="1.5"/>
              {/* Screen glow */}
              <rect x="26" y="14" width="148" height="84" rx="6" fill="#0f1030"/>
              {/* Code lines */}
              <rect x="38" y="26" width="56" height="5" rx="2.5" fill="#6366f1" opacity="0.9"/>
              <rect x="38" y="36" width="88" height="4" rx="2" fill="#4f46e5" opacity="0.6"/>
              <rect x="38" y="45" width="44" height="4" rx="2" fill="#818cf8" opacity="0.7"/>
              <rect x="50" y="54" width="68" height="4" rx="2" fill="#4f46e5" opacity="0.5"/>
              <rect x="50" y="63" width="52" height="4" rx="2" fill="#6366f1" opacity="0.6"/>
              <rect x="38" y="72" width="76" height="4" rx="2" fill="#818cf8" opacity="0.4"/>
              <rect x="38" y="81" width="34" height="4" rx="2" fill="#4f46e5" opacity="0.6"/>
              {/* Cursor blink */}
              <rect x="78" y="81" width="8" height="4" rx="1" fill="#818cf8" opacity="0.9"/>
              {/* Base */}
              <rect x="8" y="106" width="184" height="10" rx="4" fill="#2d2f52" stroke="#4f46e5" strokeWidth="1"/>
              <rect x="68" y="114" width="64" height="5" rx="2.5" fill="#1e2035"/>
            </svg>
            {/* Floating role badges */}
            <div className="absolute -top-3 -right-2 bg-blue-600 text-white text-xs px-2.5 py-1 rounded-xl font-semibold shadow-lg shadow-blue-900/60 flex items-center gap-1.5 whitespace-nowrap">
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
              Frontend
            </div>
            <div className="absolute top-10 -left-8 bg-violet-700 text-white text-xs px-2.5 py-1 rounded-xl font-semibold shadow-lg shadow-violet-900/60 flex items-center gap-1.5 whitespace-nowrap">
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/></svg>
              Backend
            </div>
            <div className="absolute -bottom-1 right-4 bg-emerald-600 text-white text-xs px-2.5 py-1 rounded-xl font-semibold shadow-lg shadow-emerald-900/60 flex items-center gap-1.5 whitespace-nowrap">
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Remote
            </div>
          </div>
        </div>
      </div>

      {/* ── Search + count ── */}
      <div className="flex items-center gap-4 mb-5">
        <div className="relative flex-1">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            placeholder="Search by title or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700/60 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
        {!loading && (
          <span className="shrink-0 bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold px-3 py-2 rounded-xl">
            {filteredJobs.length} jobs
          </span>
        )}
      </div>

      {/* ── Category tabs ── */}
      <div className="flex gap-2 flex-wrap mb-7">
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            onClick={() => setCategory(c.value)}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${
              category === c.value
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
                : 'bg-white dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700/50 hover:text-slate-800 dark:hover:text-white hover:border-slate-300 dark:hover:border-zinc-500'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* ── Live Job Listings header ── */}
      <div className="mb-5">
        <h1 className="text-slate-800 dark:text-white text-xl font-bold tracking-tight">Live Job Listings</h1>
        <p className="text-slate-400 dark:text-zinc-500 text-sm mt-0.5">Remote jobs updated in real time</p>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-zinc-800/40 border border-slate-200 dark:border-zinc-700/40 rounded-2xl overflow-hidden animate-pulse">
              <div className="h-36 bg-slate-200 dark:bg-zinc-700" />
              <div className="p-4 space-y-2.5">
                <div className="h-3 bg-slate-200 dark:bg-zinc-700 rounded w-1/3" />
                <div className="h-4 bg-slate-200 dark:bg-zinc-700 rounded w-2/3" />
                <div className="h-3 bg-slate-200 dark:bg-zinc-700 rounded w-1/2" />
                <div className="h-8 bg-slate-200 dark:bg-zinc-700 rounded-xl mt-2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-center text-red-400 py-12">{error}</p>}

      {/* ── Job grid — 3 columns ── */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJobs.length === 0 && !error && (
            <div className="col-span-3 bg-white dark:bg-zinc-800/40 border border-slate-200 dark:border-zinc-700/40 rounded-2xl p-12 text-center">
              <div className="flex justify-center mb-3 text-slate-300 dark:text-zinc-600"><SearchIcon size={40} /></div>
              <p className="text-slate-500 dark:text-zinc-400 font-medium text-sm">No jobs found</p>
              <p className="text-slate-400 dark:text-zinc-600 text-xs mt-1">Try a different category or search term</p>
            </div>
          )}
          {filteredJobs.map((job) => {
            return (
              <div
                key={job.id}
                className="relative overflow-hidden rounded-2xl flex flex-col justify-between p-5 h-[200px]
                  bg-white dark:[background:linear-gradient(135deg,#0a0a1a_0%,#1a1040_60%,#0e0a2a_100%)]
                  border border-slate-200 dark:border-white/[0.07]
                  hover:border-slate-300 dark:hover:border-indigo-500/30
                  hover:shadow-md dark:hover:shadow-xl dark:hover:shadow-indigo-950/50
                  hover:-translate-y-0.5 transition-all duration-300 group"
              >
                {/* Single subtle glow — dark mode only */}
                <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-transparent dark:bg-indigo-700/20 blur-3xl pointer-events-none" />

                {/* ── Top: logo + company + title + time ── */}
                <div className="relative flex items-start gap-3">
                  <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/15 flex items-center justify-center shrink-0 overflow-hidden">
                    {job.company_logo ? (
                      <img
                        src={job.company_logo}
                        alt={job.company_name}
                        className="w-8 h-8 object-contain"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    ) : (
                      <span className="text-slate-600 dark:text-white font-bold text-base">{job.company_name?.[0]}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-400 dark:text-white/40 text-xs font-medium truncate">{job.company_name}</p>
                    <h3 className="text-slate-800 dark:text-white font-bold text-sm leading-snug line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors mt-0.5">
                      {job.title}
                    </h3>
                  </div>
                  {job.publication_date && (
                    <span className="shrink-0 text-xs text-slate-400 dark:text-white/30 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-2 py-0.5 rounded-full whitespace-nowrap">
                      {timeAgo(job.publication_date)}
                    </span>
                  )}
                </div>

                {/* ── Bottom: pills + Apply Now ── */}
                <div className="relative flex items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-1.5 min-w-0 overflow-hidden">
                    {job.candidate_required_location && (
                      <span className="inline-flex items-center gap-1 text-xs bg-slate-100 dark:bg-white/[0.07] text-slate-500 dark:text-white/60 border border-slate-200 dark:border-white/10 px-2.5 py-1 rounded-full whitespace-nowrap">
                        <MapPinIcon size={9} />
                        {job.candidate_required_location.split(',')[0].trim()}
                      </span>
                    )}
                    {job.job_type && (
                      <span className="text-xs bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-500/25 px-2.5 py-1 rounded-full whitespace-nowrap">
                        {job.job_type}
                      </span>
                    )}
                    {job.salary && (
                      <span className="inline-flex items-center gap-1 text-xs bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-500/20 px-2.5 py-1 rounded-full whitespace-nowrap">
                        <DollarIcon size={9} />
                        {job.salary.length > 16 ? job.salary.slice(0, 16) + '…' : job.salary}
                      </span>
                    )}
                  </div>
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-md shadow-indigo-900/25"
                  >
                    Apply Now
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
