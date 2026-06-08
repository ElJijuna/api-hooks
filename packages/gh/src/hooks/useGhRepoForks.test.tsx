import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import {
  GitHubApiError,
  GitHubClient,
  type GitHubPagedResponse,
  type GitHubRepository,
} from 'gh-api-client';
import type { ReactNode } from 'react';
import { useGhRepoForks } from './useGhRepoForks.js';

const mockForks =
  jest.fn<
    (params?: object, signal?: AbortSignal) => Promise<GitHubPagedResponse<GitHubRepository>>
  >();

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .spyOn(GitHubClient.prototype, 'repo')
    .mockReturnValue({ forks: mockForks } as unknown as ReturnType<GitHubClient['repo']>);
});

const mockRepo = {
  id: 1,
  name: 'Hello-World',
  full_name: 'octocat/Hello-World',
} as unknown as GitHubRepository;
const mockResponse: GitHubPagedResponse<GitHubRepository> = {
  values: [mockRepo],
  hasNextPage: false,
};

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhRepoForks', () => {
  it('returns data on success', async () => {
    mockForks.mockResolvedValue(mockResponse);
    const { result } = renderHook(() => useGhRepoForks('octocat', 'Hello-World'), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual(mockResponse);
    expect(result.current.isError).toBe(false);
    expect(mockForks).toHaveBeenCalledWith(undefined, expect.anything());
  });

  it('passes params to the client', async () => {
    mockForks.mockResolvedValue(mockResponse);
    const params = { per_page: 10, page: 2 };
    const { result } = renderHook(() => useGhRepoForks('octocat', 'Hello-World', params), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(mockForks).toHaveBeenCalledWith(params, expect.anything());
  });

  it('returns error on failure', async () => {
    mockForks.mockRejectedValue(new GitHubApiError(401, 'Unauthorized'));
    const { result } = renderHook(() => useGhRepoForks('octocat', 'Hello-World'), { wrapper });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useGhRepoForks('octocat', 'Hello-World', undefined, { enabled: false }),
      { wrapper },
    );
    expect(result.current.isLoading).toBe(false);
    expect(mockForks).not.toHaveBeenCalled();
  });
});
