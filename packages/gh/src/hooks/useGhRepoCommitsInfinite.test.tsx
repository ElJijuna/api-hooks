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
import { useGhRepoCommitsInfinite } from './useGhRepoCommitsInfinite.js';

const mockCommits =
  jest.fn<(params?: object, signal?: AbortSignal) => Promise<GitHubPagedResponse<GitHubCommit>>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .spyOn(GitHubClient.prototype, 'repo')
    .mockReturnValue({ commits: mockCommits } as unknown as ReturnType<GitHubClient['repo']>);
});

const mockCommit = {
  sha: 'abc123',
  commit: { message: 'Initial commit' },
} as unknown as GitHubCommit;

function makeResponse(hasNextPage: boolean, nextPage?: number): GitHubPagedResponse<GitHubCommit> {
  return { values: [mockCommit], hasNextPage, nextPage };
}

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhRepoCommitsInfinite', () => {
  it('fetches the first page on mount', async () => {
    mockCommits.mockResolvedValue(makeResponse(false));
    const { result } = renderHook(() => useGhRepoCommitsInfinite('octocat', 'Hello-World'), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data?.pages).toHaveLength(1);
    expect(mockCommits).toHaveBeenCalledWith({ page: 1 }, expect.anything());
  });

  it('fetches the next page when fetchNextPage is called', async () => {
    mockCommits
      .mockResolvedValueOnce(makeResponse(true, 2))
      .mockResolvedValueOnce(makeResponse(false));
    const { result } = renderHook(() => useGhRepoCommitsInfinite('octocat', 'Hello-World'), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    void result.current.fetchNextPage();
    await waitFor(() => expect(result.current.data?.pages).toHaveLength(2));
    expect(mockCommits).toHaveBeenNthCalledWith(2, { page: 2 }, expect.anything());
  });

  it('reports hasNextPage=false on the last page', async () => {
    mockCommits.mockResolvedValue(makeResponse(false));
    const { result } = renderHook(() => useGhRepoCommitsInfinite('octocat', 'Hello-World'), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.hasNextPage).toBe(false);
  });

  it('returns error on failure', async () => {
    mockCommits.mockRejectedValue(new GitHubApiError(401, 'Unauthorized'));
    const { result } = renderHook(() => useGhRepoCommitsInfinite('octocat', 'Hello-World'), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when owner is empty', () => {
    const { result } = renderHook(() => useGhRepoCommitsInfinite('', 'Hello-World'), { wrapper });
    expect(result.current.isLoading).toBe(false);
    expect(mockCommits).not.toHaveBeenCalled();
  });

  it('does not fetch when repo is empty', () => {
    const { result } = renderHook(() => useGhRepoCommitsInfinite('octocat', ''), { wrapper });
    expect(result.current.isLoading).toBe(false);
    expect(mockCommits).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useGhRepoCommitsInfinite('octocat', 'Hello-World', undefined, { enabled: false }),
      { wrapper },
    );
    expect(result.current.isLoading).toBe(false);
    expect(mockCommits).not.toHaveBeenCalled();
  });
});
