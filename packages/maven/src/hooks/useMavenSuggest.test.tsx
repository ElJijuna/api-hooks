import { beforeEach, describe, expect, it } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { MavenApiError } from 'maven-api-client';
import { mockSuggest, searchResult, setupMavenMocks, wrapper } from '../../testUtils.js';
import { useMavenSuggest } from './useMavenSuggest.js';

beforeEach(setupMavenMocks);

describe('useMavenSuggest', () => {
  it('returns suggestions', async () => {
    mockSuggest.mockResolvedValue(searchResult);

    const { result } = renderHook(() => useMavenSuggest({ query: 'spring-cor' }), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(searchResult);
    expect(mockSuggest).toHaveBeenCalledWith({ query: 'spring-cor' }, expect.anything());
  });

  it('returns API errors', async () => {
    mockSuggest.mockRejectedValue(new MavenApiError(500, 'Internal Server Error'));

    const { result } = renderHook(() => useMavenSuggest({ query: 'spring-cor' }), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(MavenApiError);
  });

  it('does not fetch when query is empty', () => {
    const { result } = renderHook(() => useMavenSuggest({ query: '' }), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockSuggest).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useMavenSuggest({ query: 'spring-cor' }, { enabled: false }),
      { wrapper },
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockSuggest).not.toHaveBeenCalled();
  });

  it('accepts queryOptions', async () => {
    mockSuggest.mockResolvedValue(searchResult);
    const { result } = renderHook(
      () => useMavenSuggest({ query: 'spring-cor' }, { queryOptions: { staleTime: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
