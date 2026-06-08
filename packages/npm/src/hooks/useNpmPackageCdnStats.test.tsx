import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { type JsdelivrStats, NpmApiError, NpmClient } from 'npmjs-api-client';
import type { ReactNode } from 'react';
import { useNpmPackageCdnStats } from './useNpmPackageCdnStats.js';

const mockCdnStats = jest.fn<() => Promise<JsdelivrStats>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(NpmClient.prototype, 'package').mockReturnValue({
    cdnStats: mockCdnStats,
  } as ReturnType<NpmClient['package']>);
});

const mockData: JsdelivrStats = {
  rank: 1,
  total: 1234567890,
  versions: { '18.2.0': { total: 1000000, dates: { '2024-01-01': 10000 } } },
};

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useNpmPackageCdnStats', () => {
  it('returns data on success with defaults', async () => {
    mockCdnStats.mockResolvedValue(mockData);

    const { result } = renderHook(() => useNpmPackageCdnStats('react'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockData);
    expect(result.current.isError).toBe(false);
    expect(mockCdnStats).toHaveBeenCalledWith('version', 'month', expect.anything());
  });

  it('passes custom groupBy and period', async () => {
    mockCdnStats.mockResolvedValue(mockData);

    const { result } = renderHook(
      () => useNpmPackageCdnStats('react', { groupBy: 'date', period: 'year' }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(mockCdnStats).toHaveBeenCalledWith('date', 'year', expect.anything());
  });

  it('returns error on failure', async () => {
    mockCdnStats.mockRejectedValue(new NpmApiError(404, 'Not Found'));

    const { result } = renderHook(() => useNpmPackageCdnStats('nonexistent-pkg-xyz'), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(NpmApiError);
  });

  it('does not fetch when name is empty', () => {
    const { result } = renderHook(() => useNpmPackageCdnStats(''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockCdnStats).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(() => useNpmPackageCdnStats('react', { enabled: false }), {
      wrapper,
    });

    expect(result.current.isLoading).toBe(false);
    expect(mockCdnStats).not.toHaveBeenCalled();
  });
});
