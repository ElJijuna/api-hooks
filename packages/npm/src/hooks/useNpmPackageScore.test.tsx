import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NpmClient, NpmApiError, type NpmsScore } from 'npmjs-api-client';
import { useNpmPackageScore } from './useNpmPackageScore.js';

const mockScore = jest.fn<() => Promise<NpmsScore>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .spyOn(NpmClient.prototype, 'package')
    .mockReturnValue({
      score: mockScore,
    } as ReturnType<NpmClient['package']>);
});

const mockData: NpmsScore = {
  analyzedAt: '2024-01-01T00:00:00.000Z',
  score: {
    final: 0.97,
    detail: { quality: 0.99, popularity: 0.95, maintenance: 0.98 },
  },
  evaluation: {
    quality: { carefulness: 0.9, tests: 0.8, health: 1, branding: 0.7 },
    popularity: { communityInterest: 100, downloadsCount: 1e7, downloadsAcceleration: 1000, dependentsCount: 5000 },
    maintenance: { releasesFrequency: 0.9, commitsFrequency: 0.8, openIssues: 0.7, issuesDistribution: 0.8 },
  },
};

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useNpmPackageScore', () => {
  it('returns data on success', async () => {
    mockScore.mockResolvedValue(mockData);

    const { result } = renderHook(() => useNpmPackageScore('react'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockData);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('returns error on failure', async () => {
    mockScore.mockRejectedValue(new NpmApiError(404, 'Not Found'));

    const { result } = renderHook(() => useNpmPackageScore('nonexistent-pkg-xyz'), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeInstanceOf(NpmApiError);
  });

  it('does not fetch when name is empty', () => {
    const { result } = renderHook(() => useNpmPackageScore(''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockScore).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(() => useNpmPackageScore('react', { enabled: false }), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockScore).not.toHaveBeenCalled();
  });
});
