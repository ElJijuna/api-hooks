import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import {
  GitHubApiError,
  GitHubClient,
  type GitHubIssue,
  type GitHubPagedResponse,
} from 'gh-api-client';
import { useGhRepoIssues } from './useGhRepoIssues.js';

const mockIssues =
  jest.fn<(params?: object, signal?: AbortSignal) => Promise<GitHubPagedResponse<GitHubIssue>>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .spyOn(GitHubClient.prototype, 'repo')
    .mockReturnValue({ issues: mockIssues } as unknown as ReturnType<GitHubClient['repo']>);
});

const mockIssue = {
  id: 1,
  number: 1,
  title: 'Found a bug',
  state: 'open',
} as unknown as GitHubIssue;
const mockResponse: GitHubPagedResponse<GitHubIssue> = { values: [mockIssue], hasNextPage: false };

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhRepoIssues', () => {
  it('returns data on success', async () => {
    mockIssues.mockResolvedValue(mockResponse);
    const { result } = renderHook(() => useGhRepoIssues('octocat', 'Hello-World'), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual(mockResponse);
    expect(result.current.isError).toBe(false);
    expect(mockIssues).toHaveBeenCalledWith(undefined, expect.anything());
  });

  it('passes params to the client', async () => {
    mockIssues.mockResolvedValue(mockResponse);
    const params = { per_page: 10, page: 2 };
    const { result } = renderHook(() => useGhRepoIssues('octocat', 'Hello-World', params), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(mockIssues).toHaveBeenCalledWith(params, expect.anything());
  });

  it('returns error on failure', async () => {
    mockIssues.mockRejectedValue(new GitHubApiError(401, 'Unauthorized'));
    const { result } = renderHook(() => useGhRepoIssues('octocat', 'Hello-World'), { wrapper });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useGhRepoIssues('octocat', 'Hello-World', undefined, { enabled: false }),
      { wrapper },
    );
    expect(result.current.isLoading).toBe(false);
    expect(mockIssues).not.toHaveBeenCalled();
  });
});
