import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { GitHubClient } from 'gh-api-client';
import type { ReactNode } from 'react';
import { useGhDeleteRepoWebhook } from './useGhDeleteRepoWebhook.js';

const mockDeleteWebhook = jest.fn<(hookId: number) => Promise<void>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(GitHubClient.prototype, 'repo').mockReturnValue({
    deleteWebhook: mockDeleteWebhook,
  } as unknown as ReturnType<GitHubClient['repo']>);
});

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhDeleteRepoWebhook', () => {
  it('deletes a repo webhook', async () => {
    mockDeleteWebhook.mockResolvedValue(undefined);

    const { result } = renderHook(() => useGhDeleteRepoWebhook('owner', 'repo'), { wrapper });

    act(() => {
      result.current.mutate({ hookId: 1 });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockDeleteWebhook).toHaveBeenCalledWith(1);
  });
  it('accepts mutationOptions', async () => {
    mockDeleteWebhook.mockResolvedValue(undefined);
    const onSuccess = jest.fn();
    const { result } = renderHook(
      () => useGhDeleteRepoWebhook('owner', 'repo', { mutationOptions: { onSuccess } }),
      { wrapper },
    );
    act(() => {
      result.current.mutate({ hookId: 1 });
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(onSuccess).toHaveBeenCalled();
  });
});
