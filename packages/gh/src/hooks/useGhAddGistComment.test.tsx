import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GitHubClient, GitHubApiError, type GistComment, type GistCommentData } from 'gh-api-client';
import { useGhAddGistComment } from './useGhAddGistComment.js';

const mockAddComment = jest.fn<(data: GistCommentData, signal?: AbortSignal) => Promise<GistComment>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .spyOn(GitHubClient.prototype, 'gist')
    .mockReturnValue({
      addComment: mockAddComment,
    } as unknown as ReturnType<GitHubClient['gist']>);
});

const mockComment: GistComment = {
  id: 1,
  body: 'Great snippet!',
  user: null,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

const commentData: GistCommentData = { body: 'Great snippet!' };

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhAddGistComment', () => {
  it('returns created comment on success', async () => {
    mockAddComment.mockResolvedValue(mockComment);

    const { result } = renderHook(() => useGhAddGistComment('abc123'), { wrapper });

    act(() => {
      result.current.mutate(commentData);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockComment);
    expect(mockAddComment).toHaveBeenCalledWith(commentData);
  });

  it('returns error on failure', async () => {
    mockAddComment.mockRejectedValue(new GitHubApiError(422, 'Unprocessable Entity'));

    const { result } = renderHook(() => useGhAddGistComment('abc123'), { wrapper });

    act(() => {
      result.current.mutate(commentData);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('is idle before mutate is called', () => {
    const { result } = renderHook(() => useGhAddGistComment('abc123'), { wrapper });

    expect(result.current.isIdle).toBe(true);
  });
});
