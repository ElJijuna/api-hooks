import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { NpmApiError, NpmClient, type NpmSearchResult } from 'npmjs-api-client';
import type { ReactNode } from 'react';
import { useNpmSearchInfinite } from './useNpmSearchInfinite.js';

const mockSearch = jest.fn<() => Promise<NpmSearchResult>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(NpmClient.prototype, 'search').mockImplementation(mockSearch);
});

function makeResult(from: number, size: number, total: number): NpmSearchResult {
  return {
    objects: Array.from({ length: Math.min(size, total - from) }, (_, i) => ({
      package: {
        name: `package-${from + i}`,
        scope: 'unscoped',
        version: '1.0.0',
        date: '2024-01-01',
      },
      score: { final: 0.9, detail: { quality: 0.9, popularity: 0.9, maintenance: 0.9 } },
      searchScore: 0.9,
    })),
    total,
    time: '2024-01-01T00:00:00.000Z',
  };
}

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useNpmSearchInfinite', () => {
  it('fetches the first page on mount', async () => {
    mockSearch.mockResolvedValue(makeResult(0, 20, 45));

    const { result } = renderHook(() => useNpmSearchInfinite('react'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data?.pages).toHaveLength(1);
    expect(result.current.data?.pages[0].total).toBe(45);
    expect(mockSearch).toHaveBeenCalledWith({ text: 'react', from: 0 }, expect.anything());
  });

  it('fetches the next page when fetchNextPage is called', async () => {
    mockSearch
      .mockResolvedValueOnce(makeResult(0, 20, 40))
      .mockResolvedValueOnce(makeResult(20, 20, 40));

    const { result } = renderHook(() => useNpmSearchInfinite('react'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    void result.current.fetchNextPage();

    await waitFor(() => expect(result.current.data?.pages).toHaveLength(2));

    expect(mockSearch).toHaveBeenNthCalledWith(2, { text: 'react', from: 20 }, expect.anything());
  });

  it('reports hasNextPage=false when all results are loaded', async () => {
    mockSearch.mockResolvedValue(makeResult(0, 20, 20));

    const { result } = renderHook(() => useNpmSearchInfinite('react'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.hasNextPage).toBe(false);
  });

  it('reports hasNextPage=true when more results remain', async () => {
    mockSearch.mockResolvedValue(makeResult(0, 20, 45));

    const { result } = renderHook(() => useNpmSearchInfinite('react'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.hasNextPage).toBe(true);
  });

  it('passes size option to the client and uses it for pagination', async () => {
    mockSearch.mockResolvedValue(makeResult(0, 5, 12));

    const { result } = renderHook(() => useNpmSearchInfinite('react', { size: 5 }), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(mockSearch).toHaveBeenCalledWith({ text: 'react', size: 5, from: 0 }, expect.anything());
    expect(result.current.hasNextPage).toBe(true);
  });

  it('returns error on failure', async () => {
    mockSearch.mockRejectedValue(new NpmApiError(500, 'Internal Server Error'));

    const { result } = renderHook(() => useNpmSearchInfinite('react'), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeInstanceOf(NpmApiError);
  });

  it('does not fetch when text is empty', () => {
    const { result } = renderHook(() => useNpmSearchInfinite(''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockSearch).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(() => useNpmSearchInfinite('react', { enabled: false }), {
      wrapper,
    });

    expect(result.current.isLoading).toBe(false);
    expect(mockSearch).not.toHaveBeenCalled();
  });
});
