import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NpmClient, NpmApiError, type NpmPackageVersion } from 'npmjs-api-client';
import { useNpmPackageVersions } from './useNpmPackageVersions.js';

const mockVersions = jest.fn<() => Promise<NpmPackageVersion[]>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .spyOn(NpmClient.prototype, 'package')
    .mockReturnValue({
      versions: mockVersions,
    } as ReturnType<NpmClient['package']>);
});

const mockData: NpmPackageVersion[] = [
  {
    name: 'react',
    version: '18.1.0',
    dist: { tarball: 'https://registry.npmjs.org/react/-/react-18.1.0.tgz', shasum: 'abc' },
  },
  {
    name: 'react',
    version: '18.2.0',
    dist: { tarball: 'https://registry.npmjs.org/react/-/react-18.2.0.tgz', shasum: 'def' },
  },
];

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useNpmPackageVersions', () => {
  it('returns data on success', async () => {
    mockVersions.mockResolvedValue(mockData);

    const { result } = renderHook(() => useNpmPackageVersions('react'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockData);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('returns error on failure', async () => {
    mockVersions.mockRejectedValue(new NpmApiError(404, 'Not Found'));

    const { result } = renderHook(() => useNpmPackageVersions('nonexistent-pkg-xyz'), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeInstanceOf(NpmApiError);
  });

  it('does not fetch when name is empty', () => {
    const { result } = renderHook(() => useNpmPackageVersions(''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockVersions).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useNpmPackageVersions('react', { enabled: false }),
      { wrapper }
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockVersions).not.toHaveBeenCalled();
  });
});
