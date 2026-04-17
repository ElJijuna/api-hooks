import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GitHubClient, GitHubApiError, type GitHubGist, type CreateGistData } from 'gh-api-client';
import { useGhCreateGist } from './useGhCreateGist.js';

const mockCreateGist = jest.fn<(data: CreateGistData, signal?: AbortSignal) => Promise<GitHubGist>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .spyOn(GitHubClient.prototype, 'createGist')
    .mockImplementation(mockCreateGist);
});

const mockGist: GitHubGist = {
  id: 'abc123',
  description: 'A test gist',
  public: true,
  owner: null,
  user: null,
  files: { 'hello.txt': { filename: 'hello.txt', type: 'text/plain', language: 'Text', raw_url: '', size: 5, truncated: false, content: 'hello' } },
  comments: 0,
  comments_url: 'https://api.github.com/gists/abc123/comments',
  html_url: 'https://gist.github.com/abc123',
  git_pull_url: 'https://gist.github.com/abc123.git',
  git_push_url: 'https://gist.github.com/abc123.git',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  node_id: 'G_abc123',
};

const createData: CreateGistData = {
  files: { 'hello.txt': { content: 'hello' } },
  description: 'A test gist',
  public: true,
};

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhCreateGist', () => {
  it('returns created gist on success', async () => {
    mockCreateGist.mockResolvedValue(mockGist);

    const { result } = renderHook(() => useGhCreateGist(), { wrapper });

    act(() => {
      result.current.mutate(createData);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockGist);
    expect(mockCreateGist).toHaveBeenCalledWith(createData);
  });

  it('returns error on failure', async () => {
    mockCreateGist.mockRejectedValue(new GitHubApiError(422, 'Unprocessable Entity'));

    const { result } = renderHook(() => useGhCreateGist(), { wrapper });

    act(() => {
      result.current.mutate(createData);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('is idle before mutate is called', () => {
    const { result } = renderHook(() => useGhCreateGist(), { wrapper });

    expect(result.current.isIdle).toBe(true);
    expect(mockCreateGist).not.toHaveBeenCalled();
  });
});
