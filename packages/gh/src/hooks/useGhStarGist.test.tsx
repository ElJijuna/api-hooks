import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { GitHubApiError, GitHubClient } from 'gh-api-client';
import type { ReactNode } from 'react';
import { useGhStarGist } from './useGhStarGist.js';

const mockStar = jest.fn<(signal?: AbortSignal) => Promise<void>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(GitHubClient.prototype, 'gist').mockReturnValue({
    star: mockStar,
  } as unknown as ReturnType<GitHubClient['gist']>);
});

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhStarGist', () => {
  it('succeeds on star', async () => {
    mockStar.mockResolvedValue(undefined);

    const { result } = renderHook(() => useGhStarGist('abc123'), { wrapper });

    act(() => {
      result.current.mutate();
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockStar).toHaveBeenCalled();
  });

  it('returns error on failure', async () => {
    mockStar.mockRejectedValue(new GitHubApiError(401, 'Unauthorized'));

    const { result } = renderHook(() => useGhStarGist('abc123'), { wrapper });

    act(() => {
      result.current.mutate();
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('is idle before mutate is called', () => {
    const { result } = renderHook(() => useGhStarGist('abc123'), { wrapper });

    expect(result.current.isIdle).toBe(true);
  });
  it('accepts mutationOptions', async () => {
    mockStar.mockResolvedValue(undefined);
    const onSuccess = jest.fn();
    const { result } = renderHook(
      () => useGhStarGist('abc123', { mutationOptions: { onSuccess } }),
      { wrapper },
    );
    act(() => {
      result.current.mutate();
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(onSuccess).toHaveBeenCalled();
  });
});
