import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GitHubClient, GitHubApiError, type GitHubTag, type GitHubPagedResponse } from 'gh-api-client';
import { useGhRepoTags } from './useGhRepoTags.js';

const mockTags = jest.fn<(params?: object, signal?: AbortSignal) => Promise<GitHubPagedResponse<GitHubTag>>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(GitHubClient.prototype, 'repo').mockReturnValue({ tags: mockTags } as unknown as ReturnType<GitHubClient['repo']>);
});

const mockTag = { name: 'v1.0.0', commit: { sha: 'abc123', url: '' }, zipball_url: '', tarball_url: '', node_id: '' } as unknown as GitHubTag;
const mockResponse: GitHubPagedResponse<GitHubTag> = { values: [mockTag], hasNextPage: false };

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhRepoTags', () => {
  it('returns data on success', async () => {
    mockTags.mockResolvedValue(mockResponse);
    const { result } = renderHook(() => useGhRepoTags('octocat', 'Hello-World'), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual(mockResponse);
    expect(result.current.isError).toBe(false);
    expect(mockTags).toHaveBeenCalledWith(undefined, expect.anything());
  });

  it('passes params to the client', async () => {
    mockTags.mockResolvedValue(mockResponse);
    const params = { per_page: 10, page: 2 };
    const { result } = renderHook(() => useGhRepoTags('octocat', 'Hello-World', params), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(mockTags).toHaveBeenCalledWith(params, expect.anything());
  });

  it('returns error on failure', async () => {
    mockTags.mockRejectedValue(new GitHubApiError(401, 'Unauthorized'));
    const { result } = renderHook(() => useGhRepoTags('octocat', 'Hello-World'), { wrapper });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(() => useGhRepoTags('octocat', 'Hello-World', undefined, { enabled: false }), { wrapper });
    expect(result.current.isLoading).toBe(false);
    expect(mockTags).not.toHaveBeenCalled();
  });
});
