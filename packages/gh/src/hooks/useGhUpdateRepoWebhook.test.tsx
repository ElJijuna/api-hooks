import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { GitHubClient, type GitHubWebhook } from 'gh-api-client';
import type { ReactNode } from 'react';
import { useGhUpdateRepoWebhook } from './useGhUpdateRepoWebhook.js';

const mockUpdateWebhook = jest.fn<(hookId: number, data: object) => Promise<GitHubWebhook>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(GitHubClient.prototype, 'repo').mockReturnValue({
    updateWebhook: mockUpdateWebhook,
  } as unknown as ReturnType<GitHubClient['repo']>);
});

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhUpdateRepoWebhook', () => {
  it('updates a repo webhook', async () => {
    const webhook = { id: 1, active: false } as unknown as GitHubWebhook;
    mockUpdateWebhook.mockResolvedValue(webhook);

    const { result } = renderHook(() => useGhUpdateRepoWebhook('owner', 'repo'), { wrapper });

    act(() => {
      result.current.mutate({ hookId: 1, data: { active: false } });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(webhook);
    expect(mockUpdateWebhook).toHaveBeenCalledWith(1, { active: false });
  });
  it('accepts mutationOptions', async () => {
    const webhook = { id: 1, active: false } as unknown as GitHubWebhook;
    mockUpdateWebhook.mockResolvedValue(webhook);
    const onSuccess = jest.fn();
    const { result } = renderHook(
      () => useGhUpdateRepoWebhook('owner', 'repo', { mutationOptions: { onSuccess } }),
      { wrapper },
    );
    act(() => {
      result.current.mutate({ hookId: 1, data: { active: false } });
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(onSuccess).toHaveBeenCalled();
  });
});
