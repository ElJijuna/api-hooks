import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GitHubClient, GitHubApiError, CommitResource, type GitHubPagedResponse } from 'gh-api-client';
import { useGhCommitCommentsInfinite } from './useGhCommitCommentsInfinite.js';

type GitHubCommitComment = Awaited<ReturnType<CommitResource['addComment']>>;

const mockComments = jest.fn<(params?: object, signal?: AbortSignal) => Promise<GitHubPagedResponse<GitHubCommitComment>>>();
const mockCommit = jest.fn().mockReturnValue({ comments: mockComments });

beforeEach(() => {
  jest.clearAllMocks();
  mockCommit.mockReturnValue({ comments: mockComments });
  jest.spyOn(GitHubClient.prototype, 'repo').mockReturnValue({ commit: mockCommit } as unknown as ReturnType<GitHubClient['repo']>);
});

const mockComment = { id: 1, body: 'A comment', path: null, line: null, user: null } as unknown as GitHubCommitComment;

function makeResponse(hasNextPage: boolean, nextPage?: number): GitHubPagedResponse<GitHubCommitComment> {
  return { values: [mockComment], hasNextPage, nextPage };
}

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhCommitCommentsInfinite', () => {
  it('fetches the first page on mount', async () => {
    mockComments.mockResolvedValue(makeResponse(false));

    const { result } = renderHook(() => useGhCommitCommentsInfinite('octocat', 'Hello-World', 'abc123'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data?.pages).toHaveLength(1);
    expect(result.current.data?.pages[0].values).toEqual([mockComment]);
    expect(mockCommit).toHaveBeenCalledWith('abc123');
    expect(mockComments).toHaveBeenCalledWith({ page: 1 }, expect.anything());
  });

  it('fetches the next page when fetchNextPage is called', async () => {
    mockComments
      .mockResolvedValueOnce(makeResponse(true, 2))
      .mockResolvedValueOnce(makeResponse(false));

    const { result } = renderHook(() => useGhCommitCommentsInfinite('octocat', 'Hello-World', 'abc123'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    void result.current.fetchNextPage();

    await waitFor(() => expect(result.current.data?.pages).toHaveLength(2));

    expect(mockComments).toHaveBeenNthCalledWith(2, { page: 2 }, expect.anything());
  });

  it('reports hasNextPage correctly', async () => {
    mockComments.mockResolvedValue(makeResponse(true, 2));

    const { result } = renderHook(() => useGhCommitCommentsInfinite('octocat', 'Hello-World', 'abc123'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.hasNextPage).toBe(true);
  });

  it('returns error on failure', async () => {
    mockComments.mockRejectedValue(new GitHubApiError(404, 'Not Found'));

    const { result } = renderHook(() => useGhCommitCommentsInfinite('octocat', 'Hello-World', 'abc123'), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when ref is empty', () => {
    const { result } = renderHook(() => useGhCommitCommentsInfinite('octocat', 'Hello-World', ''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockComments).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useGhCommitCommentsInfinite('octocat', 'Hello-World', 'abc123', undefined, { enabled: false }),
      { wrapper }
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockComments).not.toHaveBeenCalled();
  });
});
