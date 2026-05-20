import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GitHubClient, GitHubApiError } from 'gh-api-client';
import { useGhMarkAllNotificationsRead } from './useGhMarkAllNotificationsRead.js';

const mockMarkAllRead = jest.fn<() => Promise<void>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(GitHubClient.prototype, 'markAllNotificationsRead').mockImplementation(mockMarkAllRead);
});

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhMarkAllNotificationsRead', () => {
  it('succeeds when called', async () => {
    mockMarkAllRead.mockResolvedValue(undefined);
    const { result } = renderHook(() => useGhMarkAllNotificationsRead(), { wrapper });
    act(() => { result.current.mutate(); });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockMarkAllRead).toHaveBeenCalled();
  });

  it('returns error on failure', async () => {
    mockMarkAllRead.mockRejectedValue(new GitHubApiError(401, 'Unauthorized'));
    const { result } = renderHook(() => useGhMarkAllNotificationsRead(), { wrapper });
    act(() => { result.current.mutate(); });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('is idle before mutate is called', () => {
    const { result } = renderHook(() => useGhMarkAllNotificationsRead(), { wrapper });
    expect(result.current.isIdle).toBe(true);
  });
});
