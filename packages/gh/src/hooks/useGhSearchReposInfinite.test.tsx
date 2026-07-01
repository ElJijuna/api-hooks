import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import {
  GitHubApiError,
  GitHubClient,
  type GitHubPagedResponse,
  type GitHubRepository,
} from 'gh-api-client';
import type { ReactNode } from 'react';
import { useGhSearchReposInfinite } from './useGhSearchReposInfinite.js';

const mockSearchRepos =
  jest.fn<
    (params?: object, signal?: AbortSignal) => Promise<GitHubPagedResponse<GitHubRepository>>
  >();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(GitHubClient.prototype, 'searchRepos').mockImplementation(mockSearchRepos);
});

const mockRepo = {
  id: 1,
  name: 'Hello-World',
  full_name: 'octocat/Hello-World',
} as unknown as GitHubRepository;

function makeResponse(
  hasNextPage: boolean,
  nextPage?: number,
): GitHubPagedResponse<GitHubRepository> {
  return { values: [mockRepo], hasNextPage, nextPage };
}

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhSearchReposInfinite', () => {
  it('fetches the first page on mount', async () => {
    mockSearchRepos.mockResolvedValue(makeResponse(false));
    const { result } = renderHook(() => useGhSearchReposInfinite({ q: 'typescript' }), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data?.pages).toHaveLength(1);
    expect(mockSearchRepos).toHaveBeenCalledWith({ q: 'typescript', page: 1 }, expect.anything());
  });

  it('fetches the next page when fetchNextPage is called', async () => {
    mockSearchRepos
      .mockResolvedValueOnce(makeResponse(true, 2))
      .mockResolvedValueOnce(makeResponse(false));
    const { result } = renderHook(() => useGhSearchReposInfinite({ q: 'typescript' }), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    void result.current.fetchNextPage();
    await waitFor(() => expect(result.current.data?.pages).toHaveLength(2));
    expect(mockSearchRepos).toHaveBeenNthCalledWith(
      2,
      { q: 'typescript', page: 2 },
      expect.anything(),
    );
  });

  it('reports hasNextPage=false on the last page', async () => {
    mockSearchRepos.mockResolvedValue(makeResponse(false));
    const { result } = renderHook(() => useGhSearchReposInfinite({ q: 'typescript' }), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.hasNextPage).toBe(false);
  });

  it('returns error on failure', async () => {
    mockSearchRepos.mockRejectedValue(new GitHubApiError(401, 'Unauthorized'));
    const { result } = renderHook(() => useGhSearchReposInfinite({ q: 'typescript' }), { wrapper });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when q is empty', () => {
    const { result } = renderHook(() => useGhSearchReposInfinite({ q: '' }), { wrapper });
    expect(result.current.isLoading).toBe(false);
    expect(mockSearchRepos).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useGhSearchReposInfinite({ q: 'typescript' }, { enabled: false }),
      { wrapper },
    );
    expect(result.current.isLoading).toBe(false);
    expect(mockSearchRepos).not.toHaveBeenCalled();
  });

  it('accepts queryOptions', async () => {
    mockSearchRepos.mockResolvedValue(makeResponse(false));
    const { result } = renderHook(
      () => useGhSearchReposInfinite({ q: 'typescript' }, { queryOptions: { staleTime: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
