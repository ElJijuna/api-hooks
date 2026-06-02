import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { NpmApiError, NpmClient, type NpmSearchResult } from 'npmjs-api-client';
import { useNpmTopByScope } from './useNpmTopByScope.js';

const mockTopByScope = jest.fn<() => Promise<NpmSearchResult>>();

const mockResult: NpmSearchResult = {
  objects: [
    {
      package: { name: '@types/node', scope: 'types', version: '20.0.0' },
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
    .spyOn(NpmClient.prototype, 'topByScope')
    .mockImplementation(mockTopByScope as typeof NpmClient.prototype.topByScope);
});

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useNpmTopByScope', () => {
  it('returns data with the default limit', async () => {
    mockTopByScope.mockResolvedValue(mockResult);

    const { result } = renderHook(() => useNpmTopByScope('@types'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockResult);
    expect(mockTopByScope).toHaveBeenCalledWith('@types', 20, expect.anything());
  });

  it('passes a custom limit to the client', async () => {
    mockTopByScope.mockResolvedValue(mockResult);

    const { result } = renderHook(() => useNpmTopByScope('@types', { n: 9 }), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(mockTopByScope).toHaveBeenCalledWith('@types', 9, expect.anything());
  });

  it('returns error on failure', async () => {
    mockTopByScope.mockRejectedValue(new NpmApiError(500, 'Internal Server Error'));

    const { result } = renderHook(() => useNpmTopByScope('@types'), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(NpmApiError);
  });

  it('does not fetch when scope is empty', () => {
    const { result } = renderHook(() => useNpmTopByScope(''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockTopByScope).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(() => useNpmTopByScope('@types', { enabled: false }), {
      wrapper,
    });

    expect(result.current.isLoading).toBe(false);
    expect(mockTopByScope).not.toHaveBeenCalled();
  });
});
