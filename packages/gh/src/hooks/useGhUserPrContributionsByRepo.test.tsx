import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GitHubClient, GitHubApiError, type RepoContribution } from 'gh-api-client';
import { useGhUserPrContributionsByRepo } from './useGhUserPrContributionsByRepo.js';

const mockPullRequestContributionsByRepo = jest.fn<(signal?: AbortSignal) => Promise<RepoContribution[]>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .spyOn(GitHubClient.prototype, 'user')
    .mockReturnValue({
      pullRequestContributionsByRepo: mockPullRequestContributionsByRepo,
    } as unknown as ReturnType<GitHubClient['user']>);
});

const mockContributions: RepoContribution[] = [{ repository: { nameWithOwner: 'owner/repo', url: 'https://github.com/owner/repo' }, totalCount: 10 }];

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhUserPrContributionsByRepo', () => {
  it('returns data on success', async () => {
    mockPullRequestContributionsByRepo.mockResolvedValue(mockContributions);
    const { result } = renderHook(() => useGhUserPrContributionsByRepo('octocat'), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual(mockContributions);
  });

  it('returns error on failure', async () => {
    mockPullRequestContributionsByRepo.mockRejectedValue(new GitHubApiError(401, 'Unauthorized'));
    const { result } = renderHook(() => useGhUserPrContributionsByRepo('octocat'), { wrapper });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when login is empty', () => {
    const { result } = renderHook(() => useGhUserPrContributionsByRepo(''), { wrapper });
    expect(result.current.isLoading).toBe(false);
    expect(mockPullRequestContributionsByRepo).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(() => useGhUserPrContributionsByRepo('octocat', { enabled: false }), { wrapper });
    expect(result.current.isLoading).toBe(false);
    expect(mockPullRequestContributionsByRepo).not.toHaveBeenCalled();
  });
});
