import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { NpmApiError, NpmClient, type UnpkgFile } from 'npmjs-api-client';
import type { ReactNode } from 'react';
import { useNpmPackageVersionFiles } from './useNpmPackageVersionFiles.js';

const mockFiles = jest.fn<() => Promise<UnpkgFile>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(NpmClient.prototype, 'package').mockReturnValue({
    version: () => ({ files: mockFiles }),
  } as ReturnType<NpmClient['package']>);
});

const mockData: UnpkgFile = {
  path: '/',
  type: 'directory',
  files: [
    { path: '/index.js', type: 'file', size: 1024 },
    { path: '/index.d.ts', type: 'file', size: 512 },
  ],
};

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useNpmPackageVersionFiles', () => {
  it('returns data on success', async () => {
    mockFiles.mockResolvedValue(mockData);

    const { result } = renderHook(() => useNpmPackageVersionFiles('react', '18.2.0'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockData);
    expect(result.current.isError).toBe(false);
  });

  it('returns error on failure', async () => {
    mockFiles.mockRejectedValue(new NpmApiError(404, 'Not Found'));

    const { result } = renderHook(() => useNpmPackageVersionFiles('react', '0.0.0-nonexistent'), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(NpmApiError);
  });

  it('does not fetch when name is empty', () => {
    const { result } = renderHook(() => useNpmPackageVersionFiles('', '18.2.0'), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockFiles).not.toHaveBeenCalled();
  });

  it('does not fetch when version is empty', () => {
    const { result } = renderHook(() => useNpmPackageVersionFiles('react', ''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockFiles).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useNpmPackageVersionFiles('react', '18.2.0', { enabled: false }),
      { wrapper },
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockFiles).not.toHaveBeenCalled();
  });
  it('accepts queryOptions', async () => {
    mockFiles.mockResolvedValue(mockData);
    const { result } = renderHook(
      () => useNpmPackageVersionFiles('react', '18.2.0', { queryOptions: { staleTime: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
