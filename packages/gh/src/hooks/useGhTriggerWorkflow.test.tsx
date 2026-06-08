import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { GitHubApiError, GitHubClient, type TriggerWorkflowData } from 'gh-api-client';
import type { ReactNode } from 'react';
import { useGhTriggerWorkflow } from './useGhTriggerWorkflow.js';

const mockTriggerWorkflow =
  jest.fn<(id: number | string, data: TriggerWorkflowData) => Promise<void>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(GitHubClient.prototype, 'repo').mockReturnValue({
    triggerWorkflow: mockTriggerWorkflow,
  } as unknown as ReturnType<GitHubClient['repo']>);
});

const triggerData: TriggerWorkflowData = { ref: 'main' };

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhTriggerWorkflow', () => {
  it('triggers by numeric workflow ID', async () => {
    mockTriggerWorkflow.mockResolvedValue(undefined);

    const { result } = renderHook(() => useGhTriggerWorkflow('owner', 'repo'), { wrapper });

    act(() => {
      result.current.mutate({ workflowId: 1, data: triggerData });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockTriggerWorkflow).toHaveBeenCalledWith(1, triggerData);
  });

  it('triggers by string workflow file name', async () => {
    mockTriggerWorkflow.mockResolvedValue(undefined);

    const { result } = renderHook(() => useGhTriggerWorkflow('owner', 'repo'), { wrapper });

    act(() => {
      result.current.mutate({ workflowId: 'ci.yml', data: triggerData });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockTriggerWorkflow).toHaveBeenCalledWith('ci.yml', triggerData);
  });

  it('returns error on failure', async () => {
    mockTriggerWorkflow.mockRejectedValue(new GitHubApiError(422, 'Unprocessable Entity'));

    const { result } = renderHook(() => useGhTriggerWorkflow('owner', 'repo'), { wrapper });

    act(() => {
      result.current.mutate({ workflowId: 1, data: triggerData });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('is idle before mutate is called', () => {
    const { result } = renderHook(() => useGhTriggerWorkflow('owner', 'repo'), { wrapper });
    expect(result.current.isIdle).toBe(true);
  });
});
