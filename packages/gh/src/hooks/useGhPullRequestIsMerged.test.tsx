import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { GitHubApiError, GitHubClient } from 'gh-api-client';
import { useGhPullRequestIsMerged } from './useGhPullRequestIsMerged.js';

const mockIsMerged = jest.fn<(signal?: AbortSignal) => Promise<boolean>>();
const mockPullRequest = jest.fn().mockReturnValue({ isMerged: mockIsMerged });

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(GitHubClient.prototype, 'repo').mockReturnValue({
    pullRequest: mockPullRequest,
  } as unknown as ReturnType<GitHubClient['repo']>);
});

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhPullRequestIsMerged', () => {
  it('returns true when PR is merged', async () => {
    mockIsMerged.mockResolvedValue(true);

    const { result } = renderHook(() => useGhPullRequestIsMerged('owner', 'repo', 42), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toBe(true);
    expect(result.current.isError).toBe(false);
  });

  it('returns false when PR is not merged', async () => {
    mockIsMerged.mockResolvedValue(false);

    const { result } = renderHook(() => useGhPullRequestIsMerged('owner', 'repo', 42), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toBe(false);
  });

  it('returns error on failure', async () => {
    mockIsMerged.mockRejectedValue(new GitHubApiError(404, 'Not Found'));

    const { result } = renderHook(() => useGhPullRequestIsMerged('owner', 'repo', 99), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when pullNumber is 0', () => {
    const { result } = renderHook(() => useGhPullRequestIsMerged('owner', 'repo', 0), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockIsMerged).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useGhPullRequestIsMerged('owner', 'repo', 42, { enabled: false }),
      { wrapper },
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockIsMerged).not.toHaveBeenCalled();
  });
});
