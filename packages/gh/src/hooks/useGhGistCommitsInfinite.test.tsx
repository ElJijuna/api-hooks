import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import {
  type GistCommit,
  GitHubApiError,
  GitHubClient,
  type GitHubPagedResponse,
} from 'gh-api-client';
import { useGhGistCommitsInfinite } from './useGhGistCommitsInfinite.js';

const mockCommits =
  jest.fn<(params?: object, signal?: AbortSignal) => Promise<GitHubPagedResponse<GistCommit>>>();
const mockGist = jest.fn().mockReturnValue({ commits: mockCommits });

beforeEach(() => {
  jest.clearAllMocks();
  mockGist.mockReturnValue({ commits: mockCommits });
  jest.spyOn(GitHubClient.prototype, 'gist').mockImplementation(mockGist);
});

const mockCommit = {
  version: 'abc123',
  committed_at: '2024-01-01T00:00:00Z',
  user: null,
} as unknown as GistCommit;

function makeResponse(hasNextPage: boolean, nextPage?: number): GitHubPagedResponse<GistCommit> {
  return { values: [mockCommit], hasNextPage, nextPage };
}

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhGistCommitsInfinite', () => {
  it('fetches the first page on mount', async () => {
    mockCommits.mockResolvedValue(makeResponse(false));

    const { result } = renderHook(() => useGhGistCommitsInfinite('abc123'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data?.pages).toHaveLength(1);
    expect(result.current.data?.pages[0].values).toEqual([mockCommit]);
    expect(mockGist).toHaveBeenCalledWith('abc123');
    expect(mockCommits).toHaveBeenCalledWith({ page: 1 }, expect.anything());
  });

  it('fetches the next page when fetchNextPage is called', async () => {
    mockCommits
      .mockResolvedValueOnce(makeResponse(true, 2))
      .mockResolvedValueOnce(makeResponse(false));

    const { result } = renderHook(() => useGhGistCommitsInfinite('abc123'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    void result.current.fetchNextPage();

    await waitFor(() => expect(result.current.data?.pages).toHaveLength(2));

    expect(mockCommits).toHaveBeenNthCalledWith(2, { page: 2 }, expect.anything());
  });

  it('reports hasNextPage correctly', async () => {
    mockCommits.mockResolvedValue(makeResponse(true, 2));

    const { result } = renderHook(() => useGhGistCommitsInfinite('abc123'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.hasNextPage).toBe(true);
  });

  it('returns error on failure', async () => {
    mockCommits.mockRejectedValue(new GitHubApiError(404, 'Not Found'));

    const { result } = renderHook(() => useGhGistCommitsInfinite('abc123'), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when gistId is empty', () => {
    const { result } = renderHook(() => useGhGistCommitsInfinite(''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockCommits).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useGhGistCommitsInfinite('abc123', undefined, { enabled: false }),
      { wrapper },
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockCommits).not.toHaveBeenCalled();
  });
});
