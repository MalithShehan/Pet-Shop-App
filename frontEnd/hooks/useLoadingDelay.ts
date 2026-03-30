import { useEffect, useState } from 'react';

export function useLoadingDelay(durationMs = 450) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), durationMs);
    return () => clearTimeout(timeout);
  }, [durationMs]);

  return loading;
}
