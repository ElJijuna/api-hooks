import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GitHubClient, GitHubApiError } from 'gh-api-client';
import { useGhRemoveCollaborator } from './useGhRemoveCollaborator.js';

const mockRemoveCollaborator = jest.fn<(username: string) => Promise<void>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .spyOn(GitHubClient.prototype, 'repo')
    .mockReturnValue({
      removeCollaborator: mockRemoveCollaborator,
    } as unknown as ReturnType<GitHubClient['repo']>);
});

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhRemoveCollaborator', () => {
  it('succeeds on remove', async () => {
    mockRemoveCollaborator.mockResolvedValue(undefined);

    const { result } = renderHook(() => useGhRemoveCollaborator('owner', 'repo'), { wrapper });

    act(() => { result.current.mutate('hubot'); });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockRemoveCollaborator).toHaveBeenCalledWith('hubot');
  });

  it('returns error on failure', async () => {
    mockRemoveCollaborator.mockRejectedValue(new GitHubApiError(404, 'Not Found'));

    const { result } = renderHook(() => useGhRemoveCollaborator('owner', 'repo'), { wrapper });

    act(() => { result.current.mutate('hubot'); });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('is idle before mutate is called', () => {
    const { result } = renderHook(() => useGhRemoveCollaborator('owner', 'repo'), { wrapper });
    expect(result.current.isIdle).toBe(true);
  });
});
