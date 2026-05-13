import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GitHubClient, GitHubApiError, PullRequestResource, type GitHubReview } from 'gh-api-client';
import { useGhCreatePullRequestReview } from './useGhCreatePullRequestReview.js';

type CreateReviewData = Parameters<PullRequestResource['createReview']>[0];

const mockCreateReview = jest.fn<(data: CreateReviewData) => Promise<GitHubReview>>();
const mockPullRequest = jest.fn().mockReturnValue({ createReview: mockCreateReview });

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .spyOn(GitHubClient.prototype, 'repo')
    .mockReturnValue({
      pullRequest: mockPullRequest,
    } as unknown as ReturnType<GitHubClient['repo']>);
});

const mockReview = {
  id: 1,
  body: 'LGTM',
  state: 'APPROVED',
  submitted_at: '2024-01-01T00:00:00Z',
  html_url: 'https://github.com/owner/repo/pull/42#pullrequestreview-1',
  user: null,
} as unknown as GitHubReview;

const reviewData: CreateReviewData = { event: 'APPROVE' };

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhCreatePullRequestReview', () => {
  it('returns created review on success', async () => {
    mockCreateReview.mockResolvedValue(mockReview);

    const { result } = renderHook(
      () => useGhCreatePullRequestReview('owner', 'repo', 42),
      { wrapper }
    );

    act(() => {
      result.current.mutate(reviewData);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockReview);
    expect(mockCreateReview).toHaveBeenCalledWith(reviewData);
  });

  it('returns error on failure', async () => {
    mockCreateReview.mockRejectedValue(new GitHubApiError(422, 'Unprocessable Entity'));

    const { result } = renderHook(
      () => useGhCreatePullRequestReview('owner', 'repo', 42),
      { wrapper }
    );

    act(() => {
      result.current.mutate(reviewData);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('is idle before mutate is called', () => {
    const { result } = renderHook(
      () => useGhCreatePullRequestReview('owner', 'repo', 42),
      { wrapper }
    );

    expect(result.current.isIdle).toBe(true);
  });
});
