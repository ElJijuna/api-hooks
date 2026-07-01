import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import {
  GitHubApiError,
  GitHubClient,
  type GitHubCombinedStatus,
  type GitHubRepository,
} from 'gh-api-client';
import type { ReactNode } from 'react';
import { useGhCommitCombinedStatus } from './useGhCommitCombinedStatus.js';

const mockCombinedStatus = jest.fn<(signal?: AbortSignal) => Promise<GitHubCombinedStatus>>();
const mockCommit = jest.fn().mockReturnValue({ combinedStatus: mockCombinedStatus });

beforeEach(() => {
  jest.clearAllMocks();
  mockCommit.mockReturnValue({ combinedStatus: mockCombinedStatus });
  jest
    .spyOn(GitHubClient.prototype, 'repo')
    .mockReturnValue({ commit: mockCommit } as unknown as ReturnType<GitHubClient['repo']>);
});

const mockRepo = {
  id: 1,
  name: 'Hello-World',
  full_name: 'octocat/Hello-World',
} as unknown as GitHubRepository;
const mockCombinedStatusData = {
  state: 'success',
  statuses: [],
  sha: 'abc123',
  total_count: 0,
  repository: mockRepo,
} as unknown as GitHubCombinedStatus;

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhCommitCombinedStatus', () => {
  it('returns data on success', async () => {
    mockCombinedStatus.mockResolvedValue(mockCombinedStatusData);
    const { result } = renderHook(
      () => useGhCommitCombinedStatus('octocat', 'Hello-World', 'abc123'),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual(mockCombinedStatusData);
    expect(result.current.isError).toBe(false);
    expect(mockCommit).toHaveBeenCalledWith('abc123');
    expect(mockCombinedStatus).toHaveBeenCalledWith(expect.anything());
  });

  it('returns error on failure', async () => {
    mockCombinedStatus.mockRejectedValue(new GitHubApiError(404, 'Not Found'));
    const { result } = renderHook(
      () => useGhCommitCombinedStatus('octocat', 'Hello-World', 'deadbeef'),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when ref is empty', () => {
    const { result } = renderHook(() => useGhCommitCombinedStatus('octocat', 'Hello-World', ''), {
      wrapper,
    });
    expect(result.current.isLoading).toBe(false);
    expect(mockCombinedStatus).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useGhCommitCombinedStatus('octocat', 'Hello-World', 'abc123', { enabled: false }),
      { wrapper },
    );
    expect(result.current.isLoading).toBe(false);
    expect(mockCombinedStatus).not.toHaveBeenCalled();
  });
  it('accepts queryOptions', async () => {
    mockCombinedStatus.mockResolvedValue(mockCombinedStatusData);
    const { result } = renderHook(
      () =>
        useGhCommitCombinedStatus('octocat', 'Hello-World', 'abc123', {
          queryOptions: { staleTime: 0 },
        }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
