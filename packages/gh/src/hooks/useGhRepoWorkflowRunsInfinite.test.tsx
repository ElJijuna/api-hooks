import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { GitHubApiError, GitHubClient, type GitHubWorkflowRunsResponse } from 'gh-api-client';
import type { ReactNode } from 'react';
import { useGhRepoWorkflowRunsInfinite } from './useGhRepoWorkflowRunsInfinite.js';

const mockWorkflowRuns =
  jest.fn<(params?: object, signal?: AbortSignal) => Promise<GitHubWorkflowRunsResponse>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(GitHubClient.prototype, 'repo').mockReturnValue({
    workflowRuns: mockWorkflowRuns,
  } as unknown as ReturnType<GitHubClient['repo']>);
});

const mockRun = {
  id: 1,
  name: 'CI',
  run_number: 42,
  status: 'completed',
  conclusion: 'success',
} as unknown as GitHubWorkflowRunsResponse['workflow_runs'][0];
const mockResponse: GitHubWorkflowRunsResponse = { total_count: 1, workflow_runs: [mockRun] };

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhRepoWorkflowRunsInfinite', () => {
  it('returns data on success', async () => {
    mockWorkflowRuns.mockResolvedValue(mockResponse);
    const { result } = renderHook(() => useGhRepoWorkflowRunsInfinite('octocat', 'Hello-World'), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data?.pages[0]).toEqual(mockResponse);
    expect(result.current.isError).toBe(false);
  });

  it('passes params to the client', async () => {
    mockWorkflowRuns.mockResolvedValue(mockResponse);
    const params = { per_page: 10, status: 'completed' as const };
    const { result } = renderHook(
      () => useGhRepoWorkflowRunsInfinite('octocat', 'Hello-World', params),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(mockWorkflowRuns).toHaveBeenCalledWith({ ...params, page: 1 }, expect.anything());
  });

  it('returns error on failure', async () => {
    mockWorkflowRuns.mockRejectedValue(new GitHubApiError(401, 'Unauthorized'));
    const { result } = renderHook(() => useGhRepoWorkflowRunsInfinite('octocat', 'Hello-World'), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when owner is empty', () => {
    const { result } = renderHook(() => useGhRepoWorkflowRunsInfinite('', 'Hello-World'), {
      wrapper,
    });
    expect(result.current.isLoading).toBe(false);
    expect(mockWorkflowRuns).not.toHaveBeenCalled();
  });

  it('does not fetch when repo is empty', () => {
    const { result } = renderHook(() => useGhRepoWorkflowRunsInfinite('octocat', ''), { wrapper });
    expect(result.current.isLoading).toBe(false);
    expect(mockWorkflowRuns).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useGhRepoWorkflowRunsInfinite('octocat', 'Hello-World', undefined, { enabled: false }),
      { wrapper },
    );
    expect(result.current.isLoading).toBe(false);
    expect(mockWorkflowRuns).not.toHaveBeenCalled();
  });
});
