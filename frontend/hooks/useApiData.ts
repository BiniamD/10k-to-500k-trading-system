'use client';

import { useEffect, useState } from 'react';

import { fetchApi } from '@/frontend/lib/api';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApiData<T>(path: string, refreshMs = 0): ApiState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryTick, setRetryTick] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;
    let retryTimeout: ReturnType<typeof setTimeout> | undefined;

    const load = async () => {
      try {
        if (isMounted && data === null) {
          setLoading(true);
        }
        const next = await fetchApi<T>(path, controller.signal);
        if (!isMounted) return;
        setData(next);
        setError(null);
        setLoading(false);
      } catch (err) {
        if (!isMounted || controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : 'Unknown API error');
        setLoading(false);
        retryTimeout = setTimeout(() => setRetryTick((v) => v + 1), 2000);
      }
    };

    load();
    const interval = refreshMs > 0 ? setInterval(load, refreshMs) : undefined;

    return () => {
      isMounted = false;
      controller.abort();
      if (interval) clearInterval(interval);
      if (retryTimeout) clearTimeout(retryTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, refreshMs, retryTick]);

  return { data, loading, error };
}
