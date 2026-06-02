import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { NpmApiError, NpmClient, type PackagephobiaSize } from 'npmjs-api-client';
import { useNpmPackageSize } from './useNpmPackageSize.js';

const mockSize = jest.fn<() => Promise<PackagephobiaSize>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(NpmClient.prototype, 'package').mockReturnValue({
    size: mockSize,
  } as ReturnType<NpmClient['package']>);
});

const mockData: PackagephobiaSize = {
  publish: { bytes: 10240, files: 5, pretty: '10 kB', color: 'green' },
  install: { bytes: 307200, files: 120, pretty: '300 kB', color: 'green' },
};

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useNpmPackageSize', () => {
  it('returns data on success', async () => {
    mockSize.mockResolvedValue(mockData);

    const { result } = renderHook(() => useNpmPackageSize('react'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockData);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('returns error on failure', async () => {
    mockSize.mockRejectedValue(new NpmApiError(404, 'Not Found'));

    const { result } = renderHook(() => useNpmPackageSize('nonexistent-pkg-xyz'), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeInstanceOf(NpmApiError);
  });

  it('does not fetch when name is empty', () => {
    const { result } = renderHook(() => useNpmPackageSize(''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockSize).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(() => useNpmPackageSize('react', { enabled: false }), {
      wrapper,
    });

    expect(result.current.isLoading).toBe(false);
    expect(mockSize).not.toHaveBeenCalled();
  });
});
