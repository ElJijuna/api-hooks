import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GitHubClient, GitHubApiError } from 'gh-api-client';
import { useGhDeleteGistComment } from './useGhDeleteGistComment.js';

const mockDeleteComment = jest.fn<(commentId: number, signal?: AbortSignal) => Promise<void>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .spyOn(GitHubClient.prototype, 'gist')
    .mockReturnValue({
      deleteComment: mockDeleteComment,
    } as unknown as ReturnType<GitHubClient['gist']>);
});

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhDeleteGistComment', () => {
  it('succeeds on delete', async () => {
    mockDeleteComment.mockResolvedValue(undefined);

    const { result } = renderHook(() => useGhDeleteGistComment('abc123'), { wrapper });

    act(() => {
      result.current.mutate({ commentId: 1 });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockDeleteComment).toHaveBeenCalledWith(1);
  });

  it('returns error on failure', async () => {
    mockDeleteComment.mockRejectedValue(new GitHubApiError(404, 'Not Found'));

    const { result } = renderHook(() => useGhDeleteGistComment('abc123'), { wrapper });

    act(() => {
      result.current.mutate({ commentId: 99 });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('is idle before mutate is called', () => {
    const { result } = renderHook(() => useGhDeleteGistComment('abc123'), { wrapper });

    expect(result.current.isIdle).toBe(true);
  });
});
