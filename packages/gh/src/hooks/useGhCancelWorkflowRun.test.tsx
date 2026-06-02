import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { GitHubApiError, GitHubClient } from 'gh-api-client';
import { useGhCancelWorkflowRun } from './useGhCancelWorkflowRun.js';

const mockCancelWorkflowRun = jest.fn<(runId: number) => Promise<void>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(GitHubClient.prototype, 'repo').mockReturnValue({
    cancelWorkflowRun: mockCancelWorkflowRun,
  } as unknown as ReturnType<GitHubClient['repo']>);
});

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhCancelWorkflowRun', () => {
  it('succeeds on cancel', async () => {
    mockCancelWorkflowRun.mockResolvedValue(undefined);

    const { result } = renderHook(() => useGhCancelWorkflowRun('owner', 'repo'), { wrapper });

    act(() => {
      result.current.mutate(42);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockCancelWorkflowRun).toHaveBeenCalledWith(42);
  });

  it('returns error on failure', async () => {
    mockCancelWorkflowRun.mockRejectedValue(new GitHubApiError(409, 'Conflict'));

    const { result } = renderHook(() => useGhCancelWorkflowRun('owner', 'repo'), { wrapper });

    act(() => {
      result.current.mutate(42);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('is idle before mutate is called', () => {
    const { result } = renderHook(() => useGhCancelWorkflowRun('owner', 'repo'), { wrapper });
    expect(result.current.isIdle).toBe(true);
  });
});
