import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import {
  GitHubApiError,
  type GitHubCheckRun,
  GitHubClient,
  type GitHubPagedResponse,
} from 'gh-api-client';
import type { ReactNode } from 'react';
import { useGhCommitCheckRuns } from './useGhCommitCheckRuns.js';

const mockCheckRuns =
  jest.fn<
    (params?: object, signal?: AbortSignal) => Promise<GitHubPagedResponse<GitHubCheckRun>>
  >();
const mockCommit = jest.fn().mockReturnValue({ checkRuns: mockCheckRuns });

beforeEach(() => {
  jest.clearAllMocks();
  mockCommit.mockReturnValue({ checkRuns: mockCheckRuns });
  jest
    .spyOn(GitHubClient.prototype, 'repo')
    .mockReturnValue({ commit: mockCommit } as unknown as ReturnType<GitHubClient['repo']>);
});

const mockCheckRun = {
  id: 1,
  name: 'CI',
  status: 'completed',
  conclusion: 'success',
  started_at: null,
  completed_at: null,
  html_url: '',
  head_sha: 'abc123',
} as unknown as GitHubCheckRun;
const mockResponse: GitHubPagedResponse<GitHubCheckRun> = {
  values: [mockCheckRun],
  hasNextPage: false,
};

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhCommitCheckRuns', () => {
  it('returns data on success', async () => {
    mockCheckRuns.mockResolvedValue(mockResponse);
    const { result } = renderHook(() => useGhCommitCheckRuns('octocat', 'Hello-World', 'abc123'), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual(mockResponse);
    expect(result.current.isError).toBe(false);
    expect(mockCommit).toHaveBeenCalledWith('abc123');
    expect(mockCheckRuns).toHaveBeenCalledWith(undefined, expect.anything());
  });

  it('passes params to the client', async () => {
    mockCheckRuns.mockResolvedValue(mockResponse);
    const params = { per_page: 10, page: 2 };
    const { result } = renderHook(
      () => useGhCommitCheckRuns('octocat', 'Hello-World', 'abc123', params),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(mockCheckRuns).toHaveBeenCalledWith(params, expect.anything());
  });

  it('returns error on failure', async () => {
    mockCheckRuns.mockRejectedValue(new GitHubApiError(401, 'Unauthorized'));
    const { result } = renderHook(() => useGhCommitCheckRuns('octocat', 'Hello-World', 'abc123'), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useGhCommitCheckRuns('octocat', 'Hello-World', 'abc123', undefined, { enabled: false }),
      { wrapper },
    );
    expect(result.current.isLoading).toBe(false);
    expect(mockCheckRuns).not.toHaveBeenCalled();
  });
  it('accepts queryOptions', async () => {
    mockCheckRuns.mockResolvedValue(mockResponse);
    const { result } = renderHook(
      () => useGhCommitCheckRuns('octocat', 'Hello-World', 'abc123', { queryOptions: { staleTime: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
