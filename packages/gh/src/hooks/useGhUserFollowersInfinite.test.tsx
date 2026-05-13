import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GitHubClient, GitHubApiError, type GitHubPagedResponse, type GitHubUser } from 'gh-api-client';
import { useGhUserFollowersInfinite } from './useGhUserFollowersInfinite.js';

const mockFollowers = jest.fn<(params?: object, signal?: AbortSignal) => Promise<GitHubPagedResponse<GitHubUser>>>();
const mockUser = jest.fn().mockReturnValue({ followers: mockFollowers });

beforeEach(() => {
  jest.clearAllMocks();
  mockUser.mockReturnValue({ followers: mockFollowers });
  jest.spyOn(GitHubClient.prototype, 'user').mockImplementation(mockUser);
});

const mockFollower = { id: 1, login: 'follower1' } as unknown as GitHubUser;

function makeResponse(hasNextPage: boolean, nextPage?: number): GitHubPagedResponse<GitHubUser> {
  return { values: [mockFollower], hasNextPage, nextPage };
}

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhUserFollowersInfinite', () => {
  it('fetches the first page on mount', async () => {
    mockFollowers.mockResolvedValue(makeResponse(false));

    const { result } = renderHook(() => useGhUserFollowersInfinite('octocat'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data?.pages).toHaveLength(1);
    expect(result.current.data?.pages[0].values).toEqual([mockFollower]);
    expect(mockUser).toHaveBeenCalledWith('octocat');
    expect(mockFollowers).toHaveBeenCalledWith({ page: 1 }, expect.anything());
  });

  it('fetches the next page when fetchNextPage is called', async () => {
    mockFollowers
      .mockResolvedValueOnce(makeResponse(true, 2))
      .mockResolvedValueOnce(makeResponse(false));

    const { result } = renderHook(() => useGhUserFollowersInfinite('octocat'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    void result.current.fetchNextPage();

    await waitFor(() => expect(result.current.data?.pages).toHaveLength(2));

    expect(mockFollowers).toHaveBeenNthCalledWith(2, { page: 2 }, expect.anything());
  });

  it('reports hasNextPage correctly', async () => {
    mockFollowers.mockResolvedValue(makeResponse(true, 2));

    const { result } = renderHook(() => useGhUserFollowersInfinite('octocat'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.hasNextPage).toBe(true);
  });

  it('returns error on failure', async () => {
    mockFollowers.mockRejectedValue(new GitHubApiError(404, 'Not Found'));

    const { result } = renderHook(() => useGhUserFollowersInfinite('octocat'), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when login is empty', () => {
    const { result } = renderHook(() => useGhUserFollowersInfinite(''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockFollowers).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useGhUserFollowersInfinite('octocat', undefined, { enabled: false }),
      { wrapper }
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockFollowers).not.toHaveBeenCalled();
  });
});
