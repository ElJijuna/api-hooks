import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import {
  GitHubApiError,
  GitHubClient,
  type GitHubCommit,
  type GitHubPagedResponse,
} from 'gh-api-client';
import type { ReactNode } from 'react';
import { useGhRepoCommits } from './useGhRepoCommits.js';

const mockCommits =
  jest.fn<(params?: object, signal?: AbortSignal) => Promise<GitHubPagedResponse<GitHubCommit>>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .spyOn(GitHubClient.prototype, 'repo')
    .mockReturnValue({ commits: mockCommits } as unknown as ReturnType<GitHubClient['repo']>);
});

const mockCommit = {
  sha: 'abc123',
  commit: { message: 'Initial commit' },
} as unknown as GitHubCommit;
const mockResponse: GitHubPagedResponse<GitHubCommit> = {
  values: [mockCommit],
  hasNextPage: false,
};

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhRepoCommits', () => {
  it('returns data on success', async () => {
    mockCommits.mockResolvedValue(mockResponse);
    const { result } = renderHook(() => useGhRepoCommits('octocat', 'Hello-World'), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual(mockResponse);
    expect(result.current.isError).toBe(false);
    expect(mockCommits).toHaveBeenCalledWith(undefined, expect.anything());
  });

  it('passes params to the client', async () => {
    mockCommits.mockResolvedValue(mockResponse);
    const params = { per_page: 10, page: 2 };
    const { result } = renderHook(() => useGhRepoCommits('octocat', 'Hello-World', params), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(mockCommits).toHaveBeenCalledWith(params, expect.anything());
  });

  it('returns error on failure', async () => {
    mockCommits.mockRejectedValue(new GitHubApiError(401, 'Unauthorized'));
    const { result } = renderHook(() => useGhRepoCommits('octocat', 'Hello-World'), { wrapper });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when owner is empty', () => {
    const { result } = renderHook(() => useGhRepoCommits('', 'Hello-World'), { wrapper });
    expect(result.current.isLoading).toBe(false);
    expect(mockCommits).not.toHaveBeenCalled();
  });

  it('does not fetch when repo is empty', () => {
    const { result } = renderHook(() => useGhRepoCommits('octocat', ''), { wrapper });
    expect(result.current.isLoading).toBe(false);
    expect(mockCommits).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useGhRepoCommits('octocat', 'Hello-World', undefined, { enabled: false }),
      { wrapper },
    );
    expect(result.current.isLoading).toBe(false);
    expect(mockCommits).not.toHaveBeenCalled();
  });
});
