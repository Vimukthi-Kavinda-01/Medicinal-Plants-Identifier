import { useCallback, useState } from 'react';
import { describePlant } from '../lib/api';

export function usePlantDescription() {
  const [status, setStatus] = useState('idle');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);

  const run = useCallback(async (plantName) => {
    setStatus('loading');
    setError(null);

    try {
      const result = await describePlant(plantName);
      setDescription(result);
      setStatus('success');
      return result;
    } catch (err) {
      setError(err.message || 'Description generation failed.');
      setStatus('error');
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setDescription('');
    setError(null);
  }, []);

  return { status, description, error, isLoading: status === 'loading', isError: status === 'error', run, reset };
}