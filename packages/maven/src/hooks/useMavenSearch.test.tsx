import { beforeEach, describe, expect, it } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { MavenApiError } from 'maven-api-client';
import { mockSearch, searchResult, setupMavenMocks, wrapper } from '../../testUtils.js';
import { useMavenSearch } from './useMavenSearch.js';

beforeEach(setupMavenMocks);

describe('useMavenSearch', () => {
  it('returns search results', async () => {
    mockSearch.mockResolvedValue(searchResult);

    const { result } = renderHook(() => useMavenSearch({ query: 'spring-core' }), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(searchResult);
    expect(mockSearch).toHaveBeenCalledWith({ query: 'spring-core' }, expect.anything());
  });

  it('returns API errors', async () => {
    mockSearch.mockRejectedValue(new MavenApiError(500, 'Internal Server Error'));

    const { result } = renderHook(() => useMavenSearch({ query: 'spring-core' }), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(MavenApiError);
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useMavenSearch({ query: 'spring-core' }, { enabled: false }),
      {
        wrapper,
      },
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockSearch).not.toHaveBeenCalled();
  });

  it('accepts queryOptions', async () => {
    mockSearch.mockResolvedValue(searchResult);
    const { result } = renderHook(
      () => useMavenSearch({ query: 'spring-core' }, { queryOptions: { staleTime: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
