import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import {
  GitHubApiError,
  GitHubClient,
  type GitHubIssue,
  type GitHubPagedResponse,
} from 'gh-api-client';
import { useGhSearchIssuesInfinite } from './useGhSearchIssuesInfinite.js';

const mockSearchIssues =
  jest.fn<(params?: object, signal?: AbortSignal) => Promise<GitHubPagedResponse<GitHubIssue>>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(GitHubClient.prototype, 'searchIssues').mockImplementation(mockSearchIssues);
});

const mockIssue = {
  id: 1,
  number: 42,
  title: 'Found a bug',
  state: 'open',
} as unknown as GitHubIssue;
const mockResponse: GitHubPagedResponse<GitHubIssue> = {
  values: [mockIssue],
  hasNextPage: false,
  totalCount: 1,
};

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhSearchIssuesInfinite', () => {
  it('returns data on success', async () => {
    mockSearchIssues.mockResolvedValue(mockResponse);
    const { result } = renderHook(() => useGhSearchIssuesInfinite({ q: 'is:issue is:open' }), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data?.pages[0]).toEqual(mockResponse);
    expect(result.current.isError).toBe(false);
  });

  it('passes params to the client', async () => {
    mockSearchIssues.mockResolvedValue(mockResponse);
    const params = { q: 'is:pr is:open author:octocat', sort: 'created' as const };
    const { result } = renderHook(() => useGhSearchIssuesInfinite(params), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(mockSearchIssues).toHaveBeenCalledWith({ ...params, page: 1 }, expect.anything());
  });

  it('returns error on failure', async () => {
    mockSearchIssues.mockRejectedValue(new GitHubApiError(422, 'Unprocessable Entity'));
    const { result } = renderHook(() => useGhSearchIssuesInfinite({ q: 'is:issue' }), { wrapper });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when q is empty', () => {
    const { result } = renderHook(() => useGhSearchIssuesInfinite({ q: '' }), { wrapper });
    expect(result.current.isLoading).toBe(false);
    expect(mockSearchIssues).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useGhSearchIssuesInfinite({ q: 'is:issue' }, { enabled: false }),
      { wrapper },
    );
    expect(result.current.isLoading).toBe(false);
    expect(mockSearchIssues).not.toHaveBeenCalled();
  });
});
