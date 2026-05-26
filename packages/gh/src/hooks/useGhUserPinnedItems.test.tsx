import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GitHubClient, GitHubApiError, type PinnedItem } from 'gh-api-client';
import { useGhUserPinnedItems } from './useGhUserPinnedItems.js';

const mockPinnedItems = jest.fn<(signal?: AbortSignal) => Promise<PinnedItem[]>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .spyOn(GitHubClient.prototype, 'user')
    .mockReturnValue({
      pinnedItems: mockPinnedItems,
    } as unknown as ReturnType<GitHubClient['user']>);
});

const mockItems: PinnedItem[] = [{ nameWithOwner: 'octocat/Hello-World', description: 'My World', url: 'https://github.com/octocat/Hello-World', stargazerCount: 100, primaryLanguage: { name: 'JavaScript' } }];

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhUserPinnedItems', () => {
  it('returns data on success', async () => {
    mockPinnedItems.mockResolvedValue(mockItems);
    const { result } = renderHook(() => useGhUserPinnedItems('octocat'), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual(mockItems);
    expect(result.current.isError).toBe(false);
  });

  it('returns error on failure', async () => {
    mockPinnedItems.mockRejectedValue(new GitHubApiError(401, 'Unauthorized'));
    const { result } = renderHook(() => useGhUserPinnedItems('octocat'), { wrapper });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when login is empty', () => {
    const { result } = renderHook(() => useGhUserPinnedItems(''), { wrapper });
    expect(result.current.isLoading).toBe(false);
    expect(mockPinnedItems).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(() => useGhUserPinnedItems('octocat', { enabled: false }), { wrapper });
    expect(result.current.isLoading).toBe(false);
    expect(mockPinnedItems).not.toHaveBeenCalled();
  });
});
