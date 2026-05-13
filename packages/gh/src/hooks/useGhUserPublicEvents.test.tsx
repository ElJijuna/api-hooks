import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GitHubClient, GitHubApiError, type GitHubPagedResponse, type GitHubEvent } from 'gh-api-client';
import { useGhUserPublicEvents } from './useGhUserPublicEvents.js';

const mockPublicEvents = jest.fn<(params?: object, signal?: AbortSignal) => Promise<GitHubPagedResponse<GitHubEvent>>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .spyOn(GitHubClient.prototype, 'user')
    .mockReturnValue({
      publicEvents: mockPublicEvents,
    } as unknown as ReturnType<GitHubClient['user']>);
});

const mockResponse: GitHubPagedResponse<GitHubEvent> = {
  values: [
    {
      id: 'event1',
      type: 'PushEvent',
      actor: { id: 1, login: 'octocat', display_login: 'octocat', gravatar_id: '', url: '', avatar_url: '' },
      repo: { id: 1, name: 'octocat/Hello-World', url: '' },
      payload: {},
      public: true,
      created_at: '2024-01-01T00:00:00Z',
    },
  ],
  hasNextPage: false,
};

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhUserPublicEvents', () => {
  it('returns data on success', async () => {
    mockPublicEvents.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useGhUserPublicEvents('octocat'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockResponse);
    expect(result.current.isError).toBe(false);
  });

  it('returns error on failure', async () => {
    mockPublicEvents.mockRejectedValue(new GitHubApiError(404, 'Not Found'));

    const { result } = renderHook(() => useGhUserPublicEvents('octocat'), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when login is empty', () => {
    const { result } = renderHook(() => useGhUserPublicEvents(''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockPublicEvents).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useGhUserPublicEvents('octocat', undefined, { enabled: false }),
      { wrapper }
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockPublicEvents).not.toHaveBeenCalled();
  });
});
