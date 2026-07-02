import { beforeEach, describe, expect, it } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { NuGetApiError } from 'nuget-api-client';
import { mockSearch, searchResult, setupNuGetMocks, wrapper } from '../../testUtils.js';
import { useNuGetSearch } from './useNuGetSearch.js';

beforeEach(setupNuGetMocks);

describe('useNuGetSearch', () => {
  it('returns search results', async () => {
    mockSearch.mockResolvedValue(searchResult);

    const { result } = renderHook(() => useNuGetSearch({ query: 'json' }), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(searchResult);
    expect(mockSearch).toHaveBeenCalledWith({ query: 'json' }, expect.anything());
  });

  it('returns API errors', async () => {
    mockSearch.mockRejectedValue(new NuGetApiError(500, 'Internal Server Error'));

    const { result } = renderHook(() => useNuGetSearch({ query: 'json' }), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(NuGetApiError);
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(() => useNuGetSearch({ query: 'json' }, { enabled: false }), {
      wrapper,
    });

    expect(result.current.isLoading).toBe(false);
    expect(mockSearch).not.toHaveBeenCalled();
  });

  it('accepts queryOptions', async () => {
    mockSearch.mockResolvedValue(searchResult);
    const { result } = renderHook(
      () => useNuGetSearch({ query: 'json' }, { queryOptions: { staleTime: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
