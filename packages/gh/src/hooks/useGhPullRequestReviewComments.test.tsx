import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import {
  GitHubApiError,
  GitHubClient,
  type GitHubPagedResponse,
  type GitHubReviewComment,
} from 'gh-api-client';
import type { ReactNode } from 'react';
import { useGhPullRequestReviewComments } from './useGhPullRequestReviewComments.js';

const mockReviewComments =
  jest.fn<
    (params?: object, signal?: AbortSignal) => Promise<GitHubPagedResponse<GitHubReviewComment>>
  >();
const mockPullRequest = jest.fn().mockReturnValue({ reviewComments: mockReviewComments });

beforeEach(() => {
  jest.clearAllMocks();
  mockPullRequest.mockReturnValue({ reviewComments: mockReviewComments });
  jest
    .spyOn(GitHubClient.prototype, 'repo')
    .mockReturnValue({ pullRequest: mockPullRequest } as unknown as ReturnType<
      GitHubClient['repo']
    >);
});

const mockReviewComment = {
  id: 1,
  body: '',
  created_at: '',
  updated_at: '',
} as unknown as GitHubReviewComment;
const mockResponse: GitHubPagedResponse<GitHubReviewComment> = {
  values: [mockReviewComment],
  hasNextPage: false,
};

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhPullRequestReviewComments', () => {
  it('returns data on success', async () => {
    mockReviewComments.mockResolvedValue(mockResponse);
    const { result } = renderHook(
      () => useGhPullRequestReviewComments('octocat', 'Hello-World', 42),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual(mockResponse);
    expect(result.current.isError).toBe(false);
    expect(mockPullRequest).toHaveBeenCalledWith(42);
    expect(mockReviewComments).toHaveBeenCalledWith(undefined, expect.anything());
  });

  it('passes params to the client', async () => {
    mockReviewComments.mockResolvedValue(mockResponse);
    const params = { per_page: 10, page: 2 };
    const { result } = renderHook(
      () => useGhPullRequestReviewComments('octocat', 'Hello-World', 42, params),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(mockReviewComments).toHaveBeenCalledWith(params, expect.anything());
  });

  it('returns error on failure', async () => {
    mockReviewComments.mockRejectedValue(new GitHubApiError(401, 'Unauthorized'));
    const { result } = renderHook(
      () => useGhPullRequestReviewComments('octocat', 'Hello-World', 42),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () =>
        useGhPullRequestReviewComments('octocat', 'Hello-World', 42, undefined, { enabled: false }),
      { wrapper },
    );
    expect(result.current.isLoading).toBe(false);
    expect(mockReviewComments).not.toHaveBeenCalled();
  });
});
