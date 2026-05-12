import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GitHubClient, GitHubApiError, type GitHubRelease, type GitHubPagedResponse } from 'gh-api-client';
import { useGhRepoReleases } from './useGhRepoReleases.js';

const mockReleases = jest.fn<(params?: object, signal?: AbortSignal) => Promise<GitHubPagedResponse<GitHubRelease>>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(GitHubClient.prototype, 'repo').mockReturnValue({ releases: mockReleases } as unknown as ReturnType<GitHubClient['repo']>);
});

const mockRelease = { id: 1, tag_name: 'v1.0.0', name: 'v1.0.0', body: '', draft: false, prerelease: false, created_at: '', published_at: '', assets: [] } as unknown as GitHubRelease;
const mockResponse: GitHubPagedResponse<GitHubRelease> = { values: [mockRelease], hasNextPage: false };

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhRepoReleases', () => {
  it('returns data on success', async () => {
    mockReleases.mockResolvedValue(mockResponse);
    const { result } = renderHook(() => useGhRepoReleases('octocat', 'Hello-World'), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual(mockResponse);
    expect(result.current.isError).toBe(false);
    expect(mockReleases).toHaveBeenCalledWith(undefined, expect.anything());
  });

  it('passes params to the client', async () => {
    mockReleases.mockResolvedValue(mockResponse);
    const params = { per_page: 10, page: 2 };
    const { result } = renderHook(() => useGhRepoReleases('octocat', 'Hello-World', params), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(mockReleases).toHaveBeenCalledWith(params, expect.anything());
  });

  it('returns error on failure', async () => {
    mockReleases.mockRejectedValue(new GitHubApiError(401, 'Unauthorized'));
    const { result } = renderHook(() => useGhRepoReleases('octocat', 'Hello-World'), { wrapper });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(() => useGhRepoReleases('octocat', 'Hello-World', undefined, { enabled: false }), { wrapper });
    expect(result.current.isLoading).toBe(false);
    expect(mockReleases).not.toHaveBeenCalled();
  });
});
