import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { PullRequestResource } from 'gh-api-client';
import { GitHubApiError, GitHubClient, type GitHubPullRequest } from 'gh-api-client';
import type { ReactNode } from 'react';
import { useGhRequestReviewers } from './useGhRequestReviewers.js';

type RequestReviewersData = Parameters<PullRequestResource['requestReviewers']>[0];

const mockRequestReviewers = jest.fn<(data: RequestReviewersData) => Promise<GitHubPullRequest>>();
const mockPullRequest = jest.fn().mockReturnValue({ requestReviewers: mockRequestReviewers });

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(GitHubClient.prototype, 'repo').mockReturnValue({
    pullRequest: mockPullRequest,
  } as unknown as ReturnType<GitHubClient['repo']>);
});

const mockPR = {
  id: 1,
  number: 42,
  title: 'Test PR',
  state: 'open',
} as unknown as GitHubPullRequest;
const reviewersData: RequestReviewersData = { reviewers: ['octocat'] };

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhRequestReviewers', () => {
  it('returns updated PR on success', async () => {
    mockRequestReviewers.mockResolvedValue(mockPR);

    const { result } = renderHook(() => useGhRequestReviewers('owner', 'repo', 42), { wrapper });

    act(() => {
      result.current.mutate(reviewersData);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockPR);
    expect(mockRequestReviewers).toHaveBeenCalledWith(reviewersData);
  });

  it('returns error on failure', async () => {
    mockRequestReviewers.mockRejectedValue(new GitHubApiError(422, 'Unprocessable Entity'));

    const { result } = renderHook(() => useGhRequestReviewers('owner', 'repo', 42), { wrapper });

    act(() => {
      result.current.mutate(reviewersData);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('is idle before mutate is called', () => {
    const { result } = renderHook(() => useGhRequestReviewers('owner', 'repo', 42), { wrapper });

    expect(result.current.isIdle).toBe(true);
  });
});
