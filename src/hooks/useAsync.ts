import { useState, useCallback } from 'react';

interface AsyncState<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
}

export function useAsync<T>(asyncFunction: () => Promise<T>, immediate = true) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    error: null,
    isLoading: immediate
  });

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const data = await asyncFunction();
      setState({ data, error: null, isLoading: false });
      return data;
    } catch (error) {
      setState({ data: null, error: error as Error, isLoading: false });
      throw error;
    }
  }, [asyncFunction]);

  return { ...state, execute };
}