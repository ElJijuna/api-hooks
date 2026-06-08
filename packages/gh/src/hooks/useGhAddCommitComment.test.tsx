import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { CommitResource } from 'gh-api-client';
import { GitHubApiError, GitHubClient } from 'gh-api-client';
import type { ReactNode } from 'react';
import { useGhAddCommitComment } from './useGhAddCommitComment.js';

type GitHubCommitComment = Awaited<ReturnType<CommitResource['addComment']>>;
type CommitCommentData = Parameters<CommitResource['addComment']>[0];

const mockAddComment = jest.fn<(data: CommitCommentData) => Promise<GitHubCommitComment>>();
const mockCommit = jest.fn().mockReturnValue({ addComment: mockAddComment });

beforeEach(() => {
  jest.clearAllMocks();
  mockCommit.mockReturnValue({ addComment: mockAddComment });
  jest
    .spyOn(GitHubClient.prototype, 'repo')
    .mockReturnValue({ commit: mockCommit } as unknown as ReturnType<GitHubClient['repo']>);
});

const mockComment = {
  id: 1,
  body: 'Looks good!',
  path: 'src/index.ts',
  line: 5,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  html_url: 'https://github.com/owner/repo/commit/abc123#commitcomment-1',
  user: null,
} as unknown as GitHubCommitComment;

const commentData: CommitCommentData = {
  body: 'Looks good!',
  path: 'src/index.ts',
  line: 5,
};

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhAddCommitComment', () => {
  it('returns created comment on success', async () => {
    mockAddComment.mockResolvedValue(mockComment);

    const { result } = renderHook(() => useGhAddCommitComment('owner', 'repo', 'abc123'), {
      wrapper,
    });

    act(() => {
      result.current.mutate(commentData);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockComment);
    expect(mockAddComment).toHaveBeenCalledWith(commentData);
  });

  it('returns error on failure', async () => {
    mockAddComment.mockRejectedValue(new GitHubApiError(422, 'Unprocessable Entity'));

    const { result } = renderHook(() => useGhAddCommitComment('owner', 'repo', 'abc123'), {
      wrapper,
    });

    act(() => {
      result.current.mutate(commentData);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('is idle before mutate is called', () => {
    const { result } = renderHook(() => useGhAddCommitComment('owner', 'repo', 'abc123'), {
      wrapper,
    });

    expect(result.current.isIdle).toBe(true);
  });
});
