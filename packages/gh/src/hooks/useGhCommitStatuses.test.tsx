import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import {
  GitHubApiError,
  GitHubClient,
  type GitHubCommitStatus,
  type GitHubPagedResponse,
} from 'gh-api-client';
import type { ReactNode } from 'react';
import { useGhCommitStatuses } from './useGhCommitStatuses.js';

const mockStatuses =
  jest.fn<
    (params?: object, signal?: AbortSignal) => Promise<GitHubPagedResponse<GitHubCommitStatus>>
  >();
const mockCommit = jest.fn().mockReturnValue({ statuses: mockStatuses });

beforeEach(() => {
  jest.clearAllMocks();
  mockCommit.mockReturnValue({ statuses: mockStatuses });
  jest
    .spyOn(GitHubClient.prototype, 'repo')
    .mockReturnValue({ commit: mockCommit } as unknown as ReturnType<GitHubClient['repo']>);
});

const mockCommitStatus = {
  id: 1,
  state: 'success',
  description: 'OK',
  target_url: null,
  context: 'ci',
  created_at: '',
  updated_at: '',
} as unknown as GitHubCommitStatus;
const mockResponse: GitHubPagedResponse<GitHubCommitStatus> = {
  values: [mockCommitStatus],
  hasNextPage: false,
};

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhCommitStatuses', () => {
  it('returns data on success', async () => {
    mockStatuses.mockResolvedValue(mockResponse);
    const { result } = renderHook(() => useGhCommitStatuses('octocat', 'Hello-World', 'abc123'), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual(mockResponse);
    expect(result.current.isError).toBe(false);
    expect(mockCommit).toHaveBeenCalledWith('abc123');
    expect(mockStatuses).toHaveBeenCalledWith(undefined, expect.anything());
  });

  it('passes params to the client', async () => {
    mockStatuses.mockResolvedValue(mockResponse);
    const params = { per_page: 10, page: 2 };
    const { result } = renderHook(
      () => useGhCommitStatuses('octocat', 'Hello-World', 'abc123', params),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(mockStatuses).toHaveBeenCalledWith(params, expect.anything());
  });

  it('returns error on failure', async () => {
    mockStatuses.mockRejectedValue(new GitHubApiError(401, 'Unauthorized'));
    const { result } = renderHook(() => useGhCommitStatuses('octocat', 'Hello-World', 'abc123'), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useGhCommitStatuses('octocat', 'Hello-World', 'abc123', undefined, { enabled: false }),
      { wrapper },
    );
    expect(result.current.isLoading).toBe(false);
    expect(mockStatuses).not.toHaveBeenCalled();
  });
  it('accepts queryOptions', async () => {
    mockStatuses.mockResolvedValue(mockResponse);
    const { result } = renderHook(
      () =>
        useGhCommitStatuses('octocat', 'Hello-World', 'abc123', { queryOptions: { staleTime: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
