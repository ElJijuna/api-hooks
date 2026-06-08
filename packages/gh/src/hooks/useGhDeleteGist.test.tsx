import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { GitHubApiError, GitHubClient } from 'gh-api-client';
import type { ReactNode } from 'react';
import { useGhDeleteGist } from './useGhDeleteGist.js';

const mockDelete = jest.fn<(signal?: AbortSignal) => Promise<void>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(GitHubClient.prototype, 'gist').mockReturnValue({
    delete: mockDelete,
  } as unknown as ReturnType<GitHubClient['gist']>);
});

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhDeleteGist', () => {
  it('succeeds and returns void', async () => {
    mockDelete.mockResolvedValue(undefined);

    const { result } = renderHook(() => useGhDeleteGist('abc123'), { wrapper });

    act(() => {
      result.current.mutate();
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeUndefined();
    expect(mockDelete).toHaveBeenCalled();
  });

  it('returns error on failure', async () => {
    mockDelete.mockRejectedValue(new GitHubApiError(404, 'Not Found'));

    const { result } = renderHook(() => useGhDeleteGist('abc123'), { wrapper });

    act(() => {
      result.current.mutate();
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('is idle before mutate is called', () => {
    const { result } = renderHook(() => useGhDeleteGist('abc123'), { wrapper });

    expect(result.current.isIdle).toBe(true);
    expect(mockDelete).not.toHaveBeenCalled();
  });
});
