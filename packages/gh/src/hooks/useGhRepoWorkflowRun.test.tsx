import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { GitHubApiError, GitHubClient, type GitHubWorkflowRun } from 'gh-api-client';
import type { ReactNode } from 'react';
import { useGhRepoWorkflowRun } from './useGhRepoWorkflowRun.js';

const mockWorkflowRun =
  jest.fn<(runId: number, signal?: AbortSignal) => Promise<GitHubWorkflowRun>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(GitHubClient.prototype, 'repo').mockReturnValue({
    workflowRun: mockWorkflowRun,
  } as unknown as ReturnType<GitHubClient['repo']>);
});

const mockRun = {
  id: 42,
  name: 'CI',
  status: 'completed',
  conclusion: 'success',
  run_number: 1,
  workflow_id: 1,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  html_url: '',
} as unknown as GitHubWorkflowRun;

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhRepoWorkflowRun', () => {
  it('returns data on success', async () => {
    mockWorkflowRun.mockResolvedValue(mockRun);
    const { result } = renderHook(() => useGhRepoWorkflowRun('owner', 'repo', 42), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual(mockRun);
    expect(mockWorkflowRun).toHaveBeenCalledWith(42, expect.anything());
  });

  it('returns error on failure', async () => {
    mockWorkflowRun.mockRejectedValue(new GitHubApiError(404, 'Not Found'));
    const { result } = renderHook(() => useGhRepoWorkflowRun('owner', 'repo', 42), { wrapper });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when owner is empty', () => {
    const { result } = renderHook(() => useGhRepoWorkflowRun('', 'repo', 42), { wrapper });
    expect(result.current.isLoading).toBe(false);
    expect(mockWorkflowRun).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useGhRepoWorkflowRun('owner', 'repo', 42, { enabled: false }),
      { wrapper },
    );
    expect(result.current.isLoading).toBe(false);
    expect(mockWorkflowRun).not.toHaveBeenCalled();
  });
  it('accepts queryOptions', async () => {
    mockWorkflowRun.mockResolvedValue(mockRun);
    const { result } = renderHook(
      () => useGhRepoWorkflowRun('owner', 'repo', 42, { queryOptions: { staleTime: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
