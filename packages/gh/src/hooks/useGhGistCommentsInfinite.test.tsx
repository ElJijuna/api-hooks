import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import {
  type GistComment,
  GitHubApiError,
  GitHubClient,
  type GitHubPagedResponse,
} from 'gh-api-client';
import { useGhGistCommentsInfinite } from './useGhGistCommentsInfinite.js';

const mockComments =
  jest.fn<(params?: object, signal?: AbortSignal) => Promise<GitHubPagedResponse<GistComment>>>();
const mockGist = jest.fn().mockReturnValue({ comments: mockComments });

beforeEach(() => {
  jest.clearAllMocks();
  mockGist.mockReturnValue({ comments: mockComments });
  jest.spyOn(GitHubClient.prototype, 'gist').mockImplementation(mockGist);
});

const mockComment = {
  id: 1,
  body: 'A comment',
  user: null,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
} as unknown as GistComment;

function makeResponse(hasNextPage: boolean, nextPage?: number): GitHubPagedResponse<GistComment> {
  return { values: [mockComment], hasNextPage, nextPage };
}

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhGistCommentsInfinite', () => {
  it('fetches the first page on mount', async () => {
    mockComments.mockResolvedValue(makeResponse(false));

    const { result } = renderHook(() => useGhGistCommentsInfinite('abc123'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data?.pages).toHaveLength(1);
    expect(result.current.data?.pages[0].values).toEqual([mockComment]);
    expect(mockGist).toHaveBeenCalledWith('abc123');
    expect(mockComments).toHaveBeenCalledWith({ page: 1 }, expect.anything());
  });

  it('fetches the next page when fetchNextPage is called', async () => {
    mockComments
      .mockResolvedValueOnce(makeResponse(true, 2))
      .mockResolvedValueOnce(makeResponse(false));

    const { result } = renderHook(() => useGhGistCommentsInfinite('abc123'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    void result.current.fetchNextPage();

    await waitFor(() => expect(result.current.data?.pages).toHaveLength(2));

    expect(mockComments).toHaveBeenNthCalledWith(2, { page: 2 }, expect.anything());
  });

  it('reports hasNextPage correctly', async () => {
    mockComments.mockResolvedValue(makeResponse(true, 2));

    const { result } = renderHook(() => useGhGistCommentsInfinite('abc123'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.hasNextPage).toBe(true);
  });

  it('returns error on failure', async () => {
    mockComments.mockRejectedValue(new GitHubApiError(404, 'Not Found'));

    const { result } = renderHook(() => useGhGistCommentsInfinite('abc123'), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when gistId is empty', () => {
    const { result } = renderHook(() => useGhGistCommentsInfinite(''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockComments).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useGhGistCommentsInfinite('abc123', undefined, { enabled: false }),
      { wrapper },
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockComments).not.toHaveBeenCalled();
  });
});
