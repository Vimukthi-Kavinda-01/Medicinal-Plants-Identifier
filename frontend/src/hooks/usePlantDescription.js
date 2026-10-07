import { useCallback, useState } from 'react';
import { describePlant } from '../lib/api';

export function usePlantDescription() {
  const [status, setStatus] = useState('idle');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);

  const run = useCallback(async (plantName, fallbackInfo = null) => {
    if (!plantName) return null;

    setStatus('loading');
    setError(null);

    try {
      const result = await describePlant(plantName);
      const text = typeof result === 'string' ? result : (result?.description || '');
      setDescription(text);
      setStatus('success');
      setError(null);
      return text;
    } catch (err) {
      if (fallbackInfo?.medicinalUses || fallbackInfo?.habitat) {
        const fallback = [
          `${fallbackInfo.name || plantName} (${fallbackInfo.scientificName || 'scientific name unavailable'}) is a ${fallbackInfo.family || 'documented'} plant.`,
          fallbackInfo.habitat ? `It is commonly found in ${fallbackInfo.habitat.toLowerCase()}.` : '',
          fallbackInfo.medicinalUses
            ? `Traditional and researched uses include ${fallbackInfo.medicinalUses.toLowerCase()}`
            : '',
          fallbackInfo.precautions ? `Safety note: ${fallbackInfo.precautions}` : '',
        ]
          .filter(Boolean)
          .join(' ');

        setDescription(fallback);
        setStatus('fallback');
        setError(null);
        return fallback;
      }

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