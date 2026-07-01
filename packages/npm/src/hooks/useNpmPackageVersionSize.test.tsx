import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { NpmApiError, NpmClient, type PackagephobiaSize } from 'npmjs-api-client';
import type { ReactNode } from 'react';
import { useNpmPackageVersionSize } from './useNpmPackageVersionSize.js';

const mockSize = jest.fn<() => Promise<PackagephobiaSize>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(NpmClient.prototype, 'package').mockReturnValue({
    version: () => ({ size: mockSize }),
  } as ReturnType<NpmClient['package']>);
});

const mockData: PackagephobiaSize = {
  publish: { bytes: 10240, files: 5, pretty: '10 kB', color: 'green' },
  install: { bytes: 307200, files: 120, pretty: '300 kB', color: 'green' },
};

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useNpmPackageVersionSize', () => {
  it('returns data on success', async () => {
    mockSize.mockResolvedValue(mockData);

    const { result } = renderHook(() => useNpmPackageVersionSize('react', '18.2.0'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockData);
    expect(result.current.isError).toBe(false);
  });

  it('returns error on failure', async () => {
    mockSize.mockRejectedValue(new NpmApiError(404, 'Not Found'));

    const { result } = renderHook(() => useNpmPackageVersionSize('react', '0.0.0-nonexistent'), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(NpmApiError);
  });

  it('does not fetch when name is empty', () => {
    const { result } = renderHook(() => useNpmPackageVersionSize('', '18.2.0'), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockSize).not.toHaveBeenCalled();
  });

  it('does not fetch when version is empty', () => {
    const { result } = renderHook(() => useNpmPackageVersionSize('react', ''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockSize).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useNpmPackageVersionSize('react', '18.2.0', { enabled: false }),
      { wrapper },
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockSize).not.toHaveBeenCalled();
  });
  it('accepts queryOptions', async () => {
    mockSize.mockResolvedValue(mockData);
    const { result } = renderHook(
      () => useNpmPackageVersionSize('react', '18.2.0', { queryOptions: { staleTime: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
