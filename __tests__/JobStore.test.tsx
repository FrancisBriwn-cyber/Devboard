import { useJobStore } from '../src/store/jobStore';
import type { Job } from '../src/types';

const mockJob: Job = {
  id: '1',
  user_id: 'user1',
  company: 'Meta',
  role: 'React Developer',
  status: 'Applied',
  applied_at: '2026-06-02',
  created_at: '2026-06-02',
};

test('addJob adds a job to the store', () => {
  const { addJob } = useJobStore.getState();
  addJob(mockJob);
  expect(useJobStore.getState().jobs).toContainEqual(mockJob);
});

test('removeJob removes a job from the store', () => {
  const { removeJob } = useJobStore.getState();
  removeJob('1');
  expect(useJobStore.getState().jobs).not.toContainEqual(mockJob);
});