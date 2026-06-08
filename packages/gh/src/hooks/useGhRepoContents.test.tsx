import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { GitHubApiError, GitHubClient, type GitHubContent } from 'gh-api-client';
import type { ReactNode } from 'react';
import { useGhRepoContents } from './useGhRepoContents.js';

const mockContents =
  jest.fn<
    (
      path?: string,
      params?: object,
      signal?: AbortSignal,
    ) => Promise<GitHubContent | GitHubContent[]>
  >();

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .spyOn(GitHubClient.prototype, 'repo')
    .mockReturnValue({ contents: mockContents } as unknown as ReturnType<GitHubClient['repo']>);
});

const mockContent = { path: 'README.md', type: 'file' } as unknown as GitHubContent;

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhRepoContents', () => {
  it('returns data on success', async () => {
    mockContents.mockResolvedValue(mockContent);
    const { result } = renderHook(() => useGhRepoContents('octocat', 'Hello-World', 'README.md'), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual(mockContent);
    expect(result.current.isError).toBe(false);
    expect(mockContents).toHaveBeenCalledWith('README.md', undefined, expect.anything());
  });

  it('returns error on failure', async () => {
    mockContents.mockRejectedValue(new GitHubApiError(404, 'Not Found'));
    const { result } = renderHook(
      () => useGhRepoContents('octocat', 'Hello-World', 'nonexistent.md'),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when owner is empty', () => {
    const { result } = renderHook(() => useGhRepoContents('', 'Hello-World'), { wrapper });
    expect(result.current.isLoading).toBe(false);
    expect(mockContents).not.toHaveBeenCalled();
  });

  it('does not fetch when repo is empty', () => {
    const { result } = renderHook(() => useGhRepoContents('octocat', ''), { wrapper });
    expect(result.current.isLoading).toBe(false);
    expect(mockContents).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useGhRepoContents('octocat', 'Hello-World', undefined, undefined, { enabled: false }),
      { wrapper },
    );
    expect(result.current.isLoading).toBe(false);
    expect(mockContents).not.toHaveBeenCalled();
  });
});
