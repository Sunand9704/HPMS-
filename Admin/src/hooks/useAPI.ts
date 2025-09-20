import { useState, useEffect, useCallback } from 'react';
import { ApiResponse } from '@/lib/api';

// Generic API hook for data fetching
export function useAPI<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiCall();
      
      if (response.success) {
        setData(response.data);
        setSuccess(true);
      } else {
        setError(response.message);
        setSuccess(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    success,
    refetch
  };
}

// Hook for mutations (POST, PUT, DELETE)
export function useMutation<T, P = any>(
  mutationFn: (params: P) => Promise<ApiResponse<T>>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState<T | null>(null);

  const mutate = useCallback(async (params: P) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      const response = await mutationFn(params);
      
      if (response.success) {
        setData(response.data);
        setSuccess(true);
        return response;
      } else {
        setError(response.message);
        setSuccess(false);
        return response;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      setSuccess(false);
      return {
        success: false,
        message: errorMessage,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, [mutationFn]);

  return {
    mutate,
    loading,
    error,
    success,
    data
  };
}

// Hook for paginated data
export function usePaginatedAPI<T>(
  apiCall: (page: number, limit: number, filters?: any) => Promise<ApiResponse<{
    data: T[];
    pagination: {
      current: number;
      pages: number;
      total: number;
    };
  }>>,
  initialPage: number = 1,
  initialLimit: number = 10,
  filters?: any
) {
  const [data, setData] = useState<T[]>([]);
  const [pagination, setPagination] = useState({
    current: initialPage,
    pages: 0,
    total: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const fetchData = useCallback(async (page: number, limit: number, currentFilters?: any) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiCall(page, limit, currentFilters);
      
      if (response.success && response.data) {
        setData(response.data.data);
        setPagination(response.data.pagination);
        setSuccess(true);
      } else {
        setError(response.message);
        setSuccess(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  useEffect(() => {
    fetchData(initialPage, initialLimit, filters);
  }, [fetchData, initialPage, initialLimit, filters]);

  const goToPage = useCallback((page: number) => {
    fetchData(page, initialLimit, filters);
  }, [fetchData, initialLimit, filters]);

  const changeLimit = useCallback((limit: number) => {
    fetchData(1, limit, filters);
  }, [fetchData, filters]);

  const refetch = useCallback(() => {
    fetchData(pagination.current, initialLimit, filters);
  }, [fetchData, pagination.current, initialLimit, filters]);

  return {
    data,
    pagination,
    loading,
    error,
    success,
    goToPage,
    changeLimit,
    refetch
  };
}
