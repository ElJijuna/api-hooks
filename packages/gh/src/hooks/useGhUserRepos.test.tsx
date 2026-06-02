import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import {
  GitHubApiError,
  GitHubClient,
  type GitHubPagedResponse,
  type GitHubRepository,
} from 'gh-api-client';
import { useGhUserRepos } from './useGhUserRepos.js';

const mockRepos =
  jest.fn<
    (params?: object, signal?: AbortSignal) => Promise<GitHubPagedResponse<GitHubRepository>>
  >();

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .spyOn(GitHubClient.prototype, 'user')
    .mockReturnValue({ repos: mockRepos } as unknown as ReturnType<GitHubClient['user']>);
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

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhUserRepos', () => {
  it('returns data on success', async () => {
    mockRepos.mockResolvedValue(mockResponse);
    const { result } = renderHook(() => useGhUserRepos('octocat'), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual(mockResponse);
    expect(result.current.isError).toBe(false);
    expect(mockRepos).toHaveBeenCalledWith(undefined, expect.anything());
  });

  it('passes params to the client', async () => {
    mockRepos.mockResolvedValue(mockResponse);
    const params = { per_page: 10, page: 2 };
    const { result } = renderHook(() => useGhUserRepos('octocat', params), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(mockRepos).toHaveBeenCalledWith(params, expect.anything());
  });

  it('returns error on failure', async () => {
    mockRepos.mockRejectedValue(new GitHubApiError(401, 'Unauthorized'));
    const { result } = renderHook(() => useGhUserRepos('octocat'), { wrapper });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when login is empty', () => {
    const { result } = renderHook(() => useGhUserRepos(''), { wrapper });
    expect(result.current.isLoading).toBe(false);
    expect(mockRepos).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(() => useGhUserRepos('octocat', undefined, { enabled: false }), {
      wrapper,
    });
    expect(result.current.isLoading).toBe(false);
    expect(mockRepos).not.toHaveBeenCalled();
  });
});
