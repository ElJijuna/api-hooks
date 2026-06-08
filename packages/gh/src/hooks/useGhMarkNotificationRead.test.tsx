import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { GitHubApiError, GitHubClient } from 'gh-api-client';
import type { ReactNode } from 'react';
import { useGhMarkNotificationRead } from './useGhMarkNotificationRead.js';

const mockMarkRead = jest.fn<(threadId: string) => Promise<void>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(GitHubClient.prototype, 'markNotificationRead').mockImplementation(mockMarkRead);
});

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhMarkNotificationRead', () => {
  it('succeeds on valid thread id', async () => {
    mockMarkRead.mockResolvedValue(undefined);
    const { result } = renderHook(() => useGhMarkNotificationRead(), { wrapper });
    act(() => {
      result.current.mutate('123456789');
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockMarkRead).toHaveBeenCalledWith('123456789');
  });

  it('returns error on failure', async () => {
    mockMarkRead.mockRejectedValue(new GitHubApiError(422, 'Unprocessable Entity'));
    const { result } = renderHook(() => useGhMarkNotificationRead(), { wrapper });
    act(() => {
      result.current.mutate('123456789');
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('is idle before mutate is called', () => {
    const { result } = renderHook(() => useGhMarkNotificationRead(), { wrapper });
    expect(result.current.isIdle).toBe(true);
  });
});
