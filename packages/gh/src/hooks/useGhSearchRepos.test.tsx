import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GitHubClient, GitHubApiError, type GitHubRepository, type GitHubPagedResponse } from 'gh-api-client';
import { useGhSearchRepos } from './useGhSearchRepos.js';

const mockSearchRepos = jest.fn<(params?: object, signal?: AbortSignal) => Promise<GitHubPagedResponse<GitHubRepository>>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(GitHubClient.prototype, 'searchRepos').mockImplementation(mockSearchRepos);
});

const mockRepo = { id: 1, name: 'Hello-World', full_name: 'octocat/Hello-World' } as unknown as GitHubRepository;
const mockResponse: GitHubPagedResponse<GitHubRepository> = { values: [mockRepo], hasNextPage: false };

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhSearchRepos', () => {
  it('returns data on success', async () => {
    mockSearchRepos.mockResolvedValue(mockResponse);
    const { result } = renderHook(() => useGhSearchRepos({ q: 'typescript' }), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual(mockResponse);
    expect(result.current.isError).toBe(false);
    expect(mockSearchRepos).toHaveBeenCalledWith({ q: 'typescript' }, expect.anything());
  });

  it('passes params to the client', async () => {
    mockSearchRepos.mockResolvedValue(mockResponse);
    const params = { q: 'typescript', per_page: 10, page: 2 };
    const { result } = renderHook(() => useGhSearchRepos(params), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(mockSearchRepos).toHaveBeenCalledWith(params, expect.anything());
  });

  it('returns error on failure', async () => {
    mockSearchRepos.mockRejectedValue(new GitHubApiError(401, 'Unauthorized'));
    const { result } = renderHook(() => useGhSearchRepos({ q: 'typescript' }), { wrapper });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when q is empty', () => {
    const { result } = renderHook(() => useGhSearchRepos({ q: '' }), { wrapper });
    expect(result.current.isLoading).toBe(false);
    expect(mockSearchRepos).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(() => useGhSearchRepos({ q: 'typescript' }, { enabled: false }), { wrapper });
    expect(result.current.isLoading).toBe(false);
    expect(mockSearchRepos).not.toHaveBeenCalled();
  });
});
