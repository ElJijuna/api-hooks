import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import {
  GitHubApiError,
  GitHubClient,
  type GitHubPagedResponse,
  type GitHubUser,
} from 'gh-api-client';
import type { ReactNode } from 'react';
import { useGhUserFollowers } from './useGhUserFollowers.js';

const mockFollowers =
  jest.fn<(params?: object, signal?: AbortSignal) => Promise<GitHubPagedResponse<GitHubUser>>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(GitHubClient.prototype, 'user').mockReturnValue({
    followers: mockFollowers,
  } as unknown as ReturnType<GitHubClient['user']>);
});

const mockResponse: GitHubPagedResponse<GitHubUser> = {
  values: [
    {
      id: 2,
      login: 'follower',
      avatar_url: 'https://avatars.githubusercontent.com/u/2',
      html_url: 'https://github.com/follower',
      type: 'User',
      site_admin: false,
      node_id: 'U_2',
      url: 'https://api.github.com/users/follower',
    },
  ],
  hasNextPage: false,
};

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhUserFollowers', () => {
  it('returns data on success', async () => {
    mockFollowers.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useGhUserFollowers('octocat'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockResponse);
    expect(result.current.isError).toBe(false);
  });

  it('returns error on failure', async () => {
    mockFollowers.mockRejectedValue(new GitHubApiError(404, 'Not Found'));

    const { result } = renderHook(() => useGhUserFollowers('octocat'), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when login is empty', () => {
    const { result } = renderHook(() => useGhUserFollowers(''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockFollowers).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useGhUserFollowers('octocat', undefined, { enabled: false }),
      { wrapper },
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockFollowers).not.toHaveBeenCalled();
  });
  it('accepts queryOptions', async () => {
    mockFollowers.mockResolvedValue(mockResponse);
    const { result } = renderHook(
      () => useGhUserFollowers('octocat', { queryOptions: { staleTime: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
