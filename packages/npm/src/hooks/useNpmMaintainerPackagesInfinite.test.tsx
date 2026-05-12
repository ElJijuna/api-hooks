import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NpmClient, NpmApiError, type NpmSearchResult } from 'npmjs-api-client';
import { useNpmMaintainerPackagesInfinite } from './useNpmMaintainerPackagesInfinite.js';

const mockPackages = jest.fn<() => Promise<NpmSearchResult>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .spyOn(NpmClient.prototype, 'maintainer')
    .mockReturnValue({ packages: mockPackages } as ReturnType<NpmClient['maintainer']>);
});

function makeResult(from: number, size: number, total: number): NpmSearchResult {
  return {
    objects: Array.from({ length: Math.min(size, total - from) }, (_, i) => ({
      package: {
        name: `pkg-${from + i}`,
        scope: 'unscoped',
        version: '1.0.0',
        date: '2024-01-01',
      },
      score: { final: 0.9, detail: { quality: 0.9, popularity: 0.9, maintenance: 0.9 } },
      searchScore: 0.9,
    })),
    total,
    time: '2024-01-01T00:00:00.000Z',
  };
}

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useNpmMaintainerPackagesInfinite', () => {
  it('fetches the first page on mount', async () => {
    mockPackages.mockResolvedValue(makeResult(0, 20, 35));

    const { result } = renderHook(
      () => useNpmMaintainerPackagesInfinite('sindresorhus'),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data?.pages).toHaveLength(1);
    expect(result.current.data?.pages[0].total).toBe(35);
    expect(mockPackages).toHaveBeenCalledWith({ from: 0 }, expect.anything());
  });

  it('fetches the next page when fetchNextPage is called', async () => {
    mockPackages
      .mockResolvedValueOnce(makeResult(0, 20, 40))
      .mockResolvedValueOnce(makeResult(20, 20, 40));

    const { result } = renderHook(
      () => useNpmMaintainerPackagesInfinite('sindresorhus'),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    void result.current.fetchNextPage();

    await waitFor(() => expect(result.current.data?.pages).toHaveLength(2));

    expect(mockPackages).toHaveBeenNthCalledWith(2, { from: 20 }, expect.anything());
  });

  it('reports hasNextPage=false when all packages are loaded', async () => {
    mockPackages.mockResolvedValue(makeResult(0, 10, 10));

    const { result } = renderHook(
      () => useNpmMaintainerPackagesInfinite('sindresorhus'),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.hasNextPage).toBe(false);
  });

  it('reports hasNextPage=true when more packages remain', async () => {
    mockPackages.mockResolvedValue(makeResult(0, 20, 35));

    const { result } = renderHook(
      () => useNpmMaintainerPackagesInfinite('sindresorhus'),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.hasNextPage).toBe(true);
  });

  it('returns error on failure', async () => {
    mockPackages.mockRejectedValue(new NpmApiError(404, 'Not Found'));

    const { result } = renderHook(
      () => useNpmMaintainerPackagesInfinite('sindresorhus'),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeInstanceOf(NpmApiError);
  });

  it('does not fetch when username is empty', () => {
    const { result } = renderHook(
      () => useNpmMaintainerPackagesInfinite(''),
      { wrapper }
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockPackages).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useNpmMaintainerPackagesInfinite('sindresorhus', { enabled: false }),
      { wrapper }
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockPackages).not.toHaveBeenCalled();
  });
});
