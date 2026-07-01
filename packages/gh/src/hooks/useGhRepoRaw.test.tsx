import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { GitHubApiError, GitHubClient } from 'gh-api-client';
import type { ReactNode } from 'react';
import { useGhRepoRaw } from './useGhRepoRaw.js';

const mockRaw =
  jest.fn<(filePath: string, params?: object, signal?: AbortSignal) => Promise<string>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(GitHubClient.prototype, 'repo').mockReturnValue({
    raw: mockRaw,
  } as unknown as ReturnType<GitHubClient['repo']>);
});

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhRepoRaw', () => {
  it('returns file content on success', async () => {
    mockRaw.mockResolvedValue('# Hello World\n');

    const { result } = renderHook(() => useGhRepoRaw('owner', 'repo', 'README.md'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toBe('# Hello World\n');
    expect(result.current.isError).toBe(false);
  });

  it('returns error on failure', async () => {
    mockRaw.mockRejectedValue(new GitHubApiError(404, 'Not Found'));

    const { result } = renderHook(() => useGhRepoRaw('owner', 'repo', 'missing.md'), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when filePath is empty', () => {
    const { result } = renderHook(() => useGhRepoRaw('owner', 'repo', ''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockRaw).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useGhRepoRaw('owner', 'repo', 'README.md', undefined, { enabled: false }),
      { wrapper },
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockRaw).not.toHaveBeenCalled();
  });
  it('accepts queryOptions', async () => {
    mockRaw.mockResolvedValue('# Hello World\n');
    const { result } = renderHook(
      () => useGhRepoRaw('owner', 'repo', 'README.md', { queryOptions: { staleTime: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
