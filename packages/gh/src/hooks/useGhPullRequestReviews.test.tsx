import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import {
  GitHubApiError,
  GitHubClient,
  type GitHubPagedResponse,
  type GitHubReview,
} from 'gh-api-client';
import type { ReactNode } from 'react';
import { useGhPullRequestReviews } from './useGhPullRequestReviews.js';

const mockReviews =
  jest.fn<(params?: object, signal?: AbortSignal) => Promise<GitHubPagedResponse<GitHubReview>>>();
const mockPullRequest = jest.fn().mockReturnValue({ reviews: mockReviews });

beforeEach(() => {
  jest.clearAllMocks();
  mockPullRequest.mockReturnValue({ reviews: mockReviews });
  jest
    .spyOn(GitHubClient.prototype, 'repo')
    .mockReturnValue({ pullRequest: mockPullRequest } as unknown as ReturnType<
      GitHubClient['repo']
    >);
});

const mockReview = {
  id: 1,
  body: '',
  state: 'APPROVED',
  submitted_at: '',
  commit_id: '',
} as unknown as GitHubReview;
const mockResponse: GitHubPagedResponse<GitHubReview> = {
  values: [mockReview],
  hasNextPage: false,
};

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhPullRequestReviews', () => {
  it('returns data on success', async () => {
    mockReviews.mockResolvedValue(mockResponse);
    const { result } = renderHook(() => useGhPullRequestReviews('octocat', 'Hello-World', 42), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual(mockResponse);
    expect(result.current.isError).toBe(false);
    expect(mockPullRequest).toHaveBeenCalledWith(42);
    expect(mockReviews).toHaveBeenCalledWith(undefined, expect.anything());
  });

  it('passes params to the client', async () => {
    mockReviews.mockResolvedValue(mockResponse);
    const params = { per_page: 10, page: 2 };
    const { result } = renderHook(
      () => useGhPullRequestReviews('octocat', 'Hello-World', 42, params),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(mockReviews).toHaveBeenCalledWith(params, expect.anything());
  });

  it('returns error on failure', async () => {
    mockReviews.mockRejectedValue(new GitHubApiError(401, 'Unauthorized'));
    const { result } = renderHook(() => useGhPullRequestReviews('octocat', 'Hello-World', 42), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useGhPullRequestReviews('octocat', 'Hello-World', 42, undefined, { enabled: false }),
      { wrapper },
    );
    expect(result.current.isLoading).toBe(false);
    expect(mockReviews).not.toHaveBeenCalled();
  });
});
