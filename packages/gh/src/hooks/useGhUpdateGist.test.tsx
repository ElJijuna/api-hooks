import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GitHubClient, GitHubApiError, type GitHubGist, type UpdateGistData } from 'gh-api-client';
import { useGhUpdateGist } from './useGhUpdateGist.js';

const mockUpdate = jest.fn<(data: UpdateGistData, signal?: AbortSignal) => Promise<GitHubGist>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .spyOn(GitHubClient.prototype, 'gist')
    .mockReturnValue({
      update: mockUpdate,
    } as unknown as ReturnType<GitHubClient['gist']>);
});

const mockGist: GitHubGist = {
  id: 'abc123',
  description: 'Updated gist',
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
  updated_at: '2024-01-02T00:00:00Z',
  node_id: 'G_abc123',
};

const updateData: UpdateGistData = { description: 'Updated gist' };

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhUpdateGist', () => {
  it('returns updated gist on success', async () => {
    mockUpdate.mockResolvedValue(mockGist);

    const { result } = renderHook(() => useGhUpdateGist('abc123'), { wrapper });

    act(() => { result.current.mutate(updateData); });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockGist);
    expect(mockUpdate).toHaveBeenCalledWith(updateData);
  });

  it('returns error on failure', async () => {
    mockUpdate.mockRejectedValue(new GitHubApiError(404, 'Not Found'));

    const { result } = renderHook(() => useGhUpdateGist('abc123'), { wrapper });

    act(() => { result.current.mutate(updateData); });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('is idle before mutate is called', () => {
    const { result } = renderHook(() => useGhUpdateGist('abc123'), { wrapper });

    expect(result.current.isIdle).toBe(true);
    expect(mockUpdate).not.toHaveBeenCalled();
  });
});
