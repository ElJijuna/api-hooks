import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GitHubClient, GitHubApiError, type GitHubPagedResponse, type GitHubWebhook } from 'gh-api-client';
import { useGhRepoWebhooksInfinite } from './useGhRepoWebhooksInfinite.js';

const mockWebhooks = jest.fn<(params?: object, signal?: AbortSignal) => Promise<GitHubPagedResponse<GitHubWebhook>>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(GitHubClient.prototype, 'repo').mockReturnValue({
    webhooks: mockWebhooks,
  } as unknown as ReturnType<GitHubClient['repo']>);
});

const mockWebhook = { id: 1, type: 'Repository', active: true, events: ['push'] } as unknown as GitHubWebhook;

function makeResponse(hasNextPage: boolean, nextPage?: number): GitHubPagedResponse<GitHubWebhook> {
  return { values: [mockWebhook], hasNextPage, nextPage };
}

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhRepoWebhooksInfinite', () => {
  it('fetches the first page on mount', async () => {
    mockWebhooks.mockResolvedValue(makeResponse(false));

    const { result } = renderHook(() => useGhRepoWebhooksInfinite('octocat', 'Hello-World'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data?.pages).toHaveLength(1);
    expect(result.current.data?.pages[0].values).toEqual([mockWebhook]);
    expect(mockWebhooks).toHaveBeenCalledWith({ page: 1 }, expect.anything());
  });

  it('fetches the next page when fetchNextPage is called', async () => {
    mockWebhooks
      .mockResolvedValueOnce(makeResponse(true, 2))
      .mockResolvedValueOnce(makeResponse(false));

    const { result } = renderHook(() => useGhRepoWebhooksInfinite('octocat', 'Hello-World'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    void result.current.fetchNextPage();

    await waitFor(() => expect(result.current.data?.pages).toHaveLength(2));

    expect(mockWebhooks).toHaveBeenNthCalledWith(2, { page: 2 }, expect.anything());
  });

  it('reports hasNextPage correctly', async () => {
    mockWebhooks.mockResolvedValue(makeResponse(true, 2));

    const { result } = renderHook(() => useGhRepoWebhooksInfinite('octocat', 'Hello-World'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.hasNextPage).toBe(true);
  });

  it('returns error on failure', async () => {
    mockWebhooks.mockRejectedValue(new GitHubApiError(403, 'Forbidden'));

    const { result } = renderHook(() => useGhRepoWebhooksInfinite('octocat', 'Hello-World'), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when owner is empty', () => {
    const { result } = renderHook(() => useGhRepoWebhooksInfinite('', 'Hello-World'), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockWebhooks).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useGhRepoWebhooksInfinite('octocat', 'Hello-World', undefined, { enabled: false }),
      { wrapper }
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockWebhooks).not.toHaveBeenCalled();
  });
});
