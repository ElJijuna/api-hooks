import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import {
  GitHubApiError,
  GitHubClient,
  type GitHubPagedResponse,
  type GitHubWebhook,
} from 'gh-api-client';
import type { ReactNode } from 'react';
import { useGhRepoWebhooks } from './useGhRepoWebhooks.js';

const mockWebhooks =
  jest.fn<(params?: object, signal?: AbortSignal) => Promise<GitHubPagedResponse<GitHubWebhook>>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(GitHubClient.prototype, 'repo').mockReturnValue({
    webhooks: mockWebhooks,
  } as unknown as ReturnType<GitHubClient['repo']>);
});

const mockResponse: GitHubPagedResponse<GitHubWebhook> = {
  values: [
    {
      id: 1,
      name: 'web',
      active: true,
      events: ['push'],
      config: { url: 'https://example.com/webhook', content_type: 'json', insecure_ssl: '0' },
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      url: 'https://api.github.com/repos/owner/repo/hooks/1',
      test_url: '',
      ping_url: '',
      deliveries_url: '',
      type: 'Repository',
    },
  ],
  hasNextPage: false,
};

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhRepoWebhooks', () => {
  it('returns data on success', async () => {
    mockWebhooks.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useGhRepoWebhooks('owner', 'repo'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockResponse);
    expect(result.current.isError).toBe(false);
  });

  it('returns error on failure', async () => {
    mockWebhooks.mockRejectedValue(new GitHubApiError(403, 'Forbidden'));

    const { result } = renderHook(() => useGhRepoWebhooks('owner', 'repo'), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when owner is empty', () => {
    const { result } = renderHook(() => useGhRepoWebhooks('', 'repo'), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockWebhooks).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useGhRepoWebhooks('owner', 'repo', undefined, { enabled: false }),
      { wrapper },
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockWebhooks).not.toHaveBeenCalled();
  });
});
