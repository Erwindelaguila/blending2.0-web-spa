import { useState, useCallback } from 'react';

export type AsyncActionState = 'idle' | 'loading' | 'success';

export interface UseAsyncActionReturn {
  state: AsyncActionState;
  isLoading: boolean;
  isSuccess: boolean;
  execute: (action: () => Promise<void>) => Promise<void>;
  reset: () => void;
}

export const useAsyncAction = (): UseAsyncActionReturn => {
  const [state, setState] = useState<AsyncActionState>('idle');

  const execute = useCallback(async (action: () => Promise<void>) => {
    setState('loading');
    
    await action();
    
    setState('success');
  }, []);

  const reset = useCallback(() => {
    setState('idle');
  }, []);

  return {
    state,
    isLoading: state === 'loading',
    isSuccess: state === 'success',
    execute,
    reset,
  };
};
