import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NpmClient, NpmApiError, type NpmDistTags } from 'npmjs-api-client';
import { useNpmPackageDistTags } from './useNpmPackageDistTags.js';

const mockDistTags = jest.fn<() => Promise<NpmDistTags>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .spyOn(NpmClient.prototype, 'package')
    .mockReturnValue({
      distTags: mockDistTags,
    } as ReturnType<NpmClient['package']>);
});

const mockData: NpmDistTags = {
  latest: '18.2.0',
  next: '19.0.0-beta.1',
};

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useNpmPackageDistTags', () => {
  it('returns data on success', async () => {
    mockDistTags.mockResolvedValue(mockData);

    const { result } = renderHook(() => useNpmPackageDistTags('react'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockData);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('returns error on failure', async () => {
    mockDistTags.mockRejectedValue(new NpmApiError(404, 'Not Found'));

    const { result } = renderHook(() => useNpmPackageDistTags('nonexistent-pkg-xyz'), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeInstanceOf(NpmApiError);
  });

  it('does not fetch when name is empty', () => {
    const { result } = renderHook(() => useNpmPackageDistTags(''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockDistTags).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useNpmPackageDistTags('react', { enabled: false }),
      { wrapper }
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockDistTags).not.toHaveBeenCalled();
  });
});
