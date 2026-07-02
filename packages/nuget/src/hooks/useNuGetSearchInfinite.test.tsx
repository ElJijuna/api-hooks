import { beforeEach, describe, expect, it } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { NuGetApiError, type NuGetSearchResult } from 'nuget-api-client';
import { mockSearch, setupNuGetMocks, wrapper } from '../../testUtils.js';
import { useNuGetSearchInfinite } from './useNuGetSearchInfinite.js';

beforeEach(setupNuGetMocks);

function makeResult(skip: number, take: number, totalHits: number): NuGetSearchResult {
  return {
    totalHits,
    data: Array.from({ length: Math.min(take, totalHits - skip) }, (_, i) => ({
      id: `Package.${skip + i}`,
      version: '1.0.0',
      description: 'A test package',
      authors: ['author'],
      versions: [{ version: '1.0.0', downloads: 100, '@id': 'https://example.com' }],
    })),
  };
}

describe('useNuGetSearchInfinite', () => {
  it('fetches the first page on mount', async () => {
    mockSearch.mockResolvedValue(makeResult(0, 20, 45));

    const { result } = renderHook(() => useNuGetSearchInfinite({ query: 'json' }), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data?.pages).toHaveLength(1);
    expect(result.current.data?.pages[0].totalHits).toBe(45);
    expect(mockSearch).toHaveBeenCalledWith({ query: 'json', skip: 0 }, expect.anything());
  });

  it('fetches the next page when fetchNextPage is called', async () => {
    mockSearch
      .mockResolvedValueOnce(makeResult(0, 20, 40))
      .mockResolvedValueOnce(makeResult(20, 20, 40));

    const { result } = renderHook(() => useNuGetSearchInfinite({ query: 'json' }), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    void result.current.fetchNextPage();

    await waitFor(() => expect(result.current.data?.pages).toHaveLength(2));

    expect(mockSearch).toHaveBeenNthCalledWith(2, { query: 'json', skip: 20 }, expect.anything());
  });

  it('reports hasNextPage=false when all results are loaded', async () => {
    mockSearch.mockResolvedValue(makeResult(0, 20, 20));

    const { result } = renderHook(() => useNuGetSearchInfinite({ query: 'json' }), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.hasNextPage).toBe(false);
  });

  it('reports hasNextPage=true when more results remain', async () => {
    mockSearch.mockResolvedValue(makeResult(0, 20, 45));

    const { result } = renderHook(() => useNuGetSearchInfinite({ query: 'json' }), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.hasNextPage).toBe(true);
  });

  it('passes take option to the client and uses it for pagination', async () => {
    mockSearch.mockResolvedValue(makeResult(0, 5, 12));

    const { result } = renderHook(() => useNuGetSearchInfinite({ query: 'json', take: 5 }), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(mockSearch).toHaveBeenCalledWith({ query: 'json', take: 5, skip: 0 }, expect.anything());
    expect(result.current.hasNextPage).toBe(true);
  });

  it('returns error on failure', async () => {
    mockSearch.mockRejectedValue(new NuGetApiError(500, 'Internal Server Error'));

    const { result } = renderHook(() => useNuGetSearchInfinite({ query: 'json' }), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeInstanceOf(NuGetApiError);
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(() => useNuGetSearchInfinite({ query: 'json', enabled: false }), {
      wrapper,
    });

    expect(result.current.isLoading).toBe(false);
    expect(mockSearch).not.toHaveBeenCalled();
  });

  it('accepts queryOptions', async () => {
    mockSearch.mockResolvedValue(makeResult(0, 20, 45));
    const { result } = renderHook(
      () => useNuGetSearchInfinite({ query: 'json', queryOptions: { staleTime: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
