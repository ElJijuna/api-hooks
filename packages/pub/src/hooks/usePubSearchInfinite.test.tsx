import { beforeEach, describe, expect, it } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { PubApiError, type PubSearchResult } from 'pub-api-client';
import { mockSearch, setupPubMocks, wrapper } from '../../testUtils.js';
import { usePubSearchInfinite } from './usePubSearchInfinite.js';

beforeEach(setupPubMocks);

function makeResult(page: number, hasNext: boolean): PubSearchResult {
  return {
    packages: [{ package: `package-${page}` }],
    next: hasNext ? `https://pub.dev/api/search?page=${page + 1}` : undefined,
  };
}

describe('usePubSearchInfinite', () => {
  it('fetches the first page on mount', async () => {
    mockSearch.mockResolvedValue(makeResult(1, true));

    const { result } = renderHook(() => usePubSearchInfinite({ query: 'http' }), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data?.pages).toHaveLength(1);
    expect(mockSearch).toHaveBeenCalledWith({ query: 'http', page: 1 }, expect.anything());
  });

  it('fetches the next page when fetchNextPage is called', async () => {
    mockSearch
      .mockResolvedValueOnce(makeResult(1, true))
      .mockResolvedValueOnce(makeResult(2, false));

    const { result } = renderHook(() => usePubSearchInfinite({ query: 'http' }), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    void result.current.fetchNextPage();

    await waitFor(() => expect(result.current.data?.pages).toHaveLength(2));

    expect(mockSearch).toHaveBeenNthCalledWith(2, { query: 'http', page: 2 }, expect.anything());
  });

  it('reports hasNextPage=false when next is absent', async () => {
    mockSearch.mockResolvedValue(makeResult(1, false));

    const { result } = renderHook(() => usePubSearchInfinite({ query: 'http' }), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.hasNextPage).toBe(false);
  });

  it('reports hasNextPage=true when next is present', async () => {
    mockSearch.mockResolvedValue(makeResult(1, true));

    const { result } = renderHook(() => usePubSearchInfinite({ query: 'http' }), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.hasNextPage).toBe(true);
  });

  it('returns error on failure', async () => {
    mockSearch.mockRejectedValue(new PubApiError(500, 'Internal Server Error'));

    const { result } = renderHook(() => usePubSearchInfinite({ query: 'http' }), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeInstanceOf(PubApiError);
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(() => usePubSearchInfinite({ query: 'http', enabled: false }), {
      wrapper,
    });

    expect(result.current.isLoading).toBe(false);
    expect(mockSearch).not.toHaveBeenCalled();
  });

  it('accepts queryOptions', async () => {
    mockSearch.mockResolvedValue(makeResult(1, true));
    const { result } = renderHook(
      () => usePubSearchInfinite({ query: 'http', queryOptions: { staleTime: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
