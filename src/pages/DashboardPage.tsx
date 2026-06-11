import { useAuthStore } from '../store/authStore';
import { useJobStore } from '../store/jobStore';
import { useJobTracker } from '../hooks/useJobTracker';
import { Link } from 'react-router-dom';
import { ParticleTextEffect } from '@/components/ui/particle-text-effect';
import type { Job } from '../types';
import {
  ZapIcon, BellIcon, ClockIcon, BarChartIcon, TrendingUpIcon, LightbulbIcon,
  CheckCircleIcon, TargetIcon, MailIcon, LinkIcon, MessageIcon, GlobeIcon,
  AddIcon, SearchIcon, NewsFileIcon, UserIcon,
} from '../components/Icons';

function daysSince(dateStr: string) {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
}
function timeAgo(dateStr: string) {
  const d = daysSince(dateStr);
  if (d === 0) return 'Today';
  if (d === 1) return 'Yesterday';
  if (d < 7) return `${d}d ago`;
  if (d < 30) return `${Math.floor(d / 7)}w ago`;
  return `${Math.floor(d / 30)}mo ago`;
}

function getAlerts(jobs: Job[]) {
  const alerts: { type: 'critical' | 'warning' | 'offer' | 'info'; label: string; title: string; desc: string }[] = [];
  jobs.filter((j) => j.status === 'Offer').forEach((j) =>
    alerts.push({ type: 'offer', label: 'Offer Received', title: `${j.role} at ${j.company}`, desc: 'Congratulations! Review your offer and respond promptly.' }));
  jobs.filter((j) => j.status === 'Interview').forEach((j) =>
    alerts.push({ type: 'warning', label: 'Interview Stage', title: `${j.role} at ${j.company}`, desc: 'Prepare thoroughly — research the company and practice answers.' }));
  jobs.filter((j) => j.status === 'Applied' && daysSince(j.applied_at) >= 21).forEach((j) =>
    alerts.push({ type: 'critical', label: 'No Response', title: `${j.role} at ${j.company}`, desc: `Applied ${daysSince(j.applied_at)} days ago — send a polite follow-up email.` }));
  jobs.filter((j) => j.status === 'Applied' && daysSince(j.applied_at) >= 10 && daysSince(j.applied_at) < 21).forEach((j) =>
    alerts.push({ type: 'info', label: 'Follow Up', title: `${j.role} at ${j.company}`, desc: `Applied ${daysSince(j.applied_at)} days ago — a follow-up may improve your chances.` }));
  return alerts.slice(0, 5);
}

function getWeeklyChart(jobs: Job[]) {
  const now = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const start = new Date(now);
    start.setDate(start.getDate() - (5 - i) * 7);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);
    const count = jobs.filter((j) => { const d = new Date(j.applied_at); return d >= start && d < end; }).length;
    return { label: start.toLocaleDateString('en', { month: 'short', day: 'numeric' }), count };
  });
}

const ALERT_STYLES = {
  critical: { dot: 'bg-rose-500',    badge: 'bg-rose-500/15 text-rose-400 border border-rose-500/20' },
  warning:  { dot: 'bg-amber-400',   badge: 'bg-amber-500/15 text-amber-400 border border-amber-500/20' },
  offer:    { dot: 'bg-emerald-400', badge: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' },
  info:     { dot: 'bg-blue-400',    badge: 'bg-blue-500/15 text-blue-400 border border-blue-500/20' },
};

const STATUS_CONFIG = [
  { key: 'Applied',   color: 'bg-blue-500',    text: 'text-blue-400',    label: 'Applied' },
  { key: 'Interview', color: 'bg-amber-400',   text: 'text-amber-400',   label: 'Interview' },
  { key: 'Offer',     color: 'bg-emerald-400', text: 'text-emerald-400', label: 'Offer' },
  { key: 'Rejected',  color: 'bg-rose-500',    text: 'text-rose-400',    label: 'Rejected' },
];

const TIPS = [
  { Icon: TargetIcon,  tip: 'Tailor your resume keywords to each job description — ATS systems scan for matches.' },
  { Icon: MailIcon,    tip: 'Follow up 10–14 days after applying with a brief, polite email.' },
  { Icon: LinkIcon,    tip: 'Your LinkedIn profile should mirror your resume. Recruiters check both.' },
  { Icon: MessageIcon, tip: 'Prepare 3 strong STAR-format answers before every interview.' },
  { Icon: GlobeIcon,   tip: 'Remote jobs get 3× more applicants — make your cover letter stand out.' },
  { Icon: BarChartIcon,tip: 'Apply to 5–10 roles per week consistently. Volume + quality wins.' },
];

/* ── SVG Donut Chart ── */
function DonutChart({ data }: { data: { key: string; count: number; color: string; label: string }[] }) {
  const total = data.reduce((s, d) => s + d.count, 0);
  const r = 52, cx = 68, cy = 68, sw = 16;
  const C = 2 * Math.PI * r;
  let cum = 0;
  const segs = data.map(d => {
    const dash = total > 0 ? (d.count / total) * C : 0;
    const seg = { ...d, dash, offset: cum };
    cum += dash;
    return seg;
  });
  return (
    <div className="flex items-center gap-5">
      <svg width="136" height="136" viewBox="0 0 136 136" className="shrink-0">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e2e8f0" strokeWidth={sw} className="dark:stroke-zinc-700/50" />
        <g transform={`rotate(-90, ${cx}, ${cy})`}>
          {total === 0
            ? <circle cx={cx} cy={cy} r={r} fill="none" stroke="#d1d5db" strokeWidth={sw} strokeDasharray={`${C * 0.99} ${C * 0.01}`} className="dark:stroke-zinc-700" />
            : segs.map(seg => (
              <circle key={seg.key} cx={cx} cy={cy} r={r} fill="none"
                stroke={seg.color} strokeWidth={sw}
                strokeDasharray={`${seg.dash} ${C - seg.dash}`}
                strokeDashoffset={-seg.offset} strokeLinecap="butt" />
            ))
          }
        </g>
        <text x={cx} y={cy - 7} textAnchor="middle" className="fill-slate-800 dark:fill-white" fontSize="24" fontWeight="800"
          style={{ fill: 'var(--tw-prose-body, currentColor)' }}>{total}</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fill="#94a3b8" fontSize="11">Total</text>
      </svg>
      <div className="flex-1 space-y-2.5">
        {data.map(d => (
          <div key={d.key} className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
            <span className="text-xs text-slate-500 dark:text-zinc-400 flex-1">{d.label}</span>
            <span className="text-xs font-bold text-slate-800 dark:text-white">{d.count}</span>
            {total > 0 && (
              <span className="text-xs text-slate-400 dark:text-zinc-600 w-8 text-right">{Math.round((d.count / total) * 100)}%</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── SVG Smooth Area Chart ── */
function AreaChart({ data }: { data: { label: string; count: number }[] }) {
  const W = 260, H = 90;
  const padL = 4, padR = 4, padT = 12, padB = 20;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const maxVal = Math.max(...data.map(d => d.count), 1);

  const pts = data.map((d, i) => ({
    x: padL + (i / (data.length - 1)) * innerW,
    y: padT + innerH - (d.count / maxVal) * innerH,
    count: d.count,
    label: d.label,
  }));

  // Smooth cubic bezier path
  let linePath = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const cpX = (pts[i - 1].x + pts[i].x) / 2;
    linePath += ` C ${cpX} ${pts[i - 1].y} ${cpX} ${pts[i].y} ${pts[i].x} ${pts[i].y}`;
  }
  const areaPath = `${linePath} L ${pts[pts.length - 1].x} ${padT + innerH} L ${padL} ${padT + innerH} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible">
      <defs>
        <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Gridlines */}
      {[0, 0.5, 1].map((t) => (
        <line key={t} x1={padL} y1={padT + innerH * (1 - t)} x2={padL + innerW} y2={padT + innerH * (1 - t)}
          stroke="currentColor" strokeWidth="1" className="text-slate-200 dark:text-zinc-700/60" strokeDasharray={t === 0 ? '' : '3 3'} />
      ))}
      {/* Area fill */}
      <path d={areaPath} fill="url(#areaFill)" />
      {/* Line */}
      <path d={linePath} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Dots + count labels */}
      {pts.map((p, i) => (
        <g key={i}>
          {p.count > 0 && (
            <text x={p.x} y={p.y - 5} textAnchor="middle" fill="#94a3b8" fontSize="9">{p.count}</text>
          )}
          <circle cx={p.x} cy={p.y} r="3.5" fill={p.count > 0 ? '#3b82f6' : '#94a3b8'} />
          <text x={p.x} y={H - 4} textAnchor="middle" fill="#94a3b8" fontSize="9">{p.label.split(' ')[0]}</text>
        </g>
      ))}
    </svg>
  );
}

/* ── Activity Heatmap ── */
function ActivityHeatmap({ jobs }: { jobs: Job[] }) {
  const WEEKS = 20;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Count applications per day
  const counts: Record<string, number> = {};
  jobs.forEach(j => {
    const d = j.applied_at?.split('T')[0];
    if (d) counts[d] = (counts[d] || 0) + 1;
  });
  const maxDay = Math.max(...Object.values(counts), 1);

  const COLORS = [
    'bg-slate-200 dark:bg-zinc-700/50',
    'bg-blue-200 dark:bg-blue-900/60',
    'bg-blue-400 dark:bg-blue-700',
    'bg-blue-500 dark:bg-blue-600',
    'bg-blue-600 dark:bg-blue-500',
  ];

  // Build grid: WEEKS columns × 7 rows, starting from the most recent Sunday
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - today.getDay() - (WEEKS - 1) * 7);

  // Unique month labels
  const months: { label: string; col: number }[] = [];
  let lastMonth = -1;

  const grid = Array.from({ length: WEEKS }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + w * 7 + d);
      if (date > today) return null;
      const key = date.toISOString().split('T')[0];
      const count = counts[key] || 0;
      if (d === 0 && date.getMonth() !== lastMonth) {
        months.push({ label: date.toLocaleDateString('en', { month: 'short' }), col: w });
        lastMonth = date.getMonth();
      }
      const level = count === 0 ? 0 : Math.ceil((count / maxDay) * 4);
      return { key, count, level, date };
    })
  );

  return (
    <div>
      {/* Month labels */}
      <div className="relative mb-1 h-4" style={{ marginLeft: '28px' }}>
        {months.map(({ label, col }) => (
          <span key={`${label}-${col}`}
            className="absolute text-xs text-slate-400 dark:text-zinc-500"
            style={{ left: `${(col / WEEKS) * 100}%` }}>
            {label}
          </span>
        ))}
      </div>

      <div className="flex gap-1">
        {/* Day labels */}
        <div className="flex flex-col gap-1 mr-1">
          {['S','M','T','W','T','F','S'].map((d, i) => (
            <div key={i} className="text-xs text-slate-400 dark:text-zinc-600 w-5 h-3 leading-3 text-right">{i % 2 === 1 ? d : ''}</div>
          ))}
        </div>
        {/* Grid */}
        <div className="flex gap-1 flex-1">
          {grid.map((week, w) => (
            <div key={w} className="flex flex-col gap-1 flex-1">
              {week.map((cell, d) => (
                <div key={d} title={cell ? `${cell.key}: ${cell.count} application${cell.count !== 1 ? 's' : ''}` : ''}
                  className={`h-3 rounded-[2px] ${cell ? COLORS[cell.level] : 'bg-transparent'}`} />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1.5 mt-3 justify-end">
        <span className="text-xs text-slate-400 dark:text-zinc-500">Less</span>
        {COLORS.map((c, i) => (
          <div key={i} className={`w-3 h-3 rounded-[2px] ${c}`} />
        ))}
        <span className="text-xs text-slate-400 dark:text-zinc-500">More</span>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const session  = useAuthStore((s) => s.session);
  const profile  = useAuthStore((s) => s.profile);
  useJobTracker();
  const jobs = useJobStore((s) => s.jobs);

  const total        = jobs.length;
  const interviews   = jobs.filter((j) => j.status === 'Interview').length;
  const offers       = jobs.filter((j) => j.status === 'Offer').length;
  const rejected     = jobs.filter((j) => j.status === 'Rejected').length;
  const applied      = jobs.filter((j) => j.status === 'Applied').length;
  const responseRate = total > 0 ? Math.round(((interviews + offers + rejected) / total) * 100) : 0;

  const alerts     = getAlerts(jobs);
  const weeklyData = getWeeklyChart(jobs);
  const recent     = [...jobs].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);
  const { Icon: TipIcon, tip } = TIPS[new Date().getDay() % TIPS.length];
  const today      = new Date().toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="relative min-h-full overflow-hidden bg-slate-50/85 dark:bg-zinc-950/85 px-4 md:px-8 py-6 md:py-8">
      <ParticleTextEffect backgroundMode words={["DevBoard", "Dashboard", "Insights"]} particleColor="primary" />
      <div className="absolute inset-0 bg-slate-50/60 dark:bg-zinc-950/60 pointer-events-none" />

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {profile?.avatar ? (
            <img src={profile.avatar} alt="avatar" className="w-12 h-12 rounded-2xl border border-zinc-700" />
          ) : (
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-lg font-bold">
              {session?.user.email?.[0].toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-slate-800 dark:text-white text-lg font-bold tracking-tight">Operations Dashboard</h1>
            <p className="text-slate-400 dark:text-zinc-500 text-xs mt-0.5">{today} · Real-time overview</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-5 text-xs text-slate-400 dark:text-zinc-400 bg-white dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700/50 rounded-xl px-5 py-2.5">
          <span>Total <b className="text-slate-800 dark:text-white ml-1">{total}</b></span>
          <span className="text-zinc-700">|</span>
          <span>Interviews <b className="text-amber-400 ml-1">{interviews}</b></span>
          <span className="text-zinc-700">|</span>
          <span>Offers <b className="text-emerald-400 ml-1">{offers}</b></span>
          <span className="text-zinc-700">|</span>
          <span>Rejected <b className="text-rose-400 ml-1">{rejected}</b></span>
        </div>
      </div>





      {/* ── Quick Actions ── */}
      <div className="bg-white dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700/50 rounded-2xl px-5 py-4 mb-5">
        <div className="flex items-center gap-2 text-slate-400 dark:text-zinc-500 text-xs font-semibold uppercase tracking-widest mb-3">
          <ZapIcon size={12} /> Quick Actions
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/tracker" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-lg shadow-blue-900/30">
            <AddIcon size={13} /> Add Application
          </Link>
          <Link to="/jobs" className="flex items-center gap-2 bg-slate-100 dark:bg-zinc-700 hover:bg-slate-200 dark:hover:bg-zinc-600 text-slate-600 dark:text-zinc-200 text-xs font-medium px-4 py-2 rounded-xl transition-all border border-slate-200 dark:border-zinc-600/50">
            <SearchIcon size={13} /> Browse Jobs
          </Link>
          <Link to="/news" className="flex items-center gap-2 bg-slate-100 dark:bg-zinc-700 hover:bg-slate-200 dark:hover:bg-zinc-600 text-slate-600 dark:text-zinc-200 text-xs font-medium px-4 py-2 rounded-xl transition-all border border-slate-200 dark:border-zinc-600/50">
            <NewsFileIcon size={13} /> Dev News
          </Link>
          <Link to="/profile" className="flex items-center gap-2 bg-slate-100 dark:bg-zinc-700 hover:bg-slate-200 dark:hover:bg-zinc-600 text-slate-600 dark:text-zinc-200 text-xs font-medium px-4 py-2 rounded-xl transition-all border border-slate-200 dark:border-zinc-600/50">
            <UserIcon size={13} /> GitHub Profile
          </Link>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* LEFT */}
        <div className="lg:col-span-3 space-y-5">

          {/* Alert Priority Queue */}
          <div className="bg-white dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700/50 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-slate-800 dark:text-white text-sm font-semibold">
                <BellIcon size={14} className="text-zinc-400" /> Alert Priority Queue
              </div>
              <Link to="/tracker" className="text-zinc-500 hover:text-blue-400 text-xs transition-colors">See all</Link>
            </div>
            {alerts.length === 0 ? (
              <div className="space-y-2.5">
                <div className="flex items-start gap-3 bg-slate-50 dark:bg-zinc-900/60 border border-dashed border-slate-200 dark:border-zinc-700/60 rounded-xl px-4 py-3">
                  <CheckCircleIcon size={14} className="text-zinc-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-zinc-400 text-xs font-semibold">No active alerts</p>
                    <p className="text-zinc-600 text-xs mt-0.5">Alerts appear here for interviews, offers, and applications needing follow-up.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-slate-50 dark:bg-zinc-900/60 border border-dashed border-slate-200 dark:border-zinc-700/60 rounded-xl px-4 py-3">
                  <MailIcon size={14} className="text-blue-400/50 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-zinc-400 text-xs font-semibold">Tip: Follow up after 10 days</p>
                    <p className="text-zinc-600 text-xs mt-0.5">Applications older than 10 days with no response will appear as follow-up alerts.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-slate-50 dark:bg-zinc-900/60 border border-dashed border-slate-200 dark:border-zinc-700/60 rounded-xl px-4 py-3">
                  <BellIcon size={14} className="text-amber-400/50 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-zinc-400 text-xs font-semibold">Interview alerts show here</p>
                    <p className="text-zinc-600 text-xs mt-0.5">When you move an application to Interview status, you'll see a preparation reminder.</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5">
                {alerts.map((alert, i) => {
                  const s = ALERT_STYLES[alert.type];
                  return (
                    <div key={i} className="flex items-start gap-3 bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-700/40 rounded-xl px-4 py-3 hover:border-slate-300 dark:hover:border-zinc-600 transition-all">
                      <div className={`w-2 h-2 rounded-full ${s.dot} mt-1.5 shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <p className="text-slate-800 dark:text-white text-xs font-semibold truncate">{alert.title}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${s.badge}`}>{alert.label}</span>
                        </div>
                        <p className="text-zinc-500 text-xs">{alert.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700/50 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-slate-800 dark:text-white text-sm font-semibold">
                <ClockIcon size={14} className="text-zinc-400" /> Recent Activity
              </div>
              <Link to="/tracker" className="text-zinc-500 hover:text-blue-400 text-xs transition-colors">See all</Link>
            </div>
            {recent.length === 0 ? (
              <div className="space-y-2">
                {['Add your first application to get started', 'Your applications will appear here', 'Track status changes in real time'].map((t, i) => (
                  <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-900/40 border border-dashed border-slate-200 dark:border-zinc-700/50">
                    <div className="w-8 h-8 rounded-xl bg-zinc-700/50 shrink-0" />
                    <p className="text-zinc-600 text-xs">{t}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-1">
                {recent.map((job) => (
                  <div key={job.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-700/30 transition-all">
                    <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-zinc-700/80 flex items-center justify-center text-slate-600 dark:text-white text-xs font-bold shrink-0">
                      {job.company[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-700 dark:text-white text-xs font-medium truncate">{job.role} <span className="text-slate-400 dark:text-zinc-500 font-normal">at {job.company}</span></p>
                      <p className="text-slate-400 dark:text-zinc-600 text-xs">{timeAgo(job.created_at)}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium shrink-0 ${ALERT_STYLES[job.status === 'Interview' ? 'warning' : job.status === 'Offer' ? 'offer' : job.status === 'Rejected' ? 'critical' : 'info'].badge}`}>
                      {job.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-2 space-y-5">

          {/* Application Pipeline — Donut Chart */}
          <div className="bg-white dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700/50 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-slate-800 dark:text-white text-sm font-semibold">
                <BarChartIcon size={14} className="text-zinc-400" /> Application Pipeline
              </div>
              <span className="text-slate-400 dark:text-zinc-500 text-xs">{responseRate}% response rate</span>
            </div>
            <DonutChart data={STATUS_CONFIG.map(({ key, label }) => ({
              key,
              label,
              count: jobs.filter((j) => j.status === key).length,
              color: key === 'Applied' ? '#3b82f6' : key === 'Interview' ? '#fbbf24' : key === 'Offer' ? '#34d399' : '#f43f5e',
            }))} />
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-zinc-700/40 grid grid-cols-2 gap-3">
              <div className="bg-slate-100 dark:bg-zinc-900/60 rounded-xl px-3 py-2.5 text-center">
                <p className="text-slate-800 dark:text-white text-xl font-black">{responseRate}%</p>
                <p className="text-slate-400 dark:text-zinc-500 text-xs mt-0.5">Response rate</p>
              </div>
              <div className="bg-slate-100 dark:bg-zinc-900/60 rounded-xl px-3 py-2.5 text-center">
                <p className="text-slate-800 dark:text-white text-xl font-black">{applied}</p>
                <p className="text-slate-400 dark:text-zinc-500 text-xs mt-0.5">Awaiting reply</p>
              </div>
            </div>
          </div>

          {/* Weekly Chart — Smooth Area Chart */}
          <div className="bg-white dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700/50 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-slate-800 dark:text-white text-sm font-semibold">
                <TrendingUpIcon size={14} className="text-zinc-400" /> Weekly Applications
              </div>
              <span className="text-slate-400 dark:text-zinc-500 text-xs">Last 6 weeks</span>
            </div>
            <AreaChart data={weeklyData} />
            <div className="flex justify-between text-xs text-zinc-600 pt-3 border-t border-slate-200 dark:border-zinc-700/40 mt-1">
              <span>Total this period</span>
              <span className="text-slate-700 dark:text-zinc-300 font-semibold">{weeklyData.reduce((s, w) => s + w.count, 0)} applications</span>
            </div>
          </div>

          {/* Daily Tip */}
          <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/10 border border-blue-500/20 rounded-2xl p-5">
            <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <LightbulbIcon size={13} /> Job Search Tip
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-300 mb-3">
              <TipIcon size={20} />
            </div>
            <p className="text-zinc-200 text-sm leading-relaxed">{tip}</p>
          </div>

        </div>
      </div>

      {/* ── Activity Heatmap ── */}
      <div className="bg-white dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700/50 rounded-2xl p-5 mt-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-slate-800 dark:text-white text-sm font-semibold">
            <BarChartIcon size={14} className="text-zinc-400" /> Application Activity
          </div>
          <span className="text-slate-400 dark:text-zinc-500 text-xs">Last 20 weeks</span>
        </div>
        <ActivityHeatmap jobs={jobs} />
      </div>

    </div>
  );
}
