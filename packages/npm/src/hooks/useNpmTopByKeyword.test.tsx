import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { NpmApiError, NpmClient, type NpmSearchResult } from 'npmjs-api-client';
import type { ReactNode } from 'react';
import { useNpmTopByKeyword } from './useNpmTopByKeyword.js';

const mockTopByKeyword = jest.fn<() => Promise<NpmSearchResult>>();

const mockResult: NpmSearchResult = {
  objects: [
    {
      package: { name: 'react', scope: 'unscoped', version: '19.0.0' },
      score: { final: 1, detail: { quality: 1, popularity: 1, maintenance: 1 } },
      searchScore: 1,
    },
  ],
  total: 1,
  time: '2024-01-01T00:00:00.000Z',
};

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .spyOn(NpmClient.prototype, 'topByKeyword')
    .mockImplementation(mockTopByKeyword as typeof NpmClient.prototype.topByKeyword);
});

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useNpmTopByKeyword', () => {
  it('returns data with the default limit', async () => {
    mockTopByKeyword.mockResolvedValue(mockResult);

    const { result } = renderHook(() => useNpmTopByKeyword('react'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockResult);
    expect(mockTopByKeyword).toHaveBeenCalledWith('react', 20, expect.anything());
  });

  it('passes a custom limit to the client', async () => {
    mockTopByKeyword.mockResolvedValue(mockResult);

    const { result } = renderHook(() => useNpmTopByKeyword('react', { n: 8 }), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(mockTopByKeyword).toHaveBeenCalledWith('react', 8, expect.anything());
  });

  it('returns error on failure', async () => {
    mockTopByKeyword.mockRejectedValue(new NpmApiError(500, 'Internal Server Error'));

    const { result } = renderHook(() => useNpmTopByKeyword('react'), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(NpmApiError);
  });

  it('does not fetch when keyword is empty', () => {
    const { result } = renderHook(() => useNpmTopByKeyword(''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockTopByKeyword).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(() => useNpmTopByKeyword('react', { enabled: false }), {
      wrapper,
    });

    expect(result.current.isLoading).toBe(false);
    expect(mockTopByKeyword).not.toHaveBeenCalled();
  });
});
