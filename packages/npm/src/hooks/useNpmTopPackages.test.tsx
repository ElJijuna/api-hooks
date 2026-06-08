import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { NpmApiError, NpmClient, type NpmSearchResult } from 'npmjs-api-client';
import type { ReactNode } from 'react';
import { useNpmTopPackages } from './useNpmTopPackages.js';

const mockResult: NpmSearchResult = {
  objects: [
    {
      package: {
        name: 'react',
        scope: 'unscoped',
        version: '19.0.0',
      },
      score: { final: 1, detail: { quality: 1, popularity: 1, maintenance: 1 } },
      searchScore: 1,
    },
  ],
  total: 1,
  time: '2024-01-01T00:00:00.000Z',
};

const mockTopPackages = jest.fn<() => Promise<NpmSearchResult>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .spyOn(NpmClient.prototype, 'topPackages')
    .mockImplementation(mockTopPackages as typeof NpmClient.prototype.topPackages);
});

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useNpmTopPackages', () => {
  it('useNpmTopPackages returns data with the default limit', async () => {
    mockTopPackages.mockResolvedValue(mockResult);

    const { result } = renderHook(() => useNpmTopPackages(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockResult);
    expect(result.current.isError).toBe(false);
    expect(mockTopPackages).toHaveBeenCalledWith(20, expect.anything());
  });

  it('passes a custom limit to the client', async () => {
    mockTopPackages.mockResolvedValue(mockResult);

    const { result } = renderHook(() => useNpmTopPackages({ n: 5 }), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(mockTopPackages).toHaveBeenCalledWith(5, expect.anything());
  });

  it('returns error on failure', async () => {
    mockTopPackages.mockRejectedValue(new NpmApiError(500, 'Internal Server Error'));

    const { result } = renderHook(() => useNpmTopPackages(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeInstanceOf(NpmApiError);
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(() => useNpmTopPackages({ enabled: false }), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockTopPackages).not.toHaveBeenCalled();
  });
});
