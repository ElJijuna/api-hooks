import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import {
  GitHubApiError,
  GitHubClient,
  type GitHubPagedResponse,
  type GitHubPullRequest,
} from 'gh-api-client';
import type { ReactNode } from 'react';
import { useGhRepoPullRequestsInfinite } from './useGhRepoPullRequestsInfinite.js';

const mockPullRequests =
  jest.fn<
    (params?: object, signal?: AbortSignal) => Promise<GitHubPagedResponse<GitHubPullRequest>>
  >();

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .spyOn(GitHubClient.prototype, 'repo')
    .mockReturnValue({ pullRequests: mockPullRequests } as unknown as ReturnType<
      GitHubClient['repo']
    >);
});

const mockPullRequest = {
  id: 1,
  number: 42,
  title: 'Fix bug',
  state: 'open',
} as unknown as GitHubPullRequest;

function makeResponse(
  hasNextPage: boolean,
  nextPage?: number,
): GitHubPagedResponse<GitHubPullRequest> {
  return { values: [mockPullRequest], hasNextPage, nextPage };
}

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhRepoPullRequestsInfinite', () => {
  it('fetches the first page on mount', async () => {
    mockPullRequests.mockResolvedValue(makeResponse(false));
    const { result } = renderHook(() => useGhRepoPullRequestsInfinite('octocat', 'Hello-World'), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data?.pages).toHaveLength(1);
    expect(mockPullRequests).toHaveBeenCalledWith({ page: 1 }, expect.anything());
  });

  it('fetches the next page when fetchNextPage is called', async () => {
    mockPullRequests
      .mockResolvedValueOnce(makeResponse(true, 2))
      .mockResolvedValueOnce(makeResponse(false));
    const { result } = renderHook(() => useGhRepoPullRequestsInfinite('octocat', 'Hello-World'), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    void result.current.fetchNextPage();
    await waitFor(() => expect(result.current.data?.pages).toHaveLength(2));
    expect(mockPullRequests).toHaveBeenNthCalledWith(2, { page: 2 }, expect.anything());
  });

  it('reports hasNextPage=false on the last page', async () => {
    mockPullRequests.mockResolvedValue(makeResponse(false));
    const { result } = renderHook(() => useGhRepoPullRequestsInfinite('octocat', 'Hello-World'), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.hasNextPage).toBe(false);
  });

  it('returns error on failure', async () => {
    mockPullRequests.mockRejectedValue(new GitHubApiError(401, 'Unauthorized'));
    const { result } = renderHook(() => useGhRepoPullRequestsInfinite('octocat', 'Hello-World'), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useGhRepoPullRequestsInfinite('octocat', 'Hello-World', undefined, { enabled: false }),
      { wrapper },
    );
    expect(result.current.isLoading).toBe(false);
    expect(mockPullRequests).not.toHaveBeenCalled();
  });

  it('accepts queryOptions', async () => {
    mockPullRequests.mockResolvedValue(makeResponse(false));
    const { result } = renderHook(
      () =>
        useGhRepoPullRequestsInfinite('octocat', 'Hello-World', undefined, {
          queryOptions: { staleTime: 0 },
        }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
