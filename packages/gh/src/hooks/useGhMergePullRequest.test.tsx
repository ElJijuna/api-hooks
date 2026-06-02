import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { PullRequestResource } from 'gh-api-client';
import { GitHubApiError, GitHubClient } from 'gh-api-client';
import { useGhMergePullRequest } from './useGhMergePullRequest.js';

type MergeResult = Awaited<ReturnType<PullRequestResource['merge']>>;

const mockMerge = jest.fn<(data?: object) => Promise<MergeResult>>();
const mockPullRequest = jest.fn().mockReturnValue({ merge: mockMerge });

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(GitHubClient.prototype, 'repo').mockReturnValue({
    pullRequest: mockPullRequest,
  } as unknown as ReturnType<GitHubClient['repo']>);
});

const mockResult: MergeResult = {
  sha: 'abc123',
  merged: true,
  message: 'Pull Request successfully merged',
};

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhMergePullRequest', () => {
  it('returns merge result on success', async () => {
    mockMerge.mockResolvedValue(mockResult);

    const { result } = renderHook(() => useGhMergePullRequest('owner', 'repo', 42), { wrapper });

    act(() => {
      result.current.mutate(undefined);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockResult);
  });

  it('returns error on failure', async () => {
    mockMerge.mockRejectedValue(new GitHubApiError(405, 'Method Not Allowed'));

    const { result } = renderHook(() => useGhMergePullRequest('owner', 'repo', 42), { wrapper });

    act(() => {
      result.current.mutate(undefined);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('is idle before mutate is called', () => {
    const { result } = renderHook(() => useGhMergePullRequest('owner', 'repo', 42), { wrapper });

    expect(result.current.isIdle).toBe(true);
  });
});
