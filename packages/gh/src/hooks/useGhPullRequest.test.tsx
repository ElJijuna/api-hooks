import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GitHubClient, GitHubApiError, type GitHubPullRequest } from 'gh-api-client';
import { useGhPullRequest } from './useGhPullRequest.js';

const mockGet = jest.fn<(signal?: AbortSignal) => Promise<GitHubPullRequest>>();
const mockPullRequest = jest.fn().mockReturnValue({ get: mockGet });

beforeEach(() => {
  jest.clearAllMocks();
  mockPullRequest.mockReturnValue({ get: mockGet });
  jest.spyOn(GitHubClient.prototype, 'repo').mockReturnValue({ pullRequest: mockPullRequest } as unknown as ReturnType<GitHubClient['repo']>);
});

const mockPullRequestData = { id: 1, number: 42, title: 'Fix bug', state: 'open' } as unknown as GitHubPullRequest;

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhPullRequest', () => {
  it('returns data on success', async () => {
    mockGet.mockResolvedValue(mockPullRequestData);
    const { result } = renderHook(() => useGhPullRequest('octocat', 'Hello-World', 42), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual(mockPullRequestData);
    expect(result.current.isError).toBe(false);
    expect(mockPullRequest).toHaveBeenCalledWith(42);
    expect(mockGet).toHaveBeenCalledWith(expect.anything());
  });

  it('returns error on failure', async () => {
    mockGet.mockRejectedValue(new GitHubApiError(404, 'Not Found'));
    const { result } = renderHook(() => useGhPullRequest('octocat', 'Hello-World', 99), { wrapper });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when pullNumber is 0', () => {
    const { result } = renderHook(() => useGhPullRequest('octocat', 'Hello-World', 0), { wrapper });
    expect(result.current.isLoading).toBe(false);
    expect(mockGet).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(() => useGhPullRequest('octocat', 'Hello-World', 42, { enabled: false }), { wrapper });
    expect(result.current.isLoading).toBe(false);
    expect(mockGet).not.toHaveBeenCalled();
  });
});
