import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { CommitResource } from 'gh-api-client';
import { GitHubApiError, GitHubClient } from 'gh-api-client';
import { useGhCommitComments } from './useGhCommitComments.js';

type GitHubCommitComment = Awaited<ReturnType<CommitResource['addComment']>>;

const mockComments =
  jest.fn<
    (
      params?: object,
      signal?: AbortSignal,
    ) => Promise<{ data: GitHubCommitComment[]; hasNextPage: boolean; nextPage: number }>
  >();
const mockCommit = jest.fn().mockReturnValue({ comments: mockComments });

beforeEach(() => {
  jest.clearAllMocks();
  mockCommit.mockReturnValue({ comments: mockComments });
  jest
    .spyOn(GitHubClient.prototype, 'repo')
    .mockReturnValue({ commit: mockCommit } as unknown as ReturnType<GitHubClient['repo']>);
});

const mockData = {
  data: [{ id: 1, body: 'Nice commit!', path: null, line: null } as unknown as GitHubCommitComment],
  hasNextPage: false,
  nextPage: 2,
};

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhCommitComments', () => {
  it('returns data on success', async () => {
    mockComments.mockResolvedValue(mockData);
    const { result } = renderHook(() => useGhCommitComments('octocat', 'Hello-World', 'abc123'), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual(mockData);
    expect(result.current.isError).toBe(false);
    expect(mockCommit).toHaveBeenCalledWith('abc123');
    expect(mockComments).toHaveBeenCalledWith(undefined, expect.anything());
  });

  it('returns error on failure', async () => {
    mockComments.mockRejectedValue(new GitHubApiError(404, 'Not Found'));
    const { result } = renderHook(() => useGhCommitComments('octocat', 'Hello-World', 'abc123'), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when ref is empty', () => {
    const { result } = renderHook(() => useGhCommitComments('octocat', 'Hello-World', ''), {
      wrapper,
    });
    expect(result.current.isLoading).toBe(false);
    expect(mockComments).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useGhCommitComments('octocat', 'Hello-World', 'abc123', undefined, { enabled: false }),
      { wrapper },
    );
    expect(result.current.isLoading).toBe(false);
    expect(mockComments).not.toHaveBeenCalled();
  });
});
