import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { GitHubApiError, GitHubClient } from 'gh-api-client';
import { useGhGistIsStarred } from './useGhGistIsStarred.js';

const mockIsStarred = jest.fn<(signal?: AbortSignal) => Promise<boolean>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(GitHubClient.prototype, 'gist').mockReturnValue({
    isStarred: mockIsStarred,
  } as unknown as ReturnType<GitHubClient['gist']>);
});

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhGistIsStarred', () => {
  it('returns true when gist is starred', async () => {
    mockIsStarred.mockResolvedValue(true);

    const { result } = renderHook(() => useGhGistIsStarred('abc123'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toBe(true);
    expect(result.current.isError).toBe(false);
  });

  it('returns false when gist is not starred', async () => {
    mockIsStarred.mockResolvedValue(false);

    const { result } = renderHook(() => useGhGistIsStarred('abc123'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toBe(false);
  });

  it('returns error on failure', async () => {
    mockIsStarred.mockRejectedValue(new GitHubApiError(401, 'Unauthorized'));

    const { result } = renderHook(() => useGhGistIsStarred('abc123'), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when gistId is empty', () => {
    const { result } = renderHook(() => useGhGistIsStarred(''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockIsStarred).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(() => useGhGistIsStarred('abc123', { enabled: false }), {
      wrapper,
    });

    expect(result.current.isLoading).toBe(false);
    expect(mockIsStarred).not.toHaveBeenCalled();
  });
});
