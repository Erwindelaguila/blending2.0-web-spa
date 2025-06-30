import { useState, useCallback } from 'react';

export type AsyncActionState = 'idle' | 'loading' | 'success' | 'error';

export interface UseAsyncActionReturn {
  state: AsyncActionState;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: string | null;
  execute: (action: () => Promise<void>) => Promise<void>;
  reset: () => void;
}

export const useAsyncAction = (): UseAsyncActionReturn => {
  const [state, setState] = useState<AsyncActionState>('idle');
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (action: () => Promise<void>) => {
    setState('loading');
    setError(null);
    
    try {
      await action();
      setState('success');
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'Ha ocurrido un error inesperado';
      setError(errorMessage);
      setState('error');
    }
  }, []);

  const reset = useCallback(() => {
    setState('idle');
    setError(null);
  }, []);

  return {
    state,
    isLoading: state === 'loading',
    isSuccess: state === 'success',
    isError: state === 'error',
    error,
    execute,
    reset,
  };
};
