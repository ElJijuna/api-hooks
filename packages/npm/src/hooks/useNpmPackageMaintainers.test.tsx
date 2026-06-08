import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { NpmApiError, NpmClient, type NpmPerson } from 'npmjs-api-client';
import type { ReactNode } from 'react';
import { useNpmPackageMaintainers } from './useNpmPackageMaintainers.js';

const mockMaintainers = jest.fn<() => Promise<NpmPerson[]>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(NpmClient.prototype, 'package').mockReturnValue({
    maintainers: mockMaintainers,
  } as ReturnType<NpmClient['package']>);
});

const mockData: NpmPerson[] = [
  { name: 'gaearon', email: 'dan@example.com' },
  { name: 'acdlite', email: 'acd@example.com' },
];

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useNpmPackageMaintainers', () => {
  it('returns data on success', async () => {
    mockMaintainers.mockResolvedValue(mockData);

    const { result } = renderHook(() => useNpmPackageMaintainers('react'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockData);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('returns error on failure', async () => {
    mockMaintainers.mockRejectedValue(new NpmApiError(404, 'Not Found'));

    const { result } = renderHook(() => useNpmPackageMaintainers('nonexistent-pkg-xyz'), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeInstanceOf(NpmApiError);
  });

  it('does not fetch when name is empty', () => {
    const { result } = renderHook(() => useNpmPackageMaintainers(''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockMaintainers).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(() => useNpmPackageMaintainers('react', { enabled: false }), {
      wrapper,
    });

    expect(result.current.isLoading).toBe(false);
    expect(mockMaintainers).not.toHaveBeenCalled();
  });
});
