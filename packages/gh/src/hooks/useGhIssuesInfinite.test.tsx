import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import {
  GitHubApiError,
  GitHubClient,
  type GitHubIssue,
  type GitHubPagedResponse,
} from 'gh-api-client';
import { useGhIssuesInfinite } from './useGhIssuesInfinite.js';

const mockIssues =
  jest.fn<(params?: object, signal?: AbortSignal) => Promise<GitHubPagedResponse<GitHubIssue>>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(GitHubClient.prototype, 'issues').mockImplementation(mockIssues);
});

const mockIssue = {
  id: 1,
  number: 1,
  title: 'Cross-repo bug',
  state: 'open',
} as unknown as GitHubIssue;
const mockResponse: GitHubPagedResponse<GitHubIssue> = { values: [mockIssue], hasNextPage: false };

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhIssuesInfinite', () => {
  it('returns data on success', async () => {
    mockIssues.mockResolvedValue(mockResponse);
    const { result } = renderHook(() => useGhIssuesInfinite(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data?.pages[0]).toEqual(mockResponse);
    expect(result.current.isError).toBe(false);
  });

  it('passes params to the client', async () => {
    mockIssues.mockResolvedValue(mockResponse);
    const params = { filter: 'all' as const, state: 'open' as const };
    const { result } = renderHook(() => useGhIssuesInfinite(params), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(mockIssues).toHaveBeenCalledWith({ ...params, page: 1 }, expect.anything());
  });

  it('returns error on failure', async () => {
    mockIssues.mockRejectedValue(new GitHubApiError(401, 'Unauthorized'));
    const { result } = renderHook(() => useGhIssuesInfinite(), { wrapper });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(() => useGhIssuesInfinite(undefined, { enabled: false }), {
      wrapper,
    });
    expect(result.current.isLoading).toBe(false);
    expect(mockIssues).not.toHaveBeenCalled();
  });
});
