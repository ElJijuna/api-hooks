import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { GitHubApiError, GitHubClient, type GitHubRepository } from 'gh-api-client';
import type { ReactNode } from 'react';
import { useGhCreateFork } from './useGhCreateFork.js';

const mockCreateFork = jest.fn<(data?: object) => Promise<GitHubRepository>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(GitHubClient.prototype, 'repo').mockReturnValue({
    createFork: mockCreateFork,
  } as unknown as ReturnType<GitHubClient['repo']>);
});

const mockRepo = {
  id: 2,
  name: 'repo',
  full_name: 'forker/repo',
  fork: true,
  private: false,
  html_url: 'https://github.com/forker/repo',
  description: null,
  owner: {
    id: 2,
    login: 'forker',
    avatar_url: '',
    html_url: '',
    type: 'User',
    site_admin: false,
    node_id: '',
    url: '',
  },
  node_id: 'R_2',
} as unknown as GitHubRepository;

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhCreateFork', () => {
  it('returns forked repo on success', async () => {
    mockCreateFork.mockResolvedValue(mockRepo);

    const { result } = renderHook(() => useGhCreateFork('owner', 'repo'), { wrapper });

    act(() => {
      result.current.mutate(undefined);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockRepo);
  });

  it('returns error on failure', async () => {
    mockCreateFork.mockRejectedValue(new GitHubApiError(422, 'Unprocessable Entity'));

    const { result } = renderHook(() => useGhCreateFork('owner', 'repo'), { wrapper });

    act(() => {
      result.current.mutate(undefined);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('is idle before mutate is called', () => {
    const { result } = renderHook(() => useGhCreateFork('owner', 'repo'), { wrapper });

    expect(result.current.isIdle).toBe(true);
  });
});
