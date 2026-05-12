import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GitHubClient, GitHubApiError, type GitHubRelease, type GitHubPagedResponse } from 'gh-api-client';
import { useGhRepoReleasesInfinite } from './useGhRepoReleasesInfinite.js';

const mockReleases = jest.fn<(params?: object, signal?: AbortSignal) => Promise<GitHubPagedResponse<GitHubRelease>>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(GitHubClient.prototype, 'repo').mockReturnValue({ releases: mockReleases } as unknown as ReturnType<GitHubClient['repo']>);
});

const mockRelease = { id: 1, tag_name: 'v1.0.0', name: 'v1.0.0', body: '', draft: false, prerelease: false, created_at: '', published_at: '', assets: [] } as unknown as GitHubRelease;

function makeResponse(hasNextPage: boolean, nextPage?: number): GitHubPagedResponse<GitHubRelease> {
  return { values: [mockRelease], hasNextPage, nextPage };
}

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhRepoReleasesInfinite', () => {
  it('fetches the first page on mount', async () => {
    mockReleases.mockResolvedValue(makeResponse(false));
    const { result } = renderHook(() => useGhRepoReleasesInfinite('octocat', 'Hello-World'), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data?.pages).toHaveLength(1);
    expect(mockReleases).toHaveBeenCalledWith({ page: 1 }, expect.anything());
  });

  it('fetches the next page when fetchNextPage is called', async () => {
    mockReleases.mockResolvedValueOnce(makeResponse(true, 2)).mockResolvedValueOnce(makeResponse(false));
    const { result } = renderHook(() => useGhRepoReleasesInfinite('octocat', 'Hello-World'), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    void result.current.fetchNextPage();
    await waitFor(() => expect(result.current.data?.pages).toHaveLength(2));
    expect(mockReleases).toHaveBeenNthCalledWith(2, { page: 2 }, expect.anything());
  });

  it('reports hasNextPage=false on the last page', async () => {
    mockReleases.mockResolvedValue(makeResponse(false));
    const { result } = renderHook(() => useGhRepoReleasesInfinite('octocat', 'Hello-World'), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.hasNextPage).toBe(false);
  });

  it('returns error on failure', async () => {
    mockReleases.mockRejectedValue(new GitHubApiError(401, 'Unauthorized'));
    const { result } = renderHook(() => useGhRepoReleasesInfinite('octocat', 'Hello-World'), { wrapper });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(() => useGhRepoReleasesInfinite('octocat', 'Hello-World', undefined, { enabled: false }), { wrapper });
    expect(result.current.isLoading).toBe(false);
    expect(mockReleases).not.toHaveBeenCalled();
  });
});
