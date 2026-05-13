import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GitHubClient, GitHubApiError, type GitHubPagedResponse, type GitHubRepositoryAdvisory } from 'gh-api-client';
import { useGhRepoAdvisoriesInfinite } from './useGhRepoAdvisoriesInfinite.js';

const mockAdvisories = jest.fn<(params?: object, signal?: AbortSignal) => Promise<GitHubPagedResponse<GitHubRepositoryAdvisory>>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(GitHubClient.prototype, 'repo').mockReturnValue({
    repoAdvisories: mockAdvisories,
  } as unknown as ReturnType<GitHubClient['repo']>);
});

const mockAdvisory = { ghsa_id: 'GHSA-1234-5678-9abc', summary: 'A vulnerability', severity: 'high' } as unknown as GitHubRepositoryAdvisory;

function makeResponse(hasNextPage: boolean, nextPage?: number): GitHubPagedResponse<GitHubRepositoryAdvisory> {
  return { values: [mockAdvisory], hasNextPage, nextPage };
}

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhRepoAdvisoriesInfinite', () => {
  it('fetches the first page on mount', async () => {
    mockAdvisories.mockResolvedValue(makeResponse(false));

    const { result } = renderHook(() => useGhRepoAdvisoriesInfinite('octocat', 'Hello-World'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data?.pages).toHaveLength(1);
    expect(result.current.data?.pages[0].values).toEqual([mockAdvisory]);
    expect(mockAdvisories).toHaveBeenCalledWith({ page: 1 }, expect.anything());
  });

  it('fetches the next page when fetchNextPage is called', async () => {
    mockAdvisories
      .mockResolvedValueOnce(makeResponse(true, 2))
      .mockResolvedValueOnce(makeResponse(false));

    const { result } = renderHook(() => useGhRepoAdvisoriesInfinite('octocat', 'Hello-World'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    void result.current.fetchNextPage();

    await waitFor(() => expect(result.current.data?.pages).toHaveLength(2));

    expect(mockAdvisories).toHaveBeenNthCalledWith(2, { page: 2 }, expect.anything());
  });

  it('reports hasNextPage correctly', async () => {
    mockAdvisories.mockResolvedValue(makeResponse(true, 2));

    const { result } = renderHook(() => useGhRepoAdvisoriesInfinite('octocat', 'Hello-World'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.hasNextPage).toBe(true);
  });

  it('returns error on failure', async () => {
    mockAdvisories.mockRejectedValue(new GitHubApiError(404, 'Not Found'));

    const { result } = renderHook(() => useGhRepoAdvisoriesInfinite('octocat', 'Hello-World'), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when repo is empty', () => {
    const { result } = renderHook(() => useGhRepoAdvisoriesInfinite('octocat', ''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockAdvisories).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useGhRepoAdvisoriesInfinite('octocat', 'Hello-World', undefined, { enabled: false }),
      { wrapper }
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockAdvisories).not.toHaveBeenCalled();
  });
});
