import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NpmClient, NpmApiError, type NpmSearchResult } from 'npmjs-api-client';
import { useNpmMaintainerPackages } from './useNpmMaintainerPackages.js';

const mockPackages = jest.fn<() => Promise<NpmSearchResult>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .spyOn(NpmClient.prototype, 'maintainer')
    .mockReturnValue({
      packages: mockPackages,
    } as ReturnType<NpmClient['maintainer']>);
});

const mockResult: NpmSearchResult = {
  objects: [
    {
      package: {
        name: 'npmjs-api-client',
        scope: 'unscoped',
        version: '1.3.0',
        date: '2024-01-01',
      },
      score: { final: 0.9, detail: { quality: 0.9, popularity: 0.8, maintenance: 0.95 } },
      searchScore: 0.9,
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

describe('useNpmMaintainerPackages', () => {
  it('returns data on success', async () => {
    mockPackages.mockResolvedValue(mockResult);

    const { result } = renderHook(() => useNpmMaintainerPackages('pilmee'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockResult);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('passes pagination params to the client', async () => {
    mockPackages.mockResolvedValue(mockResult);

    const { result } = renderHook(
      () => useNpmMaintainerPackages('pilmee', { size: 25, from: 25 }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(mockPackages).toHaveBeenCalledWith({ size: 25, from: 25 }, expect.anything());
  });

  it('returns error on failure', async () => {
    mockPackages.mockRejectedValue(new NpmApiError(404, 'Not Found'));

    const { result } = renderHook(() => useNpmMaintainerPackages('nonexistent-user-xyz'), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeInstanceOf(NpmApiError);
  });

  it('does not fetch when username is empty', () => {
    const { result } = renderHook(() => useNpmMaintainerPackages(''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockPackages).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useNpmMaintainerPackages('pilmee', { enabled: false }),
      { wrapper }
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockPackages).not.toHaveBeenCalled();
  });
});
