import { renderHook, waitFor } from '@testing-library/react';
import { useFetch } from '../src/hooks/useFetch';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

test('useFetch returns data on success', async () => {
  mockedAxios.get.mockResolvedValueOnce({ data: [{ id: 1, title: 'Test' }] });
  const { result } = renderHook(() => useFetch('/api/test'));
  await waitFor(() => expect(result.current.loading).toBe(false));
  expect(result.current.data).toEqual([{ id: 1, title: 'Test' }]);
  expect(result.current.error).toBeNull();
});