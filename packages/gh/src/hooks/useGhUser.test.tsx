import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GitHubClient, GitHubApiError, type GitHubUser } from 'gh-api-client';
import { useGhUser } from './useGhUser.js';

const mockGet = jest.fn<(signal?: AbortSignal) => Promise<GitHubUser>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .spyOn(GitHubClient.prototype, 'user')
    .mockReturnValue({
      get: mockGet,
    } as unknown as ReturnType<GitHubClient['user']>);
});

const mockUser: GitHubUser = {
  id: 1,
  login: 'octocat',
  name: 'The Octocat',
  email: null,
  avatar_url: 'https://github.com/images/error/octocat_happy.gif',
  html_url: 'https://github.com/octocat',
  type: 'User',
  site_admin: false,
};

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhUser', () => {
  it('returns data on success', async () => {
    mockGet.mockResolvedValue(mockUser);

    const { result } = renderHook(() => useGhUser('octocat'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockUser);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
    expect(mockGet).toHaveBeenCalledWith(expect.anything());
  });

  it('returns error on failure', async () => {
    mockGet.mockRejectedValue(new GitHubApiError(404, 'Not Found'));

    const { result } = renderHook(() => useGhUser('nonexistent-user-xyz'), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when login is empty', () => {
    const { result } = renderHook(() => useGhUser(''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockGet).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useGhUser('octocat', { enabled: false }),
      { wrapper }
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockGet).not.toHaveBeenCalled();
  });
});
