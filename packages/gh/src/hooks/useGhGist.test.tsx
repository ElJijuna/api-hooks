import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GitHubClient, GitHubApiError, type GitHubGist } from 'gh-api-client';
import { useGhGist } from './useGhGist.js';

const mockGet = jest.fn<(signal?: AbortSignal) => Promise<GitHubGist>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .spyOn(GitHubClient.prototype, 'gist')
    .mockReturnValue({
      get: mockGet,
    } as unknown as ReturnType<GitHubClient['gist']>);
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

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhGist', () => {
  it('returns data on success', async () => {
    mockGet.mockResolvedValue(mockGist);

    const { result } = renderHook(() => useGhGist('abc123'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockGist);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
    expect(mockGet).toHaveBeenCalledWith(expect.anything());
  });

  it('returns error on failure', async () => {
    mockGet.mockRejectedValue(new GitHubApiError(404, 'Not Found'));

    const { result } = renderHook(() => useGhGist('nonexistent'), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when gistId is empty', () => {
    const { result } = renderHook(() => useGhGist(''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockGet).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useGhGist('abc123', { enabled: false }),
      { wrapper }
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockGet).not.toHaveBeenCalled();
  });
});
