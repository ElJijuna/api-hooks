import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NpmClient, NpmApiError, type NpmSearchResult } from 'npmjs-api-client';
import { useNpmSearch } from './useNpmSearch.js';

const mockSearch = jest.fn<() => Promise<NpmSearchResult>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(NpmClient.prototype, 'search').mockImplementation(mockSearch);
});

const mockResult: NpmSearchResult = {
  objects: [
    {
      package: {
        name: 'react-query',
        scope: 'unscoped',
        version: '3.39.3',
        date: '2022-01-01',
      },
      score: { final: 0.95, detail: { quality: 0.95, popularity: 0.9, maintenance: 0.98 } },
      searchScore: 0.95,
    },
  ],
  total: 1,
  time: '2024-01-01T00:00:00.000Z',
};

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useNpmSearch', () => {
  it('returns data on success', async () => {
    mockSearch.mockResolvedValue(mockResult);

    const { result } = renderHook(() => useNpmSearch('react hooks'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockResult);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
    expect(mockSearch).toHaveBeenCalledWith({ text: 'react hooks' }, expect.anything());
  });

  it('passes search options to the client', async () => {
    mockSearch.mockResolvedValue(mockResult);

    const { result } = renderHook(
      () => useNpmSearch('react', { size: 5, from: 10, quality: 0.8 }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(mockSearch).toHaveBeenCalledWith(
      { text: 'react', size: 5, from: 10, quality: 0.8 },
      expect.anything()
    );
  });

  it('returns error on failure', async () => {
    mockSearch.mockRejectedValue(new NpmApiError(500, 'Internal Server Error'));

    const { result } = renderHook(() => useNpmSearch('react'), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeInstanceOf(NpmApiError);
  });

  it('does not fetch when text is empty', () => {
    const { result } = renderHook(() => useNpmSearch(''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockSearch).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useNpmSearch('react', { enabled: false }),
      { wrapper }
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockSearch).not.toHaveBeenCalled();
  });
});
