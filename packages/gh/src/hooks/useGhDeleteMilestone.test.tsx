import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { GitHubApiError, GitHubClient } from 'gh-api-client';
import type { ReactNode } from 'react';
import { useGhDeleteMilestone } from './useGhDeleteMilestone.js';

const mockDeleteMilestone = jest.fn<(number: number) => Promise<void>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(GitHubClient.prototype, 'repo').mockReturnValue({
    deleteMilestone: mockDeleteMilestone,
  } as unknown as ReturnType<GitHubClient['repo']>);
});

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhDeleteMilestone', () => {
  it('succeeds on delete', async () => {
    mockDeleteMilestone.mockResolvedValue(undefined);

    const { result } = renderHook(() => useGhDeleteMilestone('owner', 'repo'), { wrapper });

    act(() => {
      result.current.mutate(1);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockDeleteMilestone).toHaveBeenCalledWith(1);
  });

  it('returns error on failure', async () => {
    mockDeleteMilestone.mockRejectedValue(new GitHubApiError(404, 'Not Found'));

    const { result } = renderHook(() => useGhDeleteMilestone('owner', 'repo'), { wrapper });

    act(() => {
      result.current.mutate(99);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('is idle before mutate is called', () => {
    const { result } = renderHook(() => useGhDeleteMilestone('owner', 'repo'), { wrapper });
    expect(result.current.isIdle).toBe(true);
  });
});
