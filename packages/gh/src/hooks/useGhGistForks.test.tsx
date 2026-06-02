import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import {
  type GistFork,
  GitHubApiError,
  GitHubClient,
  type GitHubPagedResponse,
  type GitHubUser,
} from 'gh-api-client';
import { useGhGistForks } from './useGhGistForks.js';

const mockForks =
  jest.fn<(params?: object, signal?: AbortSignal) => Promise<GitHubPagedResponse<GistFork>>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(GitHubClient.prototype, 'gist').mockReturnValue({
    forks: mockForks,
  } as unknown as ReturnType<GitHubClient['gist']>);
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

const mockResponse: GitHubPagedResponse<GistFork> = {
  values: [
    {
      id: 'fork123',
      user: mockUser,
      html_url: 'https://gist.github.com/fork123',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
  ],
  hasNextPage: false,
};

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhGistForks', () => {
  it('returns data on success', async () => {
    mockForks.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useGhGistForks('abc123'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockResponse);
    expect(result.current.isError).toBe(false);
  });

  it('returns error on failure', async () => {
    mockForks.mockRejectedValue(new GitHubApiError(404, 'Not Found'));

    const { result } = renderHook(() => useGhGistForks('abc123'), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when gistId is empty', () => {
    const { result } = renderHook(() => useGhGistForks(''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockForks).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(() => useGhGistForks('abc123', undefined, { enabled: false }), {
      wrapper,
    });

    expect(result.current.isLoading).toBe(false);
    expect(mockForks).not.toHaveBeenCalled();
  });
});
