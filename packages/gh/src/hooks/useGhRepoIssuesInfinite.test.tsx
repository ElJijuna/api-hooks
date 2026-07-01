import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import {
  GitHubApiError,
  GitHubClient,
  type GitHubIssue,
  type GitHubPagedResponse,
} from 'gh-api-client';
import type { ReactNode } from 'react';
import { useGhRepoIssuesInfinite } from './useGhRepoIssuesInfinite.js';

const mockIssues =
  jest.fn<(params?: object, signal?: AbortSignal) => Promise<GitHubPagedResponse<GitHubIssue>>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .spyOn(GitHubClient.prototype, 'repo')
    .mockReturnValue({ issues: mockIssues } as unknown as ReturnType<GitHubClient['repo']>);
});

const mockIssue = {
  id: 1,
  number: 1,
  title: 'Found a bug',
  state: 'open',
} as unknown as GitHubIssue;

function makeResponse(hasNextPage: boolean, nextPage?: number): GitHubPagedResponse<GitHubIssue> {
  return { values: [mockIssue], hasNextPage, nextPage };
}

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhRepoIssuesInfinite', () => {
  it('fetches the first page on mount', async () => {
    mockIssues.mockResolvedValue(makeResponse(false));
    const { result } = renderHook(() => useGhRepoIssuesInfinite('octocat', 'Hello-World'), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data?.pages).toHaveLength(1);
    expect(mockIssues).toHaveBeenCalledWith({ page: 1 }, expect.anything());
  });

  it('fetches the next page when fetchNextPage is called', async () => {
    mockIssues
      .mockResolvedValueOnce(makeResponse(true, 2))
      .mockResolvedValueOnce(makeResponse(false));
    const { result } = renderHook(() => useGhRepoIssuesInfinite('octocat', 'Hello-World'), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    void result.current.fetchNextPage();
    await waitFor(() => expect(result.current.data?.pages).toHaveLength(2));
    expect(mockIssues).toHaveBeenNthCalledWith(2, { page: 2 }, expect.anything());
  });

  it('reports hasNextPage=false on the last page', async () => {
    mockIssues.mockResolvedValue(makeResponse(false));
    const { result } = renderHook(() => useGhRepoIssuesInfinite('octocat', 'Hello-World'), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.hasNextPage).toBe(false);
  });

  it('returns error on failure', async () => {
    mockIssues.mockRejectedValue(new GitHubApiError(401, 'Unauthorized'));
    const { result } = renderHook(() => useGhRepoIssuesInfinite('octocat', 'Hello-World'), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useGhRepoIssuesInfinite('octocat', 'Hello-World', undefined, { enabled: false }),
      { wrapper },
    );
    expect(result.current.isLoading).toBe(false);
    expect(mockIssues).not.toHaveBeenCalled();
  });

  it('accepts queryOptions', async () => {
    mockIssues.mockResolvedValue(makeResponse(false));
    const { result } = renderHook(
      () =>
        useGhRepoIssuesInfinite('octocat', 'Hello-World', undefined, {
          queryOptions: { staleTime: 0 },
        }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
