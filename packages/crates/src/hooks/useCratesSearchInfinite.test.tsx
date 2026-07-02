import { beforeEach, describe, expect, it } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { CratesApiError, type CratesSearchResult } from 'crates-api-client';
import { crateSummary, mockSearch, setupCratesMocks, wrapper } from '../../testUtils.js';
import { useCratesSearchInfinite } from './useCratesSearchInfinite.js';

beforeEach(setupCratesMocks);

function makeResult(page: number, perPage: number, total: number): CratesSearchResult {
  const start = (page - 1) * perPage;
  return {
    crates: Array.from({ length: Math.min(perPage, total - start) }, (_, i) => ({
      ...crateSummary,
      id: `crate-${start + i}`,
      name: `crate-${start + i}`,
    })),
    meta: { total },
  };
}

describe('useCratesSearchInfinite', () => {
  it('fetches the first page on mount', async () => {
    mockSearch.mockResolvedValue(makeResult(1, 10, 25));

    const { result } = renderHook(() => useCratesSearchInfinite({ query: 'serde' }), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data?.pages).toHaveLength(1);
    expect(result.current.data?.pages[0].meta.total).toBe(25);
    expect(mockSearch).toHaveBeenCalledWith({ query: 'serde', page: 1 }, expect.anything());
  });

  it('fetches the next page when fetchNextPage is called', async () => {
    mockSearch
      .mockResolvedValueOnce(makeResult(1, 10, 20))
      .mockResolvedValueOnce(makeResult(2, 10, 20));

    const { result } = renderHook(() => useCratesSearchInfinite({ query: 'serde' }), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    void result.current.fetchNextPage();

    await waitFor(() => expect(result.current.data?.pages).toHaveLength(2));

    expect(mockSearch).toHaveBeenNthCalledWith(2, { query: 'serde', page: 2 }, expect.anything());
  });

  it('reports hasNextPage=false when all results are loaded', async () => {
    mockSearch.mockResolvedValue(makeResult(1, 10, 10));

    const { result } = renderHook(() => useCratesSearchInfinite({ query: 'serde' }), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.hasNextPage).toBe(false);
  });

  it('reports hasNextPage=true when more results remain', async () => {
    mockSearch.mockResolvedValue(makeResult(1, 10, 25));

    const { result } = renderHook(() => useCratesSearchInfinite({ query: 'serde' }), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.hasNextPage).toBe(true);
  });

  it('passes perPage option to the client and uses it for pagination', async () => {
    mockSearch.mockResolvedValue(makeResult(1, 5, 12));

    const { result } = renderHook(() => useCratesSearchInfinite({ query: 'serde', perPage: 5 }), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(mockSearch).toHaveBeenCalledWith(
      { query: 'serde', perPage: 5, page: 1 },
      expect.anything(),
    );
    expect(result.current.hasNextPage).toBe(true);
  });

  it('returns error on failure', async () => {
    mockSearch.mockRejectedValue(new CratesApiError(500, 'Internal Server Error'));

    const { result } = renderHook(() => useCratesSearchInfinite({ query: 'serde' }), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeInstanceOf(CratesApiError);
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useCratesSearchInfinite({ query: 'serde', enabled: false }),
      { wrapper },
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockSearch).not.toHaveBeenCalled();
  });

  it('accepts queryOptions', async () => {
    mockSearch.mockResolvedValue(makeResult(1, 10, 25));
    const { result } = renderHook(
      () => useCratesSearchInfinite({ query: 'serde', queryOptions: { staleTime: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
