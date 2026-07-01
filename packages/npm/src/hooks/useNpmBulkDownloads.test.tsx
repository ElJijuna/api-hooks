import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { NpmApiError, type NpmBulkDownloads, NpmClient } from 'npmjs-api-client';
import type { ReactNode } from 'react';
import { useNpmBulkDownloads } from './useNpmBulkDownloads.js';

const mockBulkDownloads = jest.fn<() => Promise<NpmBulkDownloads>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .spyOn(NpmClient.prototype, 'bulkDownloads')
    .mockImplementation(mockBulkDownloads as typeof NpmClient.prototype.bulkDownloads);
});

const mockData: NpmBulkDownloads = {
  react: { downloads: 18591460, start: '2024-03-01', end: '2024-03-31', package: 'react' },
  vue: { downloads: 4200000, start: '2024-03-01', end: '2024-03-31', package: 'vue' },
};

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useNpmBulkDownloads', () => {
  it('returns data on success with default period', async () => {
    mockBulkDownloads.mockResolvedValue(mockData);

    const { result } = renderHook(() => useNpmBulkDownloads(['react', 'vue']), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockData);
    expect(result.current.isError).toBe(false);
    expect(mockBulkDownloads).toHaveBeenCalledWith(
      ['react', 'vue'],
      'last-month',
      expect.anything(),
    );
  });

  it('passes custom period', async () => {
    mockBulkDownloads.mockResolvedValue(mockData);

    const { result } = renderHook(
      () => useNpmBulkDownloads(['react', 'vue'], { period: 'last-week' }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(mockBulkDownloads).toHaveBeenCalledWith(
      ['react', 'vue'],
      'last-week',
      expect.anything(),
    );
  });

  it('returns error on failure', async () => {
    mockBulkDownloads.mockRejectedValue(new NpmApiError(400, 'Bad Request'));

    const { result } = renderHook(() => useNpmBulkDownloads(['react']), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(NpmApiError);
  });

  it('does not fetch when packages array is empty', () => {
    const { result } = renderHook(() => useNpmBulkDownloads([]), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockBulkDownloads).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(() => useNpmBulkDownloads(['react'], { enabled: false }), {
      wrapper,
    });

    expect(result.current.isLoading).toBe(false);
    expect(mockBulkDownloads).not.toHaveBeenCalled();
  });
  it('accepts queryOptions', async () => {
    mockBulkDownloads.mockResolvedValue(mockData);
    const { result } = renderHook(
      () => useNpmBulkDownloads(['react', 'vue'], { queryOptions: { staleTime: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
