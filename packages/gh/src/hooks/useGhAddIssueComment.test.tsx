import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GitHubClient, GitHubApiError, type GitHubIssueComment } from 'gh-api-client';
import { useGhAddIssueComment } from './useGhAddIssueComment.js';

const mockAddComment = jest.fn<(body: string) => Promise<GitHubIssueComment>>();
const mockIssue = jest.fn().mockReturnValue({ addComment: mockAddComment });

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .spyOn(GitHubClient.prototype, 'repo')
    .mockReturnValue({
      issue: mockIssue,
    } as unknown as ReturnType<GitHubClient['repo']>);
});

const mockComment = { id: 1, body: 'Looks good!', user: null, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z', html_url: '' } as unknown as GitHubIssueComment;

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhAddIssueComment', () => {
  it('returns created comment on success', async () => {
    mockAddComment.mockResolvedValue(mockComment);

    const { result } = renderHook(() => useGhAddIssueComment('owner', 'repo', 42), { wrapper });

    act(() => { result.current.mutate('Looks good!'); });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockComment);
    expect(mockIssue).toHaveBeenCalledWith(42);
    expect(mockAddComment).toHaveBeenCalledWith('Looks good!');
  });

  it('returns error on failure', async () => {
    mockAddComment.mockRejectedValue(new GitHubApiError(403, 'Forbidden'));

    const { result } = renderHook(() => useGhAddIssueComment('owner', 'repo', 42), { wrapper });

    act(() => { result.current.mutate('comment'); });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('is idle before mutate is called', () => {
    const { result } = renderHook(() => useGhAddIssueComment('owner', 'repo', 42), { wrapper });
    expect(result.current.isIdle).toBe(true);
  });
});
