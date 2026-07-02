import { beforeEach, describe, expect, it } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { PackagistApiError } from 'php-packagist-api-client';
import { mockSearch, searchResponse, setupPackagistMocks, wrapper } from '../../testUtils.js';
import { usePackagistSearch } from './usePackagistSearch.js';

beforeEach(setupPackagistMocks);

describe('usePackagistSearch', () => {
  it('returns search results', async () => {
    mockSearch.mockResolvedValue(searchResponse);

    const params = { query: 'monolog', perPage: 5 };
    const { result } = renderHook(() => usePackagistSearch(params), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(searchResponse);
    expect(mockSearch).toHaveBeenCalledWith(params, expect.anything());
  });

  it('returns API errors', async () => {
    mockSearch.mockRejectedValue(new PackagistApiError(500, 'Server Error'));

    const { result } = renderHook(() => usePackagistSearch({ query: 'monolog' }), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeInstanceOf(PackagistApiError);
  });

  it('does not fetch when no filter params are set', () => {
    const { result } = renderHook(() => usePackagistSearch({}), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockSearch).not.toHaveBeenCalled();
  });

  it('does not fetch when disabled', () => {
    const { result } = renderHook(
      () => usePackagistSearch({ query: 'monolog' }, { enabled: false }),
      { wrapper },
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockSearch).not.toHaveBeenCalled();
  });

  it('accepts queryOptions', async () => {
    mockSearch.mockResolvedValue(searchResponse);
    const { result } = renderHook(
      () => usePackagistSearch({ query: 'monolog' }, { queryOptions: { staleTime: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
