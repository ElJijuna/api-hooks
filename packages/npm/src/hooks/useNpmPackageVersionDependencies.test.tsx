import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { type DepsDevDependencies, NpmApiError, NpmClient } from 'npmjs-api-client';
import type { ReactNode } from 'react';
import { useNpmPackageVersionDependencies } from './useNpmPackageVersionDependencies.js';

const mockDependencies = jest.fn<() => Promise<DepsDevDependencies>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(NpmClient.prototype, 'package').mockReturnValue({
    version: () => ({ dependencies: mockDependencies }),
  } as ReturnType<NpmClient['package']>);
});

const mockData: DepsDevDependencies = {
  nodes: [
    {
      versionKey: { system: 'npm', name: 'react', version: '18.2.0' },
      bundled: false,
      relation: 'SELF',
      errors: [],
    },
    {
      versionKey: { system: 'npm', name: 'loose-envify', version: '1.4.0' },
      bundled: false,
      relation: 'DIRECT',
      errors: [],
    },
  ],
  edges: [{ fromNode: 0, toNode: 1, requirement: '^1.1.0' }],
};

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useNpmPackageVersionDependencies', () => {
  it('returns data on success', async () => {
    mockDependencies.mockResolvedValue(mockData);

    const { result } = renderHook(() => useNpmPackageVersionDependencies('react', '18.2.0'), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockData);
    expect(result.current.isError).toBe(false);
  });

  it('returns error on failure', async () => {
    mockDependencies.mockRejectedValue(new NpmApiError(404, 'Not Found'));

    const { result } = renderHook(
      () => useNpmPackageVersionDependencies('react', '0.0.0-nonexistent'),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(NpmApiError);
  });

  it('does not fetch when name is empty', () => {
    const { result } = renderHook(() => useNpmPackageVersionDependencies('', '18.2.0'), {
      wrapper,
    });

    expect(result.current.isLoading).toBe(false);
    expect(mockDependencies).not.toHaveBeenCalled();
  });

  it('does not fetch when version is empty', () => {
    const { result } = renderHook(() => useNpmPackageVersionDependencies('react', ''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockDependencies).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useNpmPackageVersionDependencies('react', '18.2.0', { enabled: false }),
      { wrapper },
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockDependencies).not.toHaveBeenCalled();
  });
  it('accepts queryOptions', async () => {
    mockDependencies.mockResolvedValue(mockData);
    const { result } = renderHook(
      () => useNpmPackageVersionDependencies('react', '18.2.0', { queryOptions: { staleTime: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
