import { useState, useCallback } from 'react';
import { identifyPlant, verifyPlant } from '../lib/api';

/**
 * Guided identification flow.
 *
 * status: 'idle' -> 'analyzing' -> ('verifying' -> 'submitting') -> 'final'
 *         or 'none' (no plant found) / 'error'
 */
export function useIdentification() {
  const [status, setStatus] = useState('idle');
  const [top3, setTop3] = useState([]);
  const [level, setLevel] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const applyResponse = useCallback((data) => {
    setTop3(data.top3 || []);
    setLevel(data.level || null);
    setQuestions(data.questions || []);
    setResult(data.result || null);
    setStatus(data.stage === 'verification' ? 'verifying' : data.stage === 'final' ? 'final' : 'none');
  }, []);

  /** Steps 4–5. Resolves with the final result when no questions are needed. */
  const run = useCallback(
    async (image) => {
      setStatus('analyzing');
      setError(null);
      setResult(null);
      setQuestions([]);
      try {
        const data = await identifyPlant(image);
        applyResponse(data);
        return data.result || null;
      } catch (err) {
        setError(err.message || 'Identification failed. Please try again.');
        setStatus('error');
        return null;
      }
    },
    [applyResponse]
  );

  /** Steps 6–9. Pass an empty object to skip the questions. */
  const submitAnswers = useCallback(
    async (answers = {}) => {
      setStatus('submitting');
      setError(null);
      try {
        const data = await verifyPlant(top3, answers);
        applyResponse(data);
        return data.result || null;
      } catch (err) {
        setError(err.message || 'Verification failed. Please try again.');
        setStatus('verifying');
        return null;
      }
    },
    [top3, applyResponse]
  );

  const reset = useCallback(() => {
    setStatus('idle');
    setTop3([]);
    setLevel(null);
    setQuestions([]);
    setResult(null);
    setError(null);
  }, []);

  return {
    status,
    top3,
    level,
    questions,
    result,
    error,
    isBusy: status === 'analyzing' || status === 'submitting',
    isAnalyzing: status === 'analyzing',
    isSubmitting: status === 'submitting',
    run,
    submitAnswers,
    reset,
  };
}