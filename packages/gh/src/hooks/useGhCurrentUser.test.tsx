import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GitHubClient, GitHubApiError, type GitHubUser } from 'gh-api-client';
import { useGhCurrentUser } from './useGhCurrentUser.js';

const mockCurrentUser = jest.fn<(signal?: AbortSignal) => Promise<GitHubUser>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .spyOn(GitHubClient.prototype, 'currentUser')
    .mockImplementation(mockCurrentUser);
});

const mockUser: GitHubUser = {
  id: 1,
  login: 'octocat',
  avatar_url: 'https://avatars.githubusercontent.com/u/1',
  html_url: 'https://github.com/octocat',
  type: 'User',
  site_admin: false,
  node_id: 'U_1',
  url: 'https://api.github.com/users/octocat',
};

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhCurrentUser', () => {
  it('returns data on success', async () => {
    mockCurrentUser.mockResolvedValue(mockUser);

    const { result } = renderHook(() => useGhCurrentUser({ token: 'token' }), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockUser);
    expect(result.current.isError).toBe(false);
  });

  it('returns error on failure', async () => {
    mockCurrentUser.mockRejectedValue(new GitHubApiError(401, 'Unauthorized'));

    const { result } = renderHook(() => useGhCurrentUser({ token: 'bad-token' }), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useGhCurrentUser({ enabled: false }),
      { wrapper }
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockCurrentUser).not.toHaveBeenCalled();
  });
});
