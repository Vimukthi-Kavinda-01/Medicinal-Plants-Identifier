import { useState, useCallback } from 'react';
import { detectMedicinalPlant } from '../lib/api';

export function useDetection() {
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [predictions, setPredictions] = useState([]);
  const [error, setError] = useState(null);

  const run = useCallback(async (imageData) => {
    if (!imageData) {
      setError('Please provide a valid image before running detection.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setError(null);

    try {
      const results = await detectMedicinalPlant(imageData);
      const preds = Array.isArray(results) ? results : (results?.predictions || []);
      setPredictions(preds);
      setStatus('success');
      return preds;
    } catch (err) {
      console.error('[Detection Hook Error]:', err);
      setError(err.message || 'Detection failed. Please try again.');
      setStatus('error');
      return [];
    }
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setPredictions([]);
    setError(null);
  }, []);

  return {
    status,
    isLoading: status === 'loading',
    isSuccess: status === 'success',
    isError: status === 'error',
    predictions,
    error,
    run,
    reset,
  };
}

