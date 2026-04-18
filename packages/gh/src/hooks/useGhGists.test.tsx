import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GitHubClient, GitHubApiError, type GitHubGist, type GitHubPagedResponse } from 'gh-api-client';
import { useGhGists } from './useGhGists.js';

const mockListGists = jest.fn<(params?: object, signal?: AbortSignal) => Promise<GitHubPagedResponse<GitHubGist>>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .spyOn(GitHubClient.prototype, 'listGists')
    .mockImplementation(mockListGists);
});

const mockGist: GitHubGist = {
  id: 'abc123',
  description: 'A test gist',
  public: true,
  owner: null,
  user: null,
  files: {},
  comments: 0,
  comments_url: 'https://api.github.com/gists/abc123/comments',
  html_url: 'https://gist.github.com/abc123',
  git_pull_url: 'https://gist.github.com/abc123.git',
  git_push_url: 'https://gist.github.com/abc123.git',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  node_id: 'G_abc123',
};

const mockResponse: GitHubPagedResponse<GitHubGist> = {
  values: [mockGist],
  hasNextPage: false,
};

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhGists', () => {
  it('returns data on success', async () => {
    mockListGists.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useGhGists(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockResponse);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
    expect(mockListGists).toHaveBeenCalledWith(undefined, expect.anything());
  });

  it('passes params to the client', async () => {
    mockListGists.mockResolvedValue(mockResponse);

    const params = { per_page: 10, page: 2, since: '2024-01-01T00:00:00Z' };
    const { result } = renderHook(() => useGhGists(params), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(mockListGists).toHaveBeenCalledWith(params, expect.anything());
  });

  it('returns error on failure', async () => {
    mockListGists.mockRejectedValue(new GitHubApiError(401, 'Unauthorized'));

    const { result } = renderHook(() => useGhGists(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(() => useGhGists(undefined, { enabled: false }), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockListGists).not.toHaveBeenCalled();
  });
});
