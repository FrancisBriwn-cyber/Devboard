import { useState, useEffect } from 'react';
import axios from 'axios';

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useFetch<T>(url: string): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    setData(null);

    const controller = new AbortController();

    axios.get<T>(url, { signal: controller.signal })
      .then((res) => { if (!cancelled) setData(res.data); })
      .catch((err) => {
        if (cancelled || axios.isCancel(err)) return;
        const status = err?.response?.status;
        if (status === 404) setError('Not found.');
        else if (status === 403) setError('Access denied or rate limit reached. Try again in a minute.');
        else if (status === 429) setError('Too many requests — please wait a moment.');
        else setError('Failed to load. Check your connection.');
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [url]);

  return { data, loading, error };
}