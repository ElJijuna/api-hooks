import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { GitHubClient, type GitHubTree } from 'gh-api-client';
import type { ReactNode } from 'react';
import { useGhRepoGitTree } from './useGhRepoGitTree.js';

const mockGitTree =
  jest.fn<(treeSha: string, params?: object, signal?: AbortSignal) => Promise<GitHubTree>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(GitHubClient.prototype, 'repo').mockReturnValue({
    gitTree: mockGitTree,
  } as unknown as ReturnType<GitHubClient['repo']>);
});

const tree: GitHubTree = {
  sha: 'abc123',
  url: 'https://api.github.com/repos/octocat/hello/git/trees/abc123',
  truncated: false,
  tree: [{ path: 'README.md', mode: '100644', type: 'blob', sha: 'def456', url: 'url', size: 12 }],
};

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhRepoGitTree', () => {
  it('returns a git tree on success', async () => {
    mockGitTree.mockResolvedValue(tree);

    const { result } = renderHook(
      () => useGhRepoGitTree('octocat', 'hello', 'abc123', { recursive: '1' }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(tree);
    expect(mockGitTree).toHaveBeenCalledWith('abc123', { recursive: '1' }, expect.anything());
  });

  it('does not fetch when treeSha is empty', () => {
    const { result } = renderHook(() => useGhRepoGitTree('octocat', 'hello', ''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockGitTree).not.toHaveBeenCalled();
  });
});
