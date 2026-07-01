import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { GitHubApiError, GitHubClient, type RepoContribution } from 'gh-api-client';
import type { ReactNode } from 'react';
import { useGhUserIssueContributionsByRepo } from './useGhUserIssueContributionsByRepo.js';

const mockIssueContributionsByRepo =
  jest.fn<(signal?: AbortSignal) => Promise<RepoContribution[]>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(GitHubClient.prototype, 'user').mockReturnValue({
    issueContributionsByRepo: mockIssueContributionsByRepo,
  } as unknown as ReturnType<GitHubClient['user']>);
});

const mockContributions: RepoContribution[] = [
  {
    repository: { nameWithOwner: 'owner/repo', url: 'https://github.com/owner/repo' },
    totalCount: 5,
  },
];

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhUserIssueContributionsByRepo', () => {
  it('returns data on success', async () => {
    mockIssueContributionsByRepo.mockResolvedValue(mockContributions);
    const { result } = renderHook(() => useGhUserIssueContributionsByRepo('octocat'), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual(mockContributions);
  });

  it('returns error on failure', async () => {
    mockIssueContributionsByRepo.mockRejectedValue(new GitHubApiError(401, 'Unauthorized'));
    const { result } = renderHook(() => useGhUserIssueContributionsByRepo('octocat'), { wrapper });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when login is empty', () => {
    const { result } = renderHook(() => useGhUserIssueContributionsByRepo(''), { wrapper });
    expect(result.current.isLoading).toBe(false);
    expect(mockIssueContributionsByRepo).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useGhUserIssueContributionsByRepo('octocat', { enabled: false }),
      { wrapper },
    );
    expect(result.current.isLoading).toBe(false);
    expect(mockIssueContributionsByRepo).not.toHaveBeenCalled();
  });
  it('accepts queryOptions', async () => {
    mockIssueContributionsByRepo.mockResolvedValue(mockContributions);
    const { result } = renderHook(
      () => useGhUserIssueContributionsByRepo('octocat', { queryOptions: { staleTime: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
