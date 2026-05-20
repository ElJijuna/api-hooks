import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GitHubClient, GitHubApiError, type GitHubNotification, type GitHubPagedResponse } from 'gh-api-client';
import { useGhNotificationsInfinite } from './useGhNotificationsInfinite.js';

const mockNotifications = jest.fn<(params?: object, signal?: AbortSignal) => Promise<GitHubPagedResponse<GitHubNotification>>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(GitHubClient.prototype, 'notifications').mockImplementation(mockNotifications);
});

const mockNotification = { id: '1', unread: true, reason: 'mention' } as unknown as GitHubNotification;
const mockResponse: GitHubPagedResponse<GitHubNotification> = { values: [mockNotification], hasNextPage: false };

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhNotificationsInfinite', () => {
  it('returns data on success', async () => {
    mockNotifications.mockResolvedValue(mockResponse);
    const { result } = renderHook(() => useGhNotificationsInfinite(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data?.pages[0]).toEqual(mockResponse);
    expect(result.current.isError).toBe(false);
  });

  it('passes params to the client', async () => {
    mockNotifications.mockResolvedValue(mockResponse);
    const params = { all: true, per_page: 10 };
    const { result } = renderHook(() => useGhNotificationsInfinite(params), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(mockNotifications).toHaveBeenCalledWith({ ...params, page: 1 }, expect.anything());
  });

  it('returns error on failure', async () => {
    mockNotifications.mockRejectedValue(new GitHubApiError(401, 'Unauthorized'));
    const { result } = renderHook(() => useGhNotificationsInfinite(), { wrapper });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(() => useGhNotificationsInfinite(undefined, { enabled: false }), { wrapper });
    expect(result.current.isLoading).toBe(false);
    expect(mockNotifications).not.toHaveBeenCalled();
  });
});
