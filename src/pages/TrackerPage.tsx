import { useState, useCallback } from 'react';
import { useJobTracker } from '../hooks/useJobTracker';
import { ParticleTextEffect } from '@/components/ui/particle-text-effect';
import type { NewJob, Job } from '../types';

const STATUSES = ['Applied', 'Interview', 'Offer', 'Rejected'] as const;
type Status = typeof STATUSES[number];

const STATUS_CFG: Record<Status, { dot: string; badge: string; header: string; text: string }> = {
  Applied:   { dot: 'bg-blue-500',    badge: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20',    header: 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20',    text: 'text-blue-600 dark:text-blue-400' },
  Interview: { dot: 'bg-amber-400',   badge: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20',  header: 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20',  text: 'text-amber-600 dark:text-amber-400' },
  Offer:     { dot: 'bg-emerald-400', badge: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20', header: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20', text: 'text-emerald-600 dark:text-emerald-400' },
  Rejected:  { dot: 'bg-rose-500',    badge: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20',    header: 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20',    text: 'text-rose-600 dark:text-rose-400' },
};

const emptyForm: NewJob = {
  company: '', role: '', status: 'Applied',
  applied_at: new Date().toISOString().split('T')[0],
  notes: '', job_url: '',
};

const INPUT = 'w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700/60 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition';

/* ── Small icon helpers ── */
const ChevL = () => <svg width="8" height="8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>;
const ChevR = () => <svg width="8" height="8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>;
const PenIcon = () => <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const TrashIcon = () => <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>;
const LinkIcon = () => <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>;
const PlusIcon = () => <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const CloseIcon = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const SearchIcon = () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;

export default function TrackerPage() {
  const { jobs, createJob, editJob, deleteJob } = useJobTracker();
  const [view, setView]             = useState<'kanban' | 'list'>('kanban');
  const [showForm, setShowForm]     = useState(false);
  const [form, setForm]             = useState<NewJob>(emptyForm);
  const [editingId, setEditingId]   = useState<string | null>(null);
  const [loading, setLoading]       = useState(false);
  const [search, setSearch]         = useState('');
  const [confirmDel, setConfirmDel] = useState<string | null>(null);

  const filtered = jobs.filter(j =>
    j.company.toLowerCase().includes(search.toLowerCase()) ||
    j.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async () => {
    if (!form.company.trim() || !form.role.trim()) return;
    setLoading(true);
    if (editingId) { await editJob(editingId, form); setEditingId(null); }
    else await createJob(form);
    setForm(emptyForm); setLoading(false); setShowForm(false);
  };

  const handleEdit = useCallback((job: Job) => {
    setEditingId(job.id);
    setForm({ company: job.company, role: job.role, status: job.status, applied_at: job.applied_at, notes: job.notes ?? '', job_url: job.job_url ?? '' });
    setShowForm(true);
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    await deleteJob(id); setConfirmDel(null);
  }, [deleteJob]);

  const moveStatus = async (job: Job, dir: 1 | -1) => {
    const i = STATUSES.indexOf(job.status as Status);
    const next = STATUSES[i + dir];
    if (next) await editJob(job.id, { ...job, status: next });
  };

  const openAdd = (status?: Status) => {
    setEditingId(null);
    setForm({ ...emptyForm, status: status ?? 'Applied' });
    setShowForm(true);
  };

  const closeForm = () => { setShowForm(false); setEditingId(null); setForm(emptyForm); };

  /* ── Icon button helper ── */
  const IconBtn = ({ onClick, title, hover, children }: { onClick: () => void; title: string; hover: string; children: React.ReactNode }) => (
    <button onClick={onClick} title={title}
      className={`w-6 h-6 rounded-lg bg-slate-100 dark:bg-zinc-700 flex items-center justify-center text-slate-400 dark:text-zinc-400 transition ${hover}`}>
      {children}
    </button>
  );

  return (
    <div className="relative min-h-full overflow-hidden bg-slate-50/80 dark:bg-zinc-950/88 px-4 md:px-8 py-6 md:py-8">
      <ParticleTextEffect backgroundMode words={["Tracker", "Applications", "Flow"]} particleColor="primary" />
      <div className="absolute inset-0 bg-slate-50/70 dark:bg-zinc-950/70 pointer-events-none" />

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <h1 className="text-slate-800 dark:text-white text-xl font-bold tracking-tight">Job Tracker</h1>
          <div className="flex items-center gap-3 mt-1">
            {STATUSES.map(s => {
              const count = jobs.filter(j => j.status === s).length;
              const cfg = STATUS_CFG[s];
              return (
                <span key={s} className="flex items-center gap-1 text-xs">
                  <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                  <span className="text-slate-400 dark:text-zinc-500">{s}</span>
                  <span className={`font-bold ${cfg.text}`}>{count}</span>
                </span>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Search */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><SearchIcon /></span>
            <input placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)}
              className="pl-8 pr-3 py-2 text-sm bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 transition w-32 md:w-44" />
          </div>

          {/* View toggle */}
          <div className="flex bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700/50 rounded-xl p-1 gap-0.5">
            {(['kanban', 'list'] as const).map(v => (
              <button key={v} onClick={() => setView(v)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${view === v ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200'}`}>
                {v === 'kanban' ? 'Board' : 'List'}
              </button>
            ))}
          </div>

          {/* Add button */}
          <button onClick={() => openAdd()}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition shadow-lg shadow-blue-900/30">
            <PlusIcon /> Add
          </button>
        </div>
      </div>


      {/* ════════════════════════════
          KANBAN BOARD
          ════════════════════════════ */}
      {view === 'kanban' && (
        <div className="pb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {STATUSES.map(status => {
              const cfg = STATUS_CFG[status];
              const colJobs = filtered.filter(j => j.status === status);
              return (
                <div key={status} className="flex flex-col gap-2">
                  {/* Column header */}
                  <div className={`flex items-center justify-between px-3 py-2 rounded-xl border ${cfg.header}`}>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                      <span className={`text-xs font-bold ${cfg.text}`}>{status}</span>
                    </div>
                    <span className={`text-xs font-black ${cfg.text}`}>{colJobs.length}</span>
                  </div>

                  {/* Cards */}
                  <div className="space-y-2">
                    {/* Empty state */}
                    {colJobs.length === 0 && (
                      <button onClick={() => openAdd(status)}
                        className="w-full flex flex-col items-center justify-center gap-2 py-5 sm:py-8 rounded-xl border-2 border-dashed border-slate-200 dark:border-zinc-700/60 hover:border-blue-400 dark:hover:border-blue-500/50 hover:bg-blue-50/50 dark:hover:bg-blue-500/5 transition-all group/empty">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center opacity-30 group-hover/empty:opacity-60 transition-opacity ${cfg.dot} bg-opacity-20`}
                          style={{ backgroundColor: 'currentColor' }}>
                          <div className={`w-8 h-8 rounded-full ${cfg.dot} opacity-20`} />
                        </div>
                        <div className="text-center">
                          <p className="text-slate-400 dark:text-zinc-600 text-xs font-medium group-hover/empty:text-blue-500 dark:group-hover/empty:text-blue-400 transition-colors">
                            No {status.toLowerCase()} yet
                          </p>
                          <p className="text-slate-300 dark:text-zinc-700 text-[10px] mt-0.5 group-hover/empty:text-blue-400/70 transition-colors">
                            + Add one
                          </p>
                        </div>
                      </button>
                    )}
                    {colJobs.map(job => (
                      <div key={job.id}
                        className="bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700/50 rounded-xl p-3 hover:shadow-md dark:hover:border-zinc-600 transition-all group">

                        {/* Top row */}
                        <div className="flex items-start gap-2 mb-2">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-200 to-slate-100 dark:from-zinc-700 dark:to-zinc-600 flex items-center justify-center text-slate-700 dark:text-white text-xs font-bold shrink-0">
                            {job.company[0]?.toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-slate-800 dark:text-white text-xs font-semibold truncate leading-tight">{job.role}</p>
                            <p className="text-slate-500 dark:text-zinc-400 text-xs truncate">{job.company}</p>
                          </div>
                          {job.job_url && (
                            <a href={job.job_url} target="_blank" rel="noopener noreferrer" title="Open listing"
                              className="text-slate-300 hover:text-blue-500 dark:text-zinc-600 dark:hover:text-blue-400 transition shrink-0 mt-0.5">
                              <LinkIcon />
                            </a>
                          )}
                        </div>

                        {job.notes && (
                          <p className="text-slate-400 dark:text-zinc-500 text-xs mb-2 line-clamp-1 leading-relaxed">{job.notes}</p>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 dark:text-zinc-600 text-[10px]">{job.applied_at}</span>
                          <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                            {STATUSES.indexOf(status) > 0 && (
                              <IconBtn onClick={() => moveStatus(job, -1)} title="Move back" hover="hover:bg-slate-200 dark:hover:bg-zinc-600">
                                <ChevL />
                              </IconBtn>
                            )}
                            {STATUSES.indexOf(status) < STATUSES.length - 1 && (
                              <IconBtn onClick={() => moveStatus(job, 1)} title="Move forward" hover="hover:bg-slate-200 dark:hover:bg-zinc-600">
                                <ChevR />
                              </IconBtn>
                            )}
                            <IconBtn onClick={() => handleEdit(job)} title="Edit" hover="hover:bg-blue-100 dark:hover:bg-blue-500/20 hover:text-blue-500">
                              <PenIcon />
                            </IconBtn>
                            <IconBtn onClick={() => setConfirmDel(job.id)} title="Delete" hover="hover:bg-rose-100 dark:hover:bg-rose-500/20 hover:text-rose-500">
                              <TrashIcon />
                            </IconBtn>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Add to column */}
                    <button onClick={() => openAdd(status)}
                      className="w-full py-2 rounded-xl border border-dashed border-slate-300 dark:border-zinc-700 text-slate-400 dark:text-zinc-600 text-xs hover:border-blue-400 dark:hover:border-blue-500/50 hover:text-blue-500 dark:hover:text-blue-400 transition-all flex items-center justify-center gap-1">
                      <PlusIcon /> Add {status}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ════════════════════════════
          LIST VIEW
          ════════════════════════════ */}
      {view === 'list' && (
        <div className="space-y-2.5">
          {filtered.length === 0 && (
            <div className="bg-white dark:bg-zinc-800/40 border border-slate-200 dark:border-zinc-700/40 rounded-2xl p-12 text-center">
              <p className="text-slate-400 dark:text-zinc-500 text-sm">
                {search ? `No results for "${search}"` : 'No applications yet — hit Add to get started.'}
              </p>
            </div>
          )}
          {filtered.map(job => {
            const cfg = STATUS_CFG[job.status as Status];
            return (
              <div key={job.id}
                className="bg-white dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700/50 rounded-2xl px-5 py-4 flex items-center gap-4 hover:shadow-sm dark:hover:border-zinc-600 hover:border-slate-300 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-200 to-slate-100 dark:from-zinc-700 dark:to-zinc-600 flex items-center justify-center text-slate-700 dark:text-white text-sm font-bold shrink-0">
                  {job.company[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-slate-800 dark:text-white text-sm font-semibold">{job.role}</p>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${cfg.badge}`}>{job.status}</span>
                  </div>
                  <p className="text-slate-500 dark:text-zinc-400 text-xs mt-0.5 truncate">
                    {job.company} · {job.applied_at}{job.notes ? ` · ${job.notes}` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                  {job.job_url && (
                    <a href={job.job_url} target="_blank" rel="noopener noreferrer"
                      className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-zinc-700 hover:bg-blue-100 dark:hover:bg-blue-500/20 flex items-center justify-center text-slate-400 hover:text-blue-500 transition">
                      <LinkIcon />
                    </a>
                  )}
                  <button onClick={() => handleEdit(job)}
                    className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-zinc-700 hover:bg-blue-100 dark:hover:bg-blue-500/20 flex items-center justify-center text-slate-400 hover:text-blue-500 transition">
                    <PenIcon />
                  </button>
                  <button onClick={() => setConfirmDel(job.id)}
                    className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-zinc-700 hover:bg-rose-100 dark:hover:bg-rose-500/20 flex items-center justify-center text-slate-400 hover:text-rose-500 transition">
                    <TrashIcon />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ════════════════════════════
          ADD / EDIT DRAWER
          ════════════════════════════ */}
      {showForm && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={closeForm} />
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-zinc-900 border-l border-slate-200 dark:border-zinc-700/50 z-50 flex flex-col shadow-2xl">

            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-zinc-700/50">
              <h2 className="text-slate-800 dark:text-white font-bold text-base">
                {editingId ? 'Edit Application' : 'Add Application'}
              </h2>
              <button onClick={closeForm}
                className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200 transition">
                <CloseIcon />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              {[
                { key: 'company', label: 'Company', placeholder: 'e.g. Google', required: true },
                { key: 'role',    label: 'Role',    placeholder: 'e.g. Frontend Engineer', required: true },
              ].map(({ key, label, placeholder, required }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
                    {label} {required && <span className="text-rose-400">*</span>}
                  </label>
                  <input placeholder={placeholder} value={form[key as 'company' | 'role']}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                    className={INPUT} />
                </div>
              ))}

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-2 uppercase tracking-wider">Status</label>
                <div className="grid grid-cols-2 gap-2">
                  {STATUSES.map(s => {
                    const cfg = STATUS_CFG[s];
                    return (
                      <button key={s} onClick={() => setForm({ ...form, status: s })}
                        className={`py-2 rounded-xl text-xs font-semibold border transition-all ${form.status === s ? cfg.badge : 'border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-zinc-400 hover:border-slate-300 dark:hover:border-zinc-600 bg-transparent'}`}>
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">Applied Date</label>
                <input type="date" value={form.applied_at} onChange={e => setForm({ ...form, applied_at: e.target.value })} className={INPUT} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">Job URL</label>
                <input placeholder="https://..." value={form.job_url} onChange={e => setForm({ ...form, job_url: e.target.value })} className={INPUT} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">Notes</label>
                <textarea placeholder="Any notes about this application…" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                  rows={3} className={`${INPUT} resize-none`} />
              </div>
            </div>

            <div className="px-6 py-5 border-t border-slate-200 dark:border-zinc-700/50 flex gap-3">
              <button onClick={handleSubmit} disabled={loading || !form.company.trim() || !form.role.trim()}
                className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white py-2.5 rounded-xl text-sm font-semibold transition shadow-lg shadow-blue-900/30">
                {loading ? 'Saving…' : editingId ? 'Update' : 'Add Application'}
              </button>
              <button onClick={closeForm}
                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 text-sm hover:bg-slate-50 dark:hover:bg-zinc-800 transition">
                Cancel
              </button>
            </div>
          </div>
        </>
      )}

      {/* ════════════════════════════
          DELETE CONFIRM MODAL
          ════════════════════════════ */}
      {confirmDel && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" onClick={() => setConfirmDel(null)} />
          <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700/50 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
              <h3 className="text-slate-800 dark:text-white font-bold mb-1.5">Delete application?</h3>
              <p className="text-slate-500 dark:text-zinc-400 text-sm mb-5">This cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => handleDelete(confirmDel)}
                  className="flex-1 bg-rose-600 hover:bg-rose-500 text-white py-2.5 rounded-xl text-sm font-semibold transition">
                  Delete
                </button>
                <button onClick={() => setConfirmDel(null)}
                  className="flex-1 border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 py-2.5 rounded-xl text-sm hover:bg-slate-50 dark:hover:bg-zinc-800 transition">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
