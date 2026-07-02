import { beforeEach, describe, expect, it } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { CratesApiError } from 'crates-api-client';
import { mockSearch, searchResult, setupCratesMocks, wrapper } from '../../testUtils.js';
import { useCratesSearch } from './useCratesSearch.js';

beforeEach(setupCratesMocks);

describe('useCratesSearch', () => {
  it('returns search results', async () => {
    mockSearch.mockResolvedValue(searchResult);

    const { result } = renderHook(() => useCratesSearch({ query: 'serde' }), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(searchResult);
    expect(mockSearch).toHaveBeenCalledWith({ query: 'serde' }, expect.anything());
  });

  it('returns API errors', async () => {
    mockSearch.mockRejectedValue(new CratesApiError(500, 'Internal Server Error'));

    const { result } = renderHook(() => useCratesSearch({ query: 'serde' }), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(CratesApiError);
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(() => useCratesSearch({ query: 'serde' }, { enabled: false }), {
      wrapper,
    });

    expect(result.current.isLoading).toBe(false);
    expect(mockSearch).not.toHaveBeenCalled();
  });

  it('accepts queryOptions', async () => {
    mockSearch.mockResolvedValue(searchResult);
    const { result } = renderHook(
      () => useCratesSearch({ query: 'serde' }, { queryOptions: { staleTime: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
