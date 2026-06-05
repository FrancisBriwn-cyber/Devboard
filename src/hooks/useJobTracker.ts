import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useJobStore } from '../store/jobStore';
import { useAuthStore } from '../store/authStore';
import type { Job, NewJob } from '../types';

export function useJobTracker() {
  const { jobs, setJobs, addJob, updateJob, removeJob } = useJobStore();
  const session = useAuthStore((s) => s.session);

  useEffect(() => {
    if (!session) return;
    fetchJobs();
  }, [session]);

  const fetchJobs = async () => {
    const { data, error } = await supabase
      .from('job_applications')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setJobs(data as Job[]);
  };

  const createJob = async (newJob: NewJob) => {
    const { data, error } = await supabase
      .from('job_applications')
      .insert([{ ...newJob, user_id: session?.user.id }])
      .select()
      .single();
    if (!error && data) addJob(data as Job);
  };

  const editJob = async (id: string, updates: Partial<Job>) => {
    const { error } = await supabase
      .from('job_applications')
      .update(updates)
      .eq('id', id);
    if (!error) updateJob(id, updates);
  };

  const deleteJob = async (id: string) => {
    const { error } = await supabase
      .from('job_applications')
      .delete()
      .eq('id', id);
    if (!error) removeJob(id);
  };

  return { jobs, createJob, editJob, deleteJob };
}