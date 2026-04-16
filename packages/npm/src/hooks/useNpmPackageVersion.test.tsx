import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NpmClient, NpmApiError, type NpmPackageVersion } from 'npmjs-api-client';
import { useNpmPackageVersion } from './useNpmPackageVersion.js';

const mockGet = jest.fn<() => Promise<NpmPackageVersion>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .spyOn(NpmClient.prototype, 'package')
    .mockReturnValue({
      version: () => ({ get: mockGet }),
    } as ReturnType<NpmClient['package']>);
});

const mockVersion: NpmPackageVersion = {
  name: 'react',
  version: '18.2.0',
  dist: { tarball: 'https://registry.npmjs.org/react/-/react-18.2.0.tgz', shasum: 'abc123' },
};

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useNpmPackageVersion', () => {
  it('returns data on success', async () => {
    mockGet.mockResolvedValue(mockVersion);

    const { result } = renderHook(() => useNpmPackageVersion('react', '18.2.0'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockVersion);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('returns error on failure', async () => {
    mockGet.mockRejectedValue(new NpmApiError(404, 'Not Found'));

    const { result } = renderHook(
      () => useNpmPackageVersion('react', '0.0.0-nonexistent'),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeInstanceOf(NpmApiError);
  });

  it('does not fetch when name is empty', () => {
    const { result } = renderHook(() => useNpmPackageVersion('', '18.2.0'), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockGet).not.toHaveBeenCalled();
  });

  it('does not fetch when version is empty', () => {
    const { result } = renderHook(() => useNpmPackageVersion('react', ''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockGet).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useNpmPackageVersion('react', '18.2.0', { enabled: false }),
      { wrapper }
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockGet).not.toHaveBeenCalled();
  });
});
