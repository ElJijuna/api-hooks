import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { type AddCollaboratorData, GitHubApiError, GitHubClient } from 'gh-api-client';
import type { ReactNode } from 'react';
import { useGhAddCollaborator } from './useGhAddCollaborator.js';

const mockAddCollaborator =
  jest.fn<(username: string, data?: AddCollaboratorData) => Promise<void>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(GitHubClient.prototype, 'repo').mockReturnValue({
    addCollaborator: mockAddCollaborator,
  } as unknown as ReturnType<GitHubClient['repo']>);
});

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhAddCollaborator', () => {
  it('succeeds on add', async () => {
    mockAddCollaborator.mockResolvedValue(undefined);

    const { result } = renderHook(() => useGhAddCollaborator('owner', 'repo'), { wrapper });

    act(() => {
      result.current.mutate({ username: 'hubot', data: { permission: 'push' } });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockAddCollaborator).toHaveBeenCalledWith('hubot', { permission: 'push' });
  });

  it('succeeds without permission data', async () => {
    mockAddCollaborator.mockResolvedValue(undefined);

    const { result } = renderHook(() => useGhAddCollaborator('owner', 'repo'), { wrapper });

    act(() => {
      result.current.mutate({ username: 'hubot' });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockAddCollaborator).toHaveBeenCalledWith('hubot', undefined);
  });

  it('returns error on failure', async () => {
    mockAddCollaborator.mockRejectedValue(new GitHubApiError(422, 'Unprocessable Entity'));

    const { result } = renderHook(() => useGhAddCollaborator('owner', 'repo'), { wrapper });

    act(() => {
      result.current.mutate({ username: 'hubot' });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('is idle before mutate is called', () => {
    const { result } = renderHook(() => useGhAddCollaborator('owner', 'repo'), { wrapper });
    expect(result.current.isIdle).toBe(true);
  });
  it('accepts mutationOptions', async () => {
    mockAddCollaborator.mockResolvedValue(undefined);
    const onSuccess = jest.fn();
    const { result } = renderHook(
      () => useGhAddCollaborator('owner', 'repo', { mutationOptions: { onSuccess } }),
      { wrapper },
    );
    act(() => {
      result.current.mutate({ username: 'hubot', data: { permission: 'push' } });
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(onSuccess).toHaveBeenCalled();
  });
});
