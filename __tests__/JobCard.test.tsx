import { render, screen } from '@testing-library/react';
import JobCard from '../src/components/JobCard';
import type { Job } from '../src/types';

const mockJob: Job = {
  id: '1',
  user_id: 'user1',
  company: 'Google',
  role: 'Frontend Developer',
  status: 'Applied',
  applied_at: '2026-06-02',
  created_at: '2026-06-02',
};

test('renders job title and company', () => {
  render(<JobCard job={mockJob} onEdit={() => {}} onDelete={() => {}} />);
  expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
  expect(screen.getByText('Google')).toBeInTheDocument();
  expect(screen.getByText('Applied')).toBeInTheDocument();
});