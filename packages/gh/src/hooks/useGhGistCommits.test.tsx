import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import {
  type GistCommit,
  GitHubApiError,
  GitHubClient,
  type GitHubPagedResponse,
} from 'gh-api-client';
import type { ReactNode } from 'react';
import { useGhGistCommits } from './useGhGistCommits.js';

const mockCommits =
  jest.fn<(params?: object, signal?: AbortSignal) => Promise<GitHubPagedResponse<GistCommit>>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(GitHubClient.prototype, 'gist').mockReturnValue({
    commits: mockCommits,
  } as unknown as ReturnType<GitHubClient['gist']>);
});

const mockResponse: GitHubPagedResponse<GistCommit> = {
  values: [
    {
      url: 'https://api.github.com/gists/abc123/commits',
      version: 'sha1',
      user: null,
      change_status: { total: 2, additions: 1, deletions: 1 },
      committed_at: '2024-01-01T00:00:00Z',
    },
  ],
  hasNextPage: false,
};

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhGistCommits', () => {
  it('returns data on success', async () => {
    mockCommits.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useGhGistCommits('abc123'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockResponse);
    expect(result.current.isError).toBe(false);
  });

  it('returns error on failure', async () => {
    mockCommits.mockRejectedValue(new GitHubApiError(404, 'Not Found'));

    const { result } = renderHook(() => useGhGistCommits('abc123'), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when gistId is empty', () => {
    const { result } = renderHook(() => useGhGistCommits(''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockCommits).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(() => useGhGistCommits('abc123', undefined, { enabled: false }), {
      wrapper,
    });

    expect(result.current.isLoading).toBe(false);
    expect(mockCommits).not.toHaveBeenCalled();
  });
});
