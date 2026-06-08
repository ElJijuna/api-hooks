import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { GitHubApiError, GitHubClient, type RepoContribution } from 'gh-api-client';
import type { ReactNode } from 'react';
import { useGhUserCommitContributionsByRepo } from './useGhUserCommitContributionsByRepo.js';

const mockCommitContributionsByRepo =
  jest.fn<(signal?: AbortSignal) => Promise<RepoContribution[]>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(GitHubClient.prototype, 'user').mockReturnValue({
    commitContributionsByRepo: mockCommitContributionsByRepo,
  } as unknown as ReturnType<GitHubClient['user']>);
});

const mockContributions: RepoContribution[] = [
  {
    repository: { nameWithOwner: 'owner/repo', url: 'https://github.com/owner/repo' },
    totalCount: 42,
  },
];

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhUserCommitContributionsByRepo', () => {
  it('returns data on success', async () => {
    mockCommitContributionsByRepo.mockResolvedValue(mockContributions);
    const { result } = renderHook(() => useGhUserCommitContributionsByRepo('octocat'), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual(mockContributions);
    expect(result.current.isError).toBe(false);
  });

  it('returns error on failure', async () => {
    mockCommitContributionsByRepo.mockRejectedValue(new GitHubApiError(401, 'Unauthorized'));
    const { result } = renderHook(() => useGhUserCommitContributionsByRepo('octocat'), { wrapper });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when login is empty', () => {
    const { result } = renderHook(() => useGhUserCommitContributionsByRepo(''), { wrapper });
    expect(result.current.isLoading).toBe(false);
    expect(mockCommitContributionsByRepo).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useGhUserCommitContributionsByRepo('octocat', { enabled: false }),
      { wrapper },
    );
    expect(result.current.isLoading).toBe(false);
    expect(mockCommitContributionsByRepo).not.toHaveBeenCalled();
  });
});
