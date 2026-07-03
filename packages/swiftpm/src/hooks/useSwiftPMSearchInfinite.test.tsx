import { beforeEach, describe, expect, it } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { SwiftPMApiError, type SwiftSearchResult } from 'swiftpm-api-client';
import { mockSearch, searchResult, setupSwiftPMMocks, wrapper } from '../../testUtils.js';
import { useSwiftPMSearchInfinite } from './useSwiftPMSearchInfinite.js';

beforeEach(setupSwiftPMMocks);

function makeResult(hasMore: boolean): SwiftSearchResult {
  return { ...searchResult, hasMoreResults: hasMore };
}

describe('useSwiftPMSearchInfinite', () => {
  it('fetches the first page on mount', async () => {
    mockSearch.mockResolvedValue(makeResult(true));

    const { result } = renderHook(() => useSwiftPMSearchInfinite('vapor'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data?.pages).toHaveLength(1);
    expect(mockSearch).toHaveBeenCalledWith({ query: 'vapor', page: 1 }, expect.anything());
  });

  it('fetches the next page when fetchNextPage is called', async () => {
    mockSearch.mockResolvedValueOnce(makeResult(true)).mockResolvedValueOnce(makeResult(false));

    const { result } = renderHook(() => useSwiftPMSearchInfinite('vapor'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    void result.current.fetchNextPage();

    await waitFor(() => expect(result.current.data?.pages).toHaveLength(2));

    expect(mockSearch).toHaveBeenNthCalledWith(2, { query: 'vapor', page: 2 }, expect.anything());
  });

  it('reports hasNextPage=false when hasMoreResults is false', async () => {
    mockSearch.mockResolvedValue(makeResult(false));

    const { result } = renderHook(() => useSwiftPMSearchInfinite('vapor'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.hasNextPage).toBe(false);
  });

  it('reports hasNextPage=true when hasMoreResults is true', async () => {
    mockSearch.mockResolvedValue(makeResult(true));

    const { result } = renderHook(() => useSwiftPMSearchInfinite('vapor'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.hasNextPage).toBe(true);
  });

  it('returns error on failure', async () => {
    mockSearch.mockRejectedValue(new SwiftPMApiError(500, 'Internal Server Error'));

    const { result } = renderHook(() => useSwiftPMSearchInfinite('vapor'), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeInstanceOf(SwiftPMApiError);
  });

  it('does not fetch when query is empty', () => {
    const { result } = renderHook(() => useSwiftPMSearchInfinite(''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockSearch).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(() => useSwiftPMSearchInfinite('vapor', { enabled: false }), {
      wrapper,
    });

    expect(result.current.isLoading).toBe(false);
    expect(mockSearch).not.toHaveBeenCalled();
  });

  it('accepts queryOptions', async () => {
    mockSearch.mockResolvedValue(makeResult(true));
    const { result } = renderHook(
      () => useSwiftPMSearchInfinite('vapor', { queryOptions: { staleTime: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
