import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { NpmApiError, NpmClient, type NpmUserPackages } from 'npmjs-api-client';
import type { ReactNode } from 'react';
import { useNpmUserPackages } from './useNpmUserPackages.js';

const mockPackages = jest.fn<() => Promise<NpmUserPackages>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(NpmClient.prototype, 'user').mockReturnValue({
    packages: mockPackages,
  } as ReturnType<NpmClient['user']>);
});

const mockData: NpmUserPackages = ['lodash', 'react', 'typescript'];

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useNpmUserPackages', () => {
  it('returns data on success', async () => {
    mockPackages.mockResolvedValue(mockData);

    const { result } = renderHook(() => useNpmUserPackages('pilmee'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockData);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('returns error on failure', async () => {
    mockPackages.mockRejectedValue(new NpmApiError(404, 'Not Found'));

    const { result } = renderHook(() => useNpmUserPackages('nonexistent-user-xyz'), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeInstanceOf(NpmApiError);
  });

  it('does not fetch when username is empty', () => {
    const { result } = renderHook(() => useNpmUserPackages(''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockPackages).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useNpmUserPackages('pilmee', undefined, { enabled: false }),
      { wrapper },
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockPackages).not.toHaveBeenCalled();
  });
  it('accepts queryOptions', async () => {
    mockPackages.mockResolvedValue(mockData);
    const { result } = renderHook(
      () => useNpmUserPackages('pilmee', { queryOptions: { staleTime: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
