import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { GitHubApiError, GitHubClient, type GitHubIssue } from 'gh-api-client';
import type { ReactNode } from 'react';
import { useGhIssue } from './useGhIssue.js';

const mockGet = jest.fn<(signal?: AbortSignal) => Promise<GitHubIssue>>();
const mockIssue = jest.fn().mockReturnValue({ get: mockGet });

beforeEach(() => {
  jest.clearAllMocks();
  mockIssue.mockReturnValue({ get: mockGet });
  jest
    .spyOn(GitHubClient.prototype, 'repo')
    .mockReturnValue({ issue: mockIssue } as unknown as ReturnType<GitHubClient['repo']>);
});

const mockIssueData = {
  id: 1,
  number: 1,
  title: 'Found a bug',
  state: 'open',
} as unknown as GitHubIssue;

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhIssue', () => {
  it('returns data on success', async () => {
    mockGet.mockResolvedValue(mockIssueData);
    const { result } = renderHook(() => useGhIssue('octocat', 'Hello-World', 1), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual(mockIssueData);
    expect(result.current.isError).toBe(false);
    expect(mockIssue).toHaveBeenCalledWith(1);
    expect(mockGet).toHaveBeenCalledWith(expect.anything());
  });

  it('returns error on failure', async () => {
    mockGet.mockRejectedValue(new GitHubApiError(404, 'Not Found'));
    const { result } = renderHook(() => useGhIssue('octocat', 'Hello-World', 99), { wrapper });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when issueNumber is 0', () => {
    const { result } = renderHook(() => useGhIssue('octocat', 'Hello-World', 0), { wrapper });
    expect(result.current.isLoading).toBe(false);
    expect(mockGet).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useGhIssue('octocat', 'Hello-World', 1, { enabled: false }),
      { wrapper },
    );
    expect(result.current.isLoading).toBe(false);
    expect(mockGet).not.toHaveBeenCalled();
  });
  it('accepts queryOptions', async () => {
    mockGet.mockResolvedValue(mockIssueData);
    const { result } = renderHook(
      () => useGhIssue('octocat', 'Hello-World', 1, { queryOptions: { staleTime: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
