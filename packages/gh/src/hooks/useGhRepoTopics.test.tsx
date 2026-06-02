import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { GitHubApiError, GitHubClient } from 'gh-api-client';
import { useGhRepoTopics } from './useGhRepoTopics.js';

const mockTopics = jest.fn<(signal?: AbortSignal) => Promise<string[]>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .spyOn(GitHubClient.prototype, 'repo')
    .mockReturnValue({ topics: mockTopics } as unknown as ReturnType<GitHubClient['repo']>);
});

const mockTopicsData = ['typescript', 'react'];

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhRepoTopics', () => {
  it('returns data on success', async () => {
    mockTopics.mockResolvedValue(mockTopicsData);
    const { result } = renderHook(() => useGhRepoTopics('octocat', 'Hello-World'), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual(mockTopicsData);
    expect(result.current.isError).toBe(false);
    expect(mockTopics).toHaveBeenCalledWith(expect.anything());
  });

  it('returns error on failure', async () => {
    mockTopics.mockRejectedValue(new GitHubApiError(404, 'Not Found'));
    const { result } = renderHook(() => useGhRepoTopics('octocat', 'nonexistent'), { wrapper });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when owner is empty', () => {
    const { result } = renderHook(() => useGhRepoTopics('', 'Hello-World'), { wrapper });
    expect(result.current.isLoading).toBe(false);
    expect(mockTopics).not.toHaveBeenCalled();
  });

  it('does not fetch when repo is empty', () => {
    const { result } = renderHook(() => useGhRepoTopics('octocat', ''), { wrapper });
    expect(result.current.isLoading).toBe(false);
    expect(mockTopics).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useGhRepoTopics('octocat', 'Hello-World', { enabled: false }),
      { wrapper },
    );
    expect(result.current.isLoading).toBe(false);
    expect(mockTopics).not.toHaveBeenCalled();
  });
});
