import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { GitHubApiError, GitHubClient, type GitHubRelease } from 'gh-api-client';
import { useGhRepoLatestRelease } from './useGhRepoLatestRelease.js';

const mockLatestRelease = jest.fn<(signal?: AbortSignal) => Promise<GitHubRelease>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(GitHubClient.prototype, 'repo').mockReturnValue({
    latestRelease: mockLatestRelease,
  } as unknown as ReturnType<GitHubClient['repo']>);
});

const mockRelease: GitHubRelease = {
  id: 1,
  tag_name: 'v1.0.0',
  name: 'Version 1.0.0',
  body: 'Release notes',
  draft: false,
  prerelease: false,
  created_at: '2024-01-01T00:00:00Z',
  published_at: '2024-01-01T00:00:00Z',
  html_url: 'https://github.com/owner/repo/releases/tag/v1.0.0',
  tarball_url: '',
  zipball_url: '',
  assets: [],
  node_id: 'R_1',
};

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhRepoLatestRelease', () => {
  it('returns data on success', async () => {
    mockLatestRelease.mockResolvedValue(mockRelease);

    const { result } = renderHook(() => useGhRepoLatestRelease('owner', 'repo'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockRelease);
    expect(result.current.isError).toBe(false);
  });

  it('returns error on failure', async () => {
    mockLatestRelease.mockRejectedValue(new GitHubApiError(404, 'Not Found'));

    const { result } = renderHook(() => useGhRepoLatestRelease('owner', 'repo'), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when owner is empty', () => {
    const { result } = renderHook(() => useGhRepoLatestRelease('', 'repo'), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockLatestRelease).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useGhRepoLatestRelease('owner', 'repo', { enabled: false }),
      { wrapper },
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockLatestRelease).not.toHaveBeenCalled();
  });
});
