import { useCallback, useState } from 'react';
import { describePlant } from '../lib/api';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function usePlantDescription() {
  const [status, setStatus] = useState('idle');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);

  const run = useCallback(async (plantName) => {
    if (!plantName) return null;

    setStatus('loading');
    setError(null);

    // Initial attempt + 1 client-side auto-retry on capacity limits
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const result = await describePlant(plantName);
        setDescription(result);
        setStatus('success');
        setError(null);
        return result;
      } catch (err) {
        const isCapacity = /capacity|busy|overloaded|limit reached|503/i.test(err.message || '');
        if (isCapacity && attempt === 0) {
          console.log('[usePlantDescription] Capacity limit encountered, auto-retrying in 2s...');
          await sleep(2000);
          continue;
        }

        setError(err.message || 'Description generation failed.');
        setStatus('error');
        return null;
      }
    }
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setDescription('');
    setError(null);
  }, []);

  return {
    status,
    description,
    error,
    isLoading: status === 'loading',
    isSuccess: status === 'success',
    isError: status === 'error',
    run,
    reset,
  };
}