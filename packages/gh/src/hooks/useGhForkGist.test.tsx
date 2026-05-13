import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GitHubClient, GitHubApiError, type GitHubGist } from 'gh-api-client';
import { useGhForkGist } from './useGhForkGist.js';

const mockFork = jest.fn<(signal?: AbortSignal) => Promise<GitHubGist>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .spyOn(GitHubClient.prototype, 'gist')
    .mockReturnValue({
      fork: mockFork,
    } as unknown as ReturnType<GitHubClient['gist']>);
});

const mockGist: GitHubGist = {
  id: 'fork123',
  description: 'Forked gist',
  public: true,
  owner: null,
  user: null,
  files: {},
  comments: 0,
  comments_url: 'https://api.github.com/gists/fork123/comments',
  html_url: 'https://gist.github.com/fork123',
  git_pull_url: 'https://gist.github.com/fork123.git',
  git_push_url: 'https://gist.github.com/fork123.git',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  node_id: 'G_fork123',
};

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhForkGist', () => {
  it('returns forked gist on success', async () => {
    mockFork.mockResolvedValue(mockGist);

    const { result } = renderHook(() => useGhForkGist('abc123'), { wrapper });

    act(() => {
      result.current.mutate();
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockGist);
    expect(mockFork).toHaveBeenCalled();
  });

  it('returns error on failure', async () => {
    mockFork.mockRejectedValue(new GitHubApiError(422, 'Unprocessable Entity'));

    const { result } = renderHook(() => useGhForkGist('abc123'), { wrapper });

    act(() => {
      result.current.mutate();
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('is idle before mutate is called', () => {
    const { result } = renderHook(() => useGhForkGist('abc123'), { wrapper });

    expect(result.current.isIdle).toBe(true);
  });
});
