import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { NpmApiError, NpmClient, type NpmSearchResult } from 'npmjs-api-client';
import type { ReactNode } from 'react';
import { useNpmTopByMaintenance } from './useNpmTopByMaintenance.js';

const mockTopByMaintenance = jest.fn<() => Promise<NpmSearchResult>>();

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
    .spyOn(NpmClient.prototype, 'topByMaintenance')
    .mockImplementation(mockTopByMaintenance as typeof NpmClient.prototype.topByMaintenance);
});

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useNpmTopByMaintenance', () => {
  it('returns data with the default limit', async () => {
    mockTopByMaintenance.mockResolvedValue(mockResult);

    const { result } = renderHook(() => useNpmTopByMaintenance(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockResult);
    expect(mockTopByMaintenance).toHaveBeenCalledWith(20, expect.anything());
  });

  it('passes a custom limit to the client', async () => {
    mockTopByMaintenance.mockResolvedValue(mockResult);

    const { result } = renderHook(() => useNpmTopByMaintenance({ n: 7 }), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(mockTopByMaintenance).toHaveBeenCalledWith(7, expect.anything());
  });

  it('returns error on failure', async () => {
    mockTopByMaintenance.mockRejectedValue(new NpmApiError(500, 'Internal Server Error'));

    const { result } = renderHook(() => useNpmTopByMaintenance(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(NpmApiError);
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(() => useNpmTopByMaintenance({ enabled: false }), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockTopByMaintenance).not.toHaveBeenCalled();
  });

  it('accepts queryOptions', async () => {
    mockTopByMaintenance.mockResolvedValue(mockResult);
    const { result } = renderHook(
      () => useNpmTopByMaintenance({ queryOptions: { staleTime: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
