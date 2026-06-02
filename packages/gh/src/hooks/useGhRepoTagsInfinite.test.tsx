import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import {
  GitHubApiError,
  GitHubClient,
  type GitHubPagedResponse,
  type GitHubTag,
} from 'gh-api-client';
import { useGhRepoTagsInfinite } from './useGhRepoTagsInfinite.js';

const mockTags =
  jest.fn<(params?: object, signal?: AbortSignal) => Promise<GitHubPagedResponse<GitHubTag>>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .spyOn(GitHubClient.prototype, 'repo')
    .mockReturnValue({ tags: mockTags } as unknown as ReturnType<GitHubClient['repo']>);
});

const mockTag = {
  name: 'v1.0.0',
  commit: { sha: 'abc123', url: '' },
  zipball_url: '',
  tarball_url: '',
  node_id: '',
} as unknown as GitHubTag;

function makeResponse(hasNextPage: boolean, nextPage?: number): GitHubPagedResponse<GitHubTag> {
  return { values: [mockTag], hasNextPage, nextPage };
}

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhRepoTagsInfinite', () => {
  it('fetches the first page on mount', async () => {
    mockTags.mockResolvedValue(makeResponse(false));
    const { result } = renderHook(() => useGhRepoTagsInfinite('octocat', 'Hello-World'), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data?.pages).toHaveLength(1);
    expect(mockTags).toHaveBeenCalledWith({ page: 1 }, expect.anything());
  });

  it('fetches the next page when fetchNextPage is called', async () => {
    mockTags
      .mockResolvedValueOnce(makeResponse(true, 2))
      .mockResolvedValueOnce(makeResponse(false));
    const { result } = renderHook(() => useGhRepoTagsInfinite('octocat', 'Hello-World'), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    void result.current.fetchNextPage();
    await waitFor(() => expect(result.current.data?.pages).toHaveLength(2));
    expect(mockTags).toHaveBeenNthCalledWith(2, { page: 2 }, expect.anything());
  });

  it('reports hasNextPage=false on the last page', async () => {
    mockTags.mockResolvedValue(makeResponse(false));
    const { result } = renderHook(() => useGhRepoTagsInfinite('octocat', 'Hello-World'), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.hasNextPage).toBe(false);
  });

  it('returns error on failure', async () => {
    mockTags.mockRejectedValue(new GitHubApiError(401, 'Unauthorized'));
    const { result } = renderHook(() => useGhRepoTagsInfinite('octocat', 'Hello-World'), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useGhRepoTagsInfinite('octocat', 'Hello-World', undefined, { enabled: false }),
      { wrapper },
    );
    expect(result.current.isLoading).toBe(false);
    expect(mockTags).not.toHaveBeenCalled();
  });
});
