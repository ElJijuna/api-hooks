import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GitHubClient, GitHubApiError } from 'gh-api-client';
import { useGhDeleteLabel } from './useGhDeleteLabel.js';

const mockDeleteLabel = jest.fn<(name: string) => Promise<void>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .spyOn(GitHubClient.prototype, 'repo')
    .mockReturnValue({
      deleteLabel: mockDeleteLabel,
    } as unknown as ReturnType<GitHubClient['repo']>);
});

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhDeleteLabel', () => {
  it('succeeds on delete', async () => {
    mockDeleteLabel.mockResolvedValue(undefined);

    const { result } = renderHook(() => useGhDeleteLabel('owner', 'repo'), { wrapper });

    act(() => { result.current.mutate('bug'); });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockDeleteLabel).toHaveBeenCalledWith('bug');
  });

  it('returns error on failure', async () => {
    mockDeleteLabel.mockRejectedValue(new GitHubApiError(404, 'Not Found'));

    const { result } = renderHook(() => useGhDeleteLabel('owner', 'repo'), { wrapper });

    act(() => { result.current.mutate('bug'); });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('is idle before mutate is called', () => {
    const { result } = renderHook(() => useGhDeleteLabel('owner', 'repo'), { wrapper });
    expect(result.current.isIdle).toBe(true);
  });
});
