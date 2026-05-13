import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GitHubClient, GitHubApiError, type GitHubPagedResponse, type GitHubUser } from 'gh-api-client';
import { useGhUserFollowingInfinite } from './useGhUserFollowingInfinite.js';

const mockFollowing = jest.fn<(params?: object, signal?: AbortSignal) => Promise<GitHubPagedResponse<GitHubUser>>>();
const mockUser = jest.fn().mockReturnValue({ following: mockFollowing });

beforeEach(() => {
  jest.clearAllMocks();
  mockUser.mockReturnValue({ following: mockFollowing });
  jest.spyOn(GitHubClient.prototype, 'user').mockImplementation(mockUser);
});

const mockFollowed = { id: 2, login: 'following1' } as unknown as GitHubUser;

function makeResponse(hasNextPage: boolean, nextPage?: number): GitHubPagedResponse<GitHubUser> {
  return { values: [mockFollowed], hasNextPage, nextPage };
}

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhUserFollowingInfinite', () => {
  it('fetches the first page on mount', async () => {
    mockFollowing.mockResolvedValue(makeResponse(false));

    const { result } = renderHook(() => useGhUserFollowingInfinite('octocat'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data?.pages).toHaveLength(1);
    expect(result.current.data?.pages[0].values).toEqual([mockFollowed]);
    expect(mockUser).toHaveBeenCalledWith('octocat');
    expect(mockFollowing).toHaveBeenCalledWith({ page: 1 }, expect.anything());
  });

  it('fetches the next page when fetchNextPage is called', async () => {
    mockFollowing
      .mockResolvedValueOnce(makeResponse(true, 2))
      .mockResolvedValueOnce(makeResponse(false));

    const { result } = renderHook(() => useGhUserFollowingInfinite('octocat'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    void result.current.fetchNextPage();

    await waitFor(() => expect(result.current.data?.pages).toHaveLength(2));

    expect(mockFollowing).toHaveBeenNthCalledWith(2, { page: 2 }, expect.anything());
  });

  it('reports hasNextPage correctly', async () => {
    mockFollowing.mockResolvedValue(makeResponse(true, 2));

    const { result } = renderHook(() => useGhUserFollowingInfinite('octocat'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.hasNextPage).toBe(true);
  });

  it('returns error on failure', async () => {
    mockFollowing.mockRejectedValue(new GitHubApiError(404, 'Not Found'));

    const { result } = renderHook(() => useGhUserFollowingInfinite('octocat'), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when login is empty', () => {
    const { result } = renderHook(() => useGhUserFollowingInfinite(''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockFollowing).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useGhUserFollowingInfinite('octocat', undefined, { enabled: false }),
      { wrapper }
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockFollowing).not.toHaveBeenCalled();
  });
});
