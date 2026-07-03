import { beforeEach, describe, expect, it } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { SwiftPMApiError } from 'swiftpm-api-client';
import { mockSearch, searchResult, setupSwiftPMMocks, wrapper } from '../../testUtils.js';
import { useSwiftPMSearch } from './useSwiftPMSearch.js';

beforeEach(setupSwiftPMMocks);

describe('useSwiftPMSearch', () => {
  it('returns search results', async () => {
    mockSearch.mockResolvedValue(searchResult);

    const { result } = renderHook(() => useSwiftPMSearch({ query: 'vapor' }), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(searchResult);
    expect(mockSearch).toHaveBeenCalledWith({ query: 'vapor' }, expect.anything());
  });

  it('returns API errors', async () => {
    mockSearch.mockRejectedValue(new SwiftPMApiError(500, 'Internal Server Error'));

    const { result } = renderHook(() => useSwiftPMSearch({ query: 'vapor' }), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(SwiftPMApiError);
  });

  it('does not fetch when query is empty', () => {
    const { result } = renderHook(() => useSwiftPMSearch({ query: '' }), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockSearch).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(() => useSwiftPMSearch({ query: 'vapor' }, { enabled: false }), {
      wrapper,
    });

    expect(result.current.isLoading).toBe(false);
    expect(mockSearch).not.toHaveBeenCalled();
  });

  it('accepts queryOptions', async () => {
    mockSearch.mockResolvedValue(searchResult);
    const { result } = renderHook(
      () => useSwiftPMSearch({ query: 'vapor' }, { queryOptions: { staleTime: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
