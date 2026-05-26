import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GitHubClient, GitHubApiError } from 'gh-api-client';
import { useGhDeleteRelease } from './useGhDeleteRelease.js';

const mockDeleteRelease = jest.fn<(id: number) => Promise<void>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .spyOn(GitHubClient.prototype, 'repo')
    .mockReturnValue({
      deleteRelease: mockDeleteRelease,
    } as unknown as ReturnType<GitHubClient['repo']>);
});

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhDeleteRelease', () => {
  it('succeeds on delete', async () => {
    mockDeleteRelease.mockResolvedValue(undefined);

    const { result } = renderHook(() => useGhDeleteRelease('owner', 'repo'), { wrapper });

    act(() => { result.current.mutate(1); });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockDeleteRelease).toHaveBeenCalledWith(1);
  });

  it('returns error on failure', async () => {
    mockDeleteRelease.mockRejectedValue(new GitHubApiError(404, 'Not Found'));

    const { result } = renderHook(() => useGhDeleteRelease('owner', 'repo'), { wrapper });

    act(() => { result.current.mutate(99); });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('is idle before mutate is called', () => {
    const { result } = renderHook(() => useGhDeleteRelease('owner', 'repo'), { wrapper });
    expect(result.current.isIdle).toBe(true);
  });
});
