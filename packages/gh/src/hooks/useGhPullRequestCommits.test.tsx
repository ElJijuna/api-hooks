import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import {
  GitHubApiError,
  GitHubClient,
  type GitHubCommit,
  type GitHubPagedResponse,
} from 'gh-api-client';
import type { ReactNode } from 'react';
import { useGhPullRequestCommits } from './useGhPullRequestCommits.js';

const mockCommits =
  jest.fn<(params?: object, signal?: AbortSignal) => Promise<GitHubPagedResponse<GitHubCommit>>>();
const mockPullRequest = jest.fn().mockReturnValue({ commits: mockCommits });

beforeEach(() => {
  jest.clearAllMocks();
  mockPullRequest.mockReturnValue({ commits: mockCommits });
  jest
    .spyOn(GitHubClient.prototype, 'repo')
    .mockReturnValue({ pullRequest: mockPullRequest } as unknown as ReturnType<
      GitHubClient['repo']
    >);
});

const mockCommit = {
  sha: 'abc123',
  commit: { message: 'Initial commit' },
} as unknown as GitHubCommit;
const mockResponse: GitHubPagedResponse<GitHubCommit> = {
  values: [mockCommit],
  hasNextPage: false,
};

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhPullRequestCommits', () => {
  it('returns data on success', async () => {
    mockCommits.mockResolvedValue(mockResponse);
    const { result } = renderHook(() => useGhPullRequestCommits('octocat', 'Hello-World', 42), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual(mockResponse);
    expect(result.current.isError).toBe(false);
    expect(mockPullRequest).toHaveBeenCalledWith(42);
    expect(mockCommits).toHaveBeenCalledWith(undefined, expect.anything());
  });

  it('passes params to the client', async () => {
    mockCommits.mockResolvedValue(mockResponse);
    const params = { per_page: 10, page: 2 };
    const { result } = renderHook(
      () => useGhPullRequestCommits('octocat', 'Hello-World', 42, params),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(mockCommits).toHaveBeenCalledWith(params, expect.anything());
  });

  it('returns error on failure', async () => {
    mockCommits.mockRejectedValue(new GitHubApiError(401, 'Unauthorized'));
    const { result } = renderHook(() => useGhPullRequestCommits('octocat', 'Hello-World', 42), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useGhPullRequestCommits('octocat', 'Hello-World', 42, undefined, { enabled: false }),
      { wrapper },
    );
    expect(result.current.isLoading).toBe(false);
    expect(mockCommits).not.toHaveBeenCalled();
  });
});
