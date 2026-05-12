import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GitHubClient, GitHubApiError, type GitHubIssueComment, type GitHubPagedResponse } from 'gh-api-client';
import { useGhIssueComments } from './useGhIssueComments.js';

const mockComments = jest.fn<(params?: object, signal?: AbortSignal) => Promise<GitHubPagedResponse<GitHubIssueComment>>>();
const mockIssue = jest.fn().mockReturnValue({ comments: mockComments });

beforeEach(() => {
  jest.clearAllMocks();
  mockIssue.mockReturnValue({ comments: mockComments });
  jest.spyOn(GitHubClient.prototype, 'repo').mockReturnValue({ issue: mockIssue } as unknown as ReturnType<GitHubClient['repo']>);
});

const mockIssueComment = { id: 1, body: 'A comment', created_at: '', updated_at: '', html_url: '' } as unknown as GitHubIssueComment;
const mockResponse: GitHubPagedResponse<GitHubIssueComment> = { values: [mockIssueComment], hasNextPage: false };

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhIssueComments', () => {
  it('returns data on success', async () => {
    mockComments.mockResolvedValue(mockResponse);
    const { result } = renderHook(() => useGhIssueComments('octocat', 'Hello-World', 1), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual(mockResponse);
    expect(result.current.isError).toBe(false);
    expect(mockIssue).toHaveBeenCalledWith(1);
    expect(mockComments).toHaveBeenCalledWith(undefined, expect.anything());
  });

  it('passes params to the client', async () => {
    mockComments.mockResolvedValue(mockResponse);
    const params = { per_page: 10, page: 2 };
    const { result } = renderHook(() => useGhIssueComments('octocat', 'Hello-World', 1, params), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(mockComments).toHaveBeenCalledWith(params, expect.anything());
  });

  it('returns error on failure', async () => {
    mockComments.mockRejectedValue(new GitHubApiError(401, 'Unauthorized'));
    const { result } = renderHook(() => useGhIssueComments('octocat', 'Hello-World', 1), { wrapper });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when issueNumber is 0', () => {
    const { result } = renderHook(() => useGhIssueComments('octocat', 'Hello-World', 0), { wrapper });
    expect(result.current.isLoading).toBe(false);
    expect(mockComments).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(() => useGhIssueComments('octocat', 'Hello-World', 1, undefined, { enabled: false }), { wrapper });
    expect(result.current.isLoading).toBe(false);
    expect(mockComments).not.toHaveBeenCalled();
  });
});
