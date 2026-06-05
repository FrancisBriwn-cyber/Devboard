import { memo } from 'react';
import type { Job } from '../types';

const STATUS_COLORS: Record<string, string> = {
  Applied:   'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20',
  Interview: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20',
  Offer:     'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
  Rejected:  'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20',
};

interface Props {
  job: Job;
  onEdit: (job: Job) => void;
  onDelete: (id: string) => void;
}

const JobCard = memo(({ job, onEdit, onDelete }: Props) => {
  return (
    <div className="bg-white dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700/50 rounded-2xl px-6 py-4 flex justify-between items-center hover:border-slate-300 dark:hover:border-zinc-600 hover:shadow-sm dark:hover:bg-zinc-800 transition-all">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h3 className="font-semibold text-slate-800 dark:text-white text-sm">{job.role}</h3>
          <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${STATUS_COLORS[job.status]}`}>
            {job.status}
          </span>
        </div>
        <p className="text-slate-500 dark:text-zinc-400 text-sm">{job.company}</p>
        <p className="text-slate-400 dark:text-zinc-600 text-xs mt-1">{job.applied_at}{job.notes ? ` · ${job.notes}` : ''}</p>
      </div>
      <div className="flex gap-3 shrink-0 ml-4">
        <button onClick={() => onEdit(job)} className="text-xs text-slate-400 dark:text-zinc-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors font-medium">Edit</button>
        <button onClick={() => onDelete(job.id)} className="text-xs text-slate-400 dark:text-zinc-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors font-medium">Delete</button>
      </div>
    </div>
  );
});

export default JobCard;
