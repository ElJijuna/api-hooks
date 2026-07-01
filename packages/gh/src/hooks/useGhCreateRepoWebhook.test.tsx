import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { GitHubClient, type GitHubWebhook } from 'gh-api-client';
import type { ReactNode } from 'react';
import { useGhCreateRepoWebhook } from './useGhCreateRepoWebhook.js';

const mockCreateWebhook = jest.fn<(data: object) => Promise<GitHubWebhook>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(GitHubClient.prototype, 'repo').mockReturnValue({
    createWebhook: mockCreateWebhook,
  } as unknown as ReturnType<GitHubClient['repo']>);
});

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhCreateRepoWebhook', () => {
  it('creates a repo webhook', async () => {
    const webhook = { id: 1 } as unknown as GitHubWebhook;
    const data = { config: { url: 'https://example.com/webhook' } };
    mockCreateWebhook.mockResolvedValue(webhook);

    const { result } = renderHook(() => useGhCreateRepoWebhook('owner', 'repo'), { wrapper });

    act(() => {
      result.current.mutate(data);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(webhook);
    expect(mockCreateWebhook).toHaveBeenCalledWith(data);
  });
  it('accepts mutationOptions', async () => {
    const webhook = { id: 1 } as unknown as GitHubWebhook;
    const data = { config: { url: 'https://example.com/webhook' } };
    mockCreateWebhook.mockResolvedValue(webhook);
    const onSuccess = jest.fn();
    const { result } = renderHook(
      () => useGhCreateRepoWebhook('owner', 'repo', { mutationOptions: { onSuccess } }),
      { wrapper },
    );
    act(() => {
      result.current.mutate(data);
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(onSuccess).toHaveBeenCalled();
  });
});
