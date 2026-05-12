import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GitHubClient, GitHubApiError, type GitHubCommit } from 'gh-api-client';
import { useGhCommit } from './useGhCommit.js';

const mockGet = jest.fn<(signal?: AbortSignal) => Promise<GitHubCommit>>();
const mockCommit = jest.fn().mockReturnValue({ get: mockGet });

beforeEach(() => {
  jest.clearAllMocks();
  mockCommit.mockReturnValue({ get: mockGet });
  jest.spyOn(GitHubClient.prototype, 'repo').mockReturnValue({ commit: mockCommit } as unknown as ReturnType<GitHubClient['repo']>);
});

const mockCommitData = { sha: 'abc123', commit: { message: 'Initial commit' } } as unknown as GitHubCommit;

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhCommit', () => {
  it('returns data on success', async () => {
    mockGet.mockResolvedValue(mockCommitData);
    const { result } = renderHook(() => useGhCommit('octocat', 'Hello-World', 'abc123'), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual(mockCommitData);
    expect(result.current.isError).toBe(false);
    expect(mockCommit).toHaveBeenCalledWith('abc123');
    expect(mockGet).toHaveBeenCalledWith(expect.anything());
  });

  it('returns error on failure', async () => {
    mockGet.mockRejectedValue(new GitHubApiError(404, 'Not Found'));
    const { result } = renderHook(() => useGhCommit('octocat', 'Hello-World', 'deadbeef'), { wrapper });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when ref is empty', () => {
    const { result } = renderHook(() => useGhCommit('octocat', 'Hello-World', ''), { wrapper });
    expect(result.current.isLoading).toBe(false);
    expect(mockGet).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(() => useGhCommit('octocat', 'Hello-World', 'abc123', { enabled: false }), { wrapper });
    expect(result.current.isLoading).toBe(false);
    expect(mockGet).not.toHaveBeenCalled();
  });
});
