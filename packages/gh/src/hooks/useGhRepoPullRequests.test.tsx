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
import { useGhRepoPullRequests } from './useGhRepoPullRequests.js';

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
const mockResponse: GitHubPagedResponse<GitHubPullRequest> = {
  values: [mockPullRequest],
  hasNextPage: false,
};

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhRepoPullRequests', () => {
  it('returns data on success', async () => {
    mockPullRequests.mockResolvedValue(mockResponse);
    const { result } = renderHook(() => useGhRepoPullRequests('octocat', 'Hello-World'), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual(mockResponse);
    expect(result.current.isError).toBe(false);
    expect(mockPullRequests).toHaveBeenCalledWith(undefined, expect.anything());
  });

  it('passes params to the client', async () => {
    mockPullRequests.mockResolvedValue(mockResponse);
    const params = { per_page: 10, page: 2 };
    const { result } = renderHook(() => useGhRepoPullRequests('octocat', 'Hello-World', params), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(mockPullRequests).toHaveBeenCalledWith(params, expect.anything());
  });

  it('returns error on failure', async () => {
    mockPullRequests.mockRejectedValue(new GitHubApiError(401, 'Unauthorized'));
    const { result } = renderHook(() => useGhRepoPullRequests('octocat', 'Hello-World'), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useGhRepoPullRequests('octocat', 'Hello-World', undefined, { enabled: false }),
      { wrapper },
    );
    expect(result.current.isLoading).toBe(false);
    expect(mockPullRequests).not.toHaveBeenCalled();
  });
  it('accepts queryOptions', async () => {
    mockPullRequests.mockResolvedValue(mockResponse);
    const { result } = renderHook(
      () => useGhRepoPullRequests('octocat', 'Hello-World', { queryOptions: { staleTime: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
