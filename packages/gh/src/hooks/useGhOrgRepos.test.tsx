import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GitHubClient, GitHubApiError, type GitHubRepository, type GitHubPagedResponse } from 'gh-api-client';
import { useGhOrgRepos } from './useGhOrgRepos.js';

const mockRepos = jest.fn<(params?: object, signal?: AbortSignal) => Promise<GitHubPagedResponse<GitHubRepository>>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(GitHubClient.prototype, 'org').mockReturnValue({ repos: mockRepos } as unknown as ReturnType<GitHubClient['org']>);
});

const mockRepo = { id: 1, name: 'Hello-World', full_name: 'octocat/Hello-World' } as unknown as GitHubRepository;
const mockResponse: GitHubPagedResponse<GitHubRepository> = { values: [mockRepo], hasNextPage: false };

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhOrgRepos', () => {
  it('returns data on success', async () => {
    mockRepos.mockResolvedValue(mockResponse);
    const { result } = renderHook(() => useGhOrgRepos('github'), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual(mockResponse);
    expect(result.current.isError).toBe(false);
    expect(mockRepos).toHaveBeenCalledWith(undefined, expect.anything());
  });

  it('passes params to the client', async () => {
    mockRepos.mockResolvedValue(mockResponse);
    const params = { per_page: 10, page: 2 };
    const { result } = renderHook(() => useGhOrgRepos('github', params), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(mockRepos).toHaveBeenCalledWith(params, expect.anything());
  });

  it('returns error on failure', async () => {
    mockRepos.mockRejectedValue(new GitHubApiError(401, 'Unauthorized'));
    const { result } = renderHook(() => useGhOrgRepos('github'), { wrapper });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when orgName is empty', () => {
    const { result } = renderHook(() => useGhOrgRepos(''), { wrapper });
    expect(result.current.isLoading).toBe(false);
    expect(mockRepos).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(() => useGhOrgRepos('github', undefined, { enabled: false }), { wrapper });
    expect(result.current.isLoading).toBe(false);
    expect(mockRepos).not.toHaveBeenCalled();
  });
});
