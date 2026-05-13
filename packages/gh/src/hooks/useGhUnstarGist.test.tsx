import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GitHubClient, GitHubApiError } from 'gh-api-client';
import { useGhUnstarGist } from './useGhUnstarGist.js';

const mockUnstar = jest.fn<(signal?: AbortSignal) => Promise<void>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .spyOn(GitHubClient.prototype, 'gist')
    .mockReturnValue({
      unstar: mockUnstar,
    } as unknown as ReturnType<GitHubClient['gist']>);
});

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhUnstarGist', () => {
  it('succeeds on unstar', async () => {
    mockUnstar.mockResolvedValue(undefined);

    const { result } = renderHook(() => useGhUnstarGist('abc123'), { wrapper });

    act(() => {
      result.current.mutate();
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockUnstar).toHaveBeenCalled();
  });

  it('returns error on failure', async () => {
    mockUnstar.mockRejectedValue(new GitHubApiError(401, 'Unauthorized'));

    const { result } = renderHook(() => useGhUnstarGist('abc123'), { wrapper });

    act(() => {
      result.current.mutate();
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('is idle before mutate is called', () => {
    const { result } = renderHook(() => useGhUnstarGist('abc123'), { wrapper });

    expect(result.current.isIdle).toBe(true);
  });
});
