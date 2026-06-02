import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { type JsdelivrStats, NpmApiError, NpmClient } from 'npmjs-api-client';
import { useNpmPackageVersionCdnStats } from './useNpmPackageVersionCdnStats.js';

const mockCdnStats = jest.fn<() => Promise<JsdelivrStats>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(NpmClient.prototype, 'package').mockReturnValue({
    version: () => ({ cdnStats: mockCdnStats }),
  } as ReturnType<NpmClient['package']>);
});

const mockData: JsdelivrStats = {
  total: 500000,
  files: { '/index.js': { total: 400000, dates: { '2024-01-01': 5000 } } },
};

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useNpmPackageVersionCdnStats', () => {
  it('returns data on success with defaults', async () => {
    mockCdnStats.mockResolvedValue(mockData);

    const { result } = renderHook(() => useNpmPackageVersionCdnStats('react', '18.2.0'), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockData);
    expect(mockCdnStats).toHaveBeenCalledWith('file', 'month', expect.anything());
  });

  it('passes custom groupBy and period', async () => {
    mockCdnStats.mockResolvedValue(mockData);

    const { result } = renderHook(
      () => useNpmPackageVersionCdnStats('react', '18.2.0', { groupBy: 'date', period: 'week' }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(mockCdnStats).toHaveBeenCalledWith('date', 'week', expect.anything());
  });

  it('returns error on failure', async () => {
    mockCdnStats.mockRejectedValue(new NpmApiError(404, 'Not Found'));

    const { result } = renderHook(
      () => useNpmPackageVersionCdnStats('react', '0.0.0-nonexistent'),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(NpmApiError);
  });

  it('does not fetch when name is empty', () => {
    const { result } = renderHook(() => useNpmPackageVersionCdnStats('', '18.2.0'), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockCdnStats).not.toHaveBeenCalled();
  });

  it('does not fetch when version is empty', () => {
    const { result } = renderHook(() => useNpmPackageVersionCdnStats('react', ''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockCdnStats).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useNpmPackageVersionCdnStats('react', '18.2.0', { enabled: false }),
      { wrapper },
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockCdnStats).not.toHaveBeenCalled();
  });
});
