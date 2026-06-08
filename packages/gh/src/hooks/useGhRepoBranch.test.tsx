import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { GitHubApiError, type GitHubBranch, GitHubClient } from 'gh-api-client';
import type { ReactNode } from 'react';
import { useGhRepoBranch } from './useGhRepoBranch.js';

const mockBranch = jest.fn<(name: string, signal?: AbortSignal) => Promise<GitHubBranch>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .spyOn(GitHubClient.prototype, 'repo')
    .mockReturnValue({ branch: mockBranch } as unknown as ReturnType<GitHubClient['repo']>);
});

const mockBranchData = {
  name: 'main',
  commit: { sha: 'abc123', url: '' },
  protected: false,
} as unknown as GitHubBranch;

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhRepoBranch', () => {
  it('returns data on success', async () => {
    mockBranch.mockResolvedValue(mockBranchData);
    const { result } = renderHook(() => useGhRepoBranch('octocat', 'Hello-World', 'main'), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual(mockBranchData);
    expect(result.current.isError).toBe(false);
    expect(mockBranch).toHaveBeenCalledWith('main', expect.anything());
  });

  it('returns error on failure', async () => {
    mockBranch.mockRejectedValue(new GitHubApiError(404, 'Not Found'));
    const { result } = renderHook(() => useGhRepoBranch('octocat', 'Hello-World', 'nonexistent'), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when branch is empty', () => {
    const { result } = renderHook(() => useGhRepoBranch('octocat', 'Hello-World', ''), { wrapper });
    expect(result.current.isLoading).toBe(false);
    expect(mockBranch).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useGhRepoBranch('octocat', 'Hello-World', 'main', { enabled: false }),
      { wrapper },
    );
    expect(result.current.isLoading).toBe(false);
    expect(mockBranch).not.toHaveBeenCalled();
  });
});
