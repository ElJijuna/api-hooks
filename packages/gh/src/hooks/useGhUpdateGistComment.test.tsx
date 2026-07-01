import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import {
  type GistComment,
  type GistCommentData,
  GitHubApiError,
  GitHubClient,
} from 'gh-api-client';
import type { ReactNode } from 'react';
import { useGhUpdateGistComment } from './useGhUpdateGistComment.js';

const mockUpdateComment =
  jest.fn<
    (commentId: number, data: GistCommentData, signal?: AbortSignal) => Promise<GistComment>
  >();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(GitHubClient.prototype, 'gist').mockReturnValue({
    updateComment: mockUpdateComment,
  } as unknown as ReturnType<GitHubClient['gist']>);
});

const mockComment: GistComment = {
  id: 1,
  body: 'Updated comment',
  user: null,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-02T00:00:00Z',
};

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhUpdateGistComment', () => {
  it('returns updated comment on success', async () => {
    mockUpdateComment.mockResolvedValue(mockComment);

    const { result } = renderHook(() => useGhUpdateGistComment('abc123'), { wrapper });

    act(() => {
      result.current.mutate({ commentId: 1, data: { body: 'Updated comment' } });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockComment);
    expect(mockUpdateComment).toHaveBeenCalledWith(1, { body: 'Updated comment' });
  });

  it('returns error on failure', async () => {
    mockUpdateComment.mockRejectedValue(new GitHubApiError(404, 'Not Found'));

    const { result } = renderHook(() => useGhUpdateGistComment('abc123'), { wrapper });

    act(() => {
      result.current.mutate({ commentId: 99, data: { body: 'Updated' } });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('is idle before mutate is called', () => {
    const { result } = renderHook(() => useGhUpdateGistComment('abc123'), { wrapper });

    expect(result.current.isIdle).toBe(true);
  });
  it('accepts mutationOptions', async () => {
    mockUpdateComment.mockResolvedValue(mockComment);
    const onSuccess = jest.fn();
    const { result } = renderHook(
      () => useGhUpdateGistComment('abc123', { mutationOptions: { onSuccess } }),
      { wrapper },
    );
    act(() => {
      result.current.mutate({ commentId: 1, data: { body: 'Updated comment' } });
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(onSuccess).toHaveBeenCalled();
  });
});
