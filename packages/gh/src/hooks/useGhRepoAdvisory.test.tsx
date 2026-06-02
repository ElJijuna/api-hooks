import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { GitHubApiError, GitHubClient, type GitHubRepositoryAdvisory } from 'gh-api-client';
import { useGhRepoAdvisory } from './useGhRepoAdvisory.js';

const mockRepoAdvisory =
  jest.fn<(ghsaId: string, signal?: AbortSignal) => Promise<GitHubRepositoryAdvisory>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(GitHubClient.prototype, 'repo').mockReturnValue({
    repoAdvisory: mockRepoAdvisory,
  } as unknown as ReturnType<GitHubClient['repo']>);
});

const mockAdvisory = {
  ghsa_id: 'GHSA-1234-5678-9abc',
  summary: 'Test vulnerability',
  severity: 'high',
  state: 'published',
} as unknown as GitHubRepositoryAdvisory;

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhRepoAdvisory', () => {
  it('returns data on success', async () => {
    mockRepoAdvisory.mockResolvedValue(mockAdvisory);

    const { result } = renderHook(() => useGhRepoAdvisory('owner', 'repo', 'GHSA-1234-5678-9abc'), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockAdvisory);
    expect(result.current.isError).toBe(false);
  });

  it('returns error on failure', async () => {
    mockRepoAdvisory.mockRejectedValue(new GitHubApiError(404, 'Not Found'));

    const { result } = renderHook(() => useGhRepoAdvisory('owner', 'repo', 'GHSA-0000-0000-0000'), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when ghsaId is empty', () => {
    const { result } = renderHook(() => useGhRepoAdvisory('owner', 'repo', ''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockRepoAdvisory).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useGhRepoAdvisory('owner', 'repo', 'GHSA-1234-5678-9abc', { enabled: false }),
      { wrapper },
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockRepoAdvisory).not.toHaveBeenCalled();
  });
});
