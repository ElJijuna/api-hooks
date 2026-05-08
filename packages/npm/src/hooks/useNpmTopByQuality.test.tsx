import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NpmClient, NpmApiError, type NpmSearchResult } from 'npmjs-api-client';
import { useNpmTopByQuality } from './useNpmTopByQuality.js';

const mockTopByQuality = jest.fn<() => Promise<NpmSearchResult>>();

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
  jest.spyOn(NpmClient.prototype, 'topByQuality').mockImplementation(mockTopByQuality as typeof NpmClient.prototype.topByQuality);
});

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useNpmTopByQuality', () => {
  it('returns data with the default limit', async () => {
    mockTopByQuality.mockResolvedValue(mockResult);

    const { result } = renderHook(() => useNpmTopByQuality(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockResult);
    expect(mockTopByQuality).toHaveBeenCalledWith(20, expect.anything());
  });

  it('passes a custom limit to the client', async () => {
    mockTopByQuality.mockResolvedValue(mockResult);

    const { result } = renderHook(() => useNpmTopByQuality({ n: 6 }), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(mockTopByQuality).toHaveBeenCalledWith(6, expect.anything());
  });

  it('returns error on failure', async () => {
    mockTopByQuality.mockRejectedValue(new NpmApiError(500, 'Internal Server Error'));

    const { result } = renderHook(() => useNpmTopByQuality(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(NpmApiError);
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(() => useNpmTopByQuality({ enabled: false }), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockTopByQuality).not.toHaveBeenCalled();
  });
});
