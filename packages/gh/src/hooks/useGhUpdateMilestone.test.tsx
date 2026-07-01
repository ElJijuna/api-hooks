import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import {
  GitHubApiError,
  GitHubClient,
  type GitHubMilestone,
  type UpdateMilestoneData,
} from 'gh-api-client';
import type { ReactNode } from 'react';
import { useGhUpdateMilestone } from './useGhUpdateMilestone.js';

const mockUpdateMilestone =
  jest.fn<(number: number, data: UpdateMilestoneData) => Promise<GitHubMilestone>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(GitHubClient.prototype, 'repo').mockReturnValue({
    updateMilestone: mockUpdateMilestone,
  } as unknown as ReturnType<GitHubClient['repo']>);
});

const mockMilestone = {
  id: 1,
  number: 1,
  title: 'v1.0',
  state: 'closed',
} as unknown as GitHubMilestone;

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhUpdateMilestone', () => {
  it('returns updated milestone on success', async () => {
    mockUpdateMilestone.mockResolvedValue(mockMilestone);

    const { result } = renderHook(() => useGhUpdateMilestone('owner', 'repo'), { wrapper });

    act(() => {
      result.current.mutate({ milestoneNumber: 1, data: { state: 'closed' } });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockMilestone);
    expect(mockUpdateMilestone).toHaveBeenCalledWith(1, { state: 'closed' });
  });

  it('returns error on failure', async () => {
    mockUpdateMilestone.mockRejectedValue(new GitHubApiError(404, 'Not Found'));

    const { result } = renderHook(() => useGhUpdateMilestone('owner', 'repo'), { wrapper });

    act(() => {
      result.current.mutate({ milestoneNumber: 99, data: { title: 'New' } });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('is idle before mutate is called', () => {
    const { result } = renderHook(() => useGhUpdateMilestone('owner', 'repo'), { wrapper });
    expect(result.current.isIdle).toBe(true);
  });
  it('accepts mutationOptions', async () => {
    mockUpdateMilestone.mockResolvedValue(mockMilestone);
    const onSuccess = jest.fn();
    const { result } = renderHook(
      () => useGhUpdateMilestone('owner', 'repo', { mutationOptions: { onSuccess } }),
      { wrapper },
    );
    act(() => {
      result.current.mutate({ milestoneNumber: 1, data: { state: 'closed' } });
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(onSuccess).toHaveBeenCalled();
  });
});
