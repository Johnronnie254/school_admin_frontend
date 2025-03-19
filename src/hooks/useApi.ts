import { useState, useCallback } from 'react';
import { AxiosResponse, AxiosError } from 'axios';
import { useDispatch } from 'react-redux';
import { addNotification } from '../store/slices/uiSlice';
import { ApiResponse } from '../types';

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  successMessage?: string;
  errorMessage?: string;
}

export const useApi = <T>({
  onSuccess,
  onError,
  successMessage,
  errorMessage,
}: UseApiOptions<T> = {}) => {
  const dispatch = useDispatch();
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  const execute = useCallback(
    async <R = T>(
      promise: Promise<AxiosResponse<ApiResponse<R>>>,
      options: UseApiOptions<R> = {}
    ) => {
      setLoading(true);
      setError(null);

      try {
        const response = await promise;
        setData(response.data.data as unknown as T);

        if (options.onSuccess) {
          options.onSuccess(response.data.data);
        }

        if (options.successMessage || successMessage) {
          dispatch(
            addNotification({
              message: options.successMessage || successMessage || 'Operation successful',
              type: 'success',
            })
          );
        }

        return response.data.data;
      } catch (err) {
        const error = err as AxiosError<ApiResponse<any>>;
        const errorMsg =
          error.response?.data?.message ||
          error.message ||
          'An unexpected error occurred';

        setError(new Error(errorMsg));

        if (options.onError) {
          options.onError(new Error(errorMsg));
        }

        if (options.errorMessage || errorMessage) {
          dispatch(
            addNotification({
              message: options.errorMessage || errorMessage || errorMsg,
              type: 'error',
            })
          );
        }

        throw error;
      } finally {
        setLoading(false);
      }
    },
    [dispatch, successMessage, errorMessage]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    error,
    loading,
    execute,
    reset,
  };
};

export default useApi; 