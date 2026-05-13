import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GitHubClient, GitHubApiError, PullRequestResource, type GitHubReviewComment } from 'gh-api-client';
import { useGhAddPullRequestComment } from './useGhAddPullRequestComment.js';

type AddCommentData = Parameters<PullRequestResource['addComment']>[0];

const mockAddComment = jest.fn<(data: AddCommentData) => Promise<GitHubReviewComment>>();
const mockPullRequest = jest.fn().mockReturnValue({ addComment: mockAddComment });

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .spyOn(GitHubClient.prototype, 'repo')
    .mockReturnValue({
      pullRequest: mockPullRequest,
    } as unknown as ReturnType<GitHubClient['repo']>);
});

const mockComment = {
  id: 1,
  body: 'Nice change!',
  path: 'src/index.ts',
  line: 10,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  html_url: '',
  user: null,
} as unknown as GitHubReviewComment;

const commentData: AddCommentData = {
  body: 'Nice change!',
  commit_id: 'abc123',
  path: 'src/index.ts',
  line: 10,
};

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhAddPullRequestComment', () => {
  it('returns created comment on success', async () => {
    mockAddComment.mockResolvedValue(mockComment);

    const { result } = renderHook(
      () => useGhAddPullRequestComment('owner', 'repo', 42),
      { wrapper }
    );

    act(() => {
      result.current.mutate(commentData);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockComment);
    expect(mockAddComment).toHaveBeenCalledWith(commentData);
  });

  it('returns error on failure', async () => {
    mockAddComment.mockRejectedValue(new GitHubApiError(422, 'Unprocessable Entity'));

    const { result } = renderHook(
      () => useGhAddPullRequestComment('owner', 'repo', 42),
      { wrapper }
    );

    act(() => {
      result.current.mutate(commentData);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('is idle before mutate is called', () => {
    const { result } = renderHook(
      () => useGhAddPullRequestComment('owner', 'repo', 42),
      { wrapper }
    );

    expect(result.current.isIdle).toBe(true);
  });
});
