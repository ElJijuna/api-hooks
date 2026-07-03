import { beforeEach, describe, expect, it } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { PubApiError } from 'pub-api-client';
import { mockSearch, searchResult, setupPubMocks, wrapper } from '../../testUtils.js';
import { usePubSearch } from './usePubSearch.js';

beforeEach(setupPubMocks);

describe('usePubSearch', () => {
  it('returns search results', async () => {
    mockSearch.mockResolvedValue(searchResult);

    const { result } = renderHook(() => usePubSearch({ query: 'http' }), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(searchResult);
    expect(mockSearch).toHaveBeenCalledWith({ query: 'http' }, expect.anything());
  });

  it('returns API errors', async () => {
    mockSearch.mockRejectedValue(new PubApiError(500, 'Internal Server Error'));

    const { result } = renderHook(() => usePubSearch({ query: 'http' }), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(PubApiError);
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(() => usePubSearch({ query: 'http' }, { enabled: false }), {
      wrapper,
    });

    expect(result.current.isLoading).toBe(false);
    expect(mockSearch).not.toHaveBeenCalled();
  });

  it('accepts queryOptions', async () => {
    mockSearch.mockResolvedValue(searchResult);
    const { result } = renderHook(
      () => usePubSearch({ query: 'http' }, { queryOptions: { staleTime: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
