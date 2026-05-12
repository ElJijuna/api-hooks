import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GitHubClient, GitHubApiError, type GitHubIssueComment, type GitHubPagedResponse } from 'gh-api-client';
import { useGhIssueCommentsInfinite } from './useGhIssueCommentsInfinite.js';

const mockComments = jest.fn<(params?: object, signal?: AbortSignal) => Promise<GitHubPagedResponse<GitHubIssueComment>>>();
const mockIssue = jest.fn().mockReturnValue({ comments: mockComments });

beforeEach(() => {
  jest.clearAllMocks();
  mockIssue.mockReturnValue({ comments: mockComments });
  jest.spyOn(GitHubClient.prototype, 'repo').mockReturnValue({ issue: mockIssue } as unknown as ReturnType<GitHubClient['repo']>);
});

const mockIssueComment = { id: 1, body: 'A comment', created_at: '', updated_at: '', html_url: '' } as unknown as GitHubIssueComment;

function makeResponse(hasNextPage: boolean, nextPage?: number): GitHubPagedResponse<GitHubIssueComment> {
  return { values: [mockIssueComment], hasNextPage, nextPage };
}

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhIssueCommentsInfinite', () => {
  it('fetches the first page on mount', async () => {
    mockComments.mockResolvedValue(makeResponse(false));
    const { result } = renderHook(() => useGhIssueCommentsInfinite('octocat', 'Hello-World', 1), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data?.pages).toHaveLength(1);
    expect(mockIssue).toHaveBeenCalledWith(1);
    expect(mockComments).toHaveBeenCalledWith({ page: 1 }, expect.anything());
  });

  it('fetches the next page when fetchNextPage is called', async () => {
    mockComments.mockResolvedValueOnce(makeResponse(true, 2)).mockResolvedValueOnce(makeResponse(false));
    const { result } = renderHook(() => useGhIssueCommentsInfinite('octocat', 'Hello-World', 1), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    void result.current.fetchNextPage();
    await waitFor(() => expect(result.current.data?.pages).toHaveLength(2));
    expect(mockComments).toHaveBeenNthCalledWith(2, { page: 2 }, expect.anything());
  });

  it('reports hasNextPage=false on the last page', async () => {
    mockComments.mockResolvedValue(makeResponse(false));
    const { result } = renderHook(() => useGhIssueCommentsInfinite('octocat', 'Hello-World', 1), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.hasNextPage).toBe(false);
  });

  it('returns error on failure', async () => {
    mockComments.mockRejectedValue(new GitHubApiError(401, 'Unauthorized'));
    const { result } = renderHook(() => useGhIssueCommentsInfinite('octocat', 'Hello-World', 1), { wrapper });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when issueNumber is 0', () => {
    const { result } = renderHook(() => useGhIssueCommentsInfinite('octocat', 'Hello-World', 0), { wrapper });
    expect(result.current.isLoading).toBe(false);
    expect(mockComments).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(() => useGhIssueCommentsInfinite('octocat', 'Hello-World', 1, undefined, { enabled: false }), { wrapper });
    expect(result.current.isLoading).toBe(false);
    expect(mockComments).not.toHaveBeenCalled();
  });
});
