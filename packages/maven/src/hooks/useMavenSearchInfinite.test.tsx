import { beforeEach, describe, expect, it } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { MavenApiError, type MavenSearchResult } from 'maven-api-client';
import { mockSearch, setupMavenMocks, wrapper } from '../../testUtils.js';
import { useMavenSearchInfinite } from './useMavenSearchInfinite.js';

beforeEach(setupMavenMocks);

function makeResult(start: number, rows: number, numFound: number): MavenSearchResult {
  return {
    responseHeader: { status: 0, QTime: 1 },
    response: {
      numFound,
      start,
      docs: Array.from({ length: Math.min(rows, numFound - start) }, (_, i) => ({
        id: `g:artifact-${start + i}`,
        g: 'g',
        a: `artifact-${start + i}`,
        latestVersion: '1.0.0',
        repositoryId: 'central',
        p: 'jar',
        timestamp: 1_700_000_000_000,
        versionCount: 1,
        ec: ['.jar'],
      })),
    },
  };
}

describe('useMavenSearchInfinite', () => {
  it('fetches the first page on mount', async () => {
    mockSearch.mockResolvedValue(makeResult(0, 20, 45));

    const { result } = renderHook(() => useMavenSearchInfinite({ query: 'spring' }), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data?.pages).toHaveLength(1);
    expect(result.current.data?.pages[0].response.numFound).toBe(45);
    expect(mockSearch).toHaveBeenCalledWith({ query: 'spring', start: 0 }, expect.anything());
  });

  it('fetches the next page when fetchNextPage is called', async () => {
    mockSearch
      .mockResolvedValueOnce(makeResult(0, 20, 40))
      .mockResolvedValueOnce(makeResult(20, 20, 40));

    const { result } = renderHook(() => useMavenSearchInfinite({ query: 'spring' }), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    void result.current.fetchNextPage();

    await waitFor(() => expect(result.current.data?.pages).toHaveLength(2));

    expect(mockSearch).toHaveBeenNthCalledWith(
      2,
      { query: 'spring', start: 20 },
      expect.anything(),
    );
  });

  it('reports hasNextPage=false when all results are loaded', async () => {
    mockSearch.mockResolvedValue(makeResult(0, 20, 20));

    const { result } = renderHook(() => useMavenSearchInfinite({ query: 'spring' }), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.hasNextPage).toBe(false);
  });

  it('reports hasNextPage=true when more results remain', async () => {
    mockSearch.mockResolvedValue(makeResult(0, 20, 45));

    const { result } = renderHook(() => useMavenSearchInfinite({ query: 'spring' }), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.hasNextPage).toBe(true);
  });

  it('passes rows option to the client and uses it for pagination', async () => {
    mockSearch.mockResolvedValue(makeResult(0, 5, 12));

    const { result } = renderHook(() => useMavenSearchInfinite({ query: 'spring', rows: 5 }), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(mockSearch).toHaveBeenCalledWith(
      { query: 'spring', rows: 5, start: 0 },
      expect.anything(),
    );
    expect(result.current.hasNextPage).toBe(true);
  });

  it('returns error on failure', async () => {
    mockSearch.mockRejectedValue(new MavenApiError(500, 'Internal Server Error'));

    const { result } = renderHook(() => useMavenSearchInfinite({ query: 'spring' }), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeInstanceOf(MavenApiError);
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useMavenSearchInfinite({ query: 'spring', enabled: false }),
      { wrapper },
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockSearch).not.toHaveBeenCalled();
  });

  it('accepts queryOptions', async () => {
    mockSearch.mockResolvedValue(makeResult(0, 20, 45));
    const { result } = renderHook(
      () => useMavenSearchInfinite({ query: 'spring', queryOptions: { staleTime: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
