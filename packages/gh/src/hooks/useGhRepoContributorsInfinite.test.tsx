import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { GitHubApiError, GitHubClient, type GitHubPagedResponse } from 'gh-api-client';
import type { ReactNode } from 'react';
import type { GitHubContributor } from './useGhRepoContributors.js';
import { useGhRepoContributorsInfinite } from './useGhRepoContributorsInfinite.js';

const mockContributors =
  jest.fn<
    (params?: object, signal?: AbortSignal) => Promise<GitHubPagedResponse<GitHubContributor>>
  >();

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .spyOn(GitHubClient.prototype, 'repo')
    .mockReturnValue({ contributors: mockContributors } as unknown as ReturnType<
      GitHubClient['repo']
    >);
});

const mockContributor: GitHubContributor = { login: 'octocat', id: 1, contributions: 42 };

function makeResponse(
  hasNextPage: boolean,
  nextPage?: number,
): GitHubPagedResponse<GitHubContributor> {
  return { values: [mockContributor], hasNextPage, nextPage };
}

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhRepoContributorsInfinite', () => {
  it('fetches the first page on mount', async () => {
    mockContributors.mockResolvedValue(makeResponse(false));
    const { result } = renderHook(() => useGhRepoContributorsInfinite('octocat', 'Hello-World'), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data?.pages).toHaveLength(1);
    expect(mockContributors).toHaveBeenCalledWith({ page: 1 }, expect.anything());
  });

  it('fetches the next page when fetchNextPage is called', async () => {
    mockContributors
      .mockResolvedValueOnce(makeResponse(true, 2))
      .mockResolvedValueOnce(makeResponse(false));
    const { result } = renderHook(() => useGhRepoContributorsInfinite('octocat', 'Hello-World'), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    void result.current.fetchNextPage();
    await waitFor(() => expect(result.current.data?.pages).toHaveLength(2));
    expect(mockContributors).toHaveBeenNthCalledWith(2, { page: 2 }, expect.anything());
  });

  it('reports hasNextPage=false on the last page', async () => {
    mockContributors.mockResolvedValue(makeResponse(false));
    const { result } = renderHook(() => useGhRepoContributorsInfinite('octocat', 'Hello-World'), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.hasNextPage).toBe(false);
  });

  it('returns error on failure', async () => {
    mockContributors.mockRejectedValue(new GitHubApiError(401, 'Unauthorized'));
    const { result } = renderHook(() => useGhRepoContributorsInfinite('octocat', 'Hello-World'), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useGhRepoContributorsInfinite('octocat', 'Hello-World', undefined, { enabled: false }),
      { wrapper },
    );
    expect(result.current.isLoading).toBe(false);
    expect(mockContributors).not.toHaveBeenCalled();
  });
});
