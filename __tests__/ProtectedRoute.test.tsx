import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProtectedRoute from '../src/components/ProtectedRoute';
import { useAuthStore } from '../src/store/authStore';

test('redirects to login when not authenticated', () => {
  useAuthStore.setState({ session: null });
  render(
    <MemoryRouter>
      <ProtectedRoute>
        <div>Secret Content</div>
      </ProtectedRoute>
    </MemoryRouter>
  );
  expect(screen.queryByText('Secret Content')).not.toBeInTheDocument();
});