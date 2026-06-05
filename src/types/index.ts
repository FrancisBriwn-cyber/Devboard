export interface Job {
  id: string;
  user_id: string;
  company: string;
  role: string;
  status: 'Applied' | 'Interview' | 'Offer' | 'Rejected';
  applied_at: string;
  notes?: string;
  job_url?: string;
  created_at: string;
}

export interface NewJob {
  company: string;
  role: string;
  status: 'Applied' | 'Interview' | 'Offer' | 'Rejected';
  applied_at: string;
  notes?: string;
  job_url?: string;
}