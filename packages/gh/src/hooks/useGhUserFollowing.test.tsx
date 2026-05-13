import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GitHubClient, GitHubApiError, type GitHubPagedResponse, type GitHubUser } from 'gh-api-client';
import { useGhUserFollowing } from './useGhUserFollowing.js';

const mockFollowing = jest.fn<(params?: object, signal?: AbortSignal) => Promise<GitHubPagedResponse<GitHubUser>>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .spyOn(GitHubClient.prototype, 'user')
    .mockReturnValue({
      following: mockFollowing,
    } as unknown as ReturnType<GitHubClient['user']>);
});

const mockResponse: GitHubPagedResponse<GitHubUser> = {
  values: [
    {
      id: 3,
      login: 'following-user',
      avatar_url: 'https://avatars.githubusercontent.com/u/3',
      html_url: 'https://github.com/following-user',
      type: 'User',
      site_admin: false,
      node_id: 'U_3',
      url: 'https://api.github.com/users/following-user',
    },
  ],
  hasNextPage: false,
};

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhUserFollowing', () => {
  it('returns data on success', async () => {
    mockFollowing.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useGhUserFollowing('octocat'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockResponse);
    expect(result.current.isError).toBe(false);
  });

  it('returns error on failure', async () => {
    mockFollowing.mockRejectedValue(new GitHubApiError(404, 'Not Found'));

    const { result } = renderHook(() => useGhUserFollowing('octocat'), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when login is empty', () => {
    const { result } = renderHook(() => useGhUserFollowing(''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockFollowing).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useGhUserFollowing('octocat', undefined, { enabled: false }),
      { wrapper }
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockFollowing).not.toHaveBeenCalled();
  });
});
