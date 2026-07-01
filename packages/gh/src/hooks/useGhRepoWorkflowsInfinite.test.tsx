import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { GitHubApiError, GitHubClient, type GitHubWorkflowsResponse } from 'gh-api-client';
import type { ReactNode } from 'react';
import { useGhRepoWorkflowsInfinite } from './useGhRepoWorkflowsInfinite.js';

const mockWorkflows =
  jest.fn<(params?: object, signal?: AbortSignal) => Promise<GitHubWorkflowsResponse>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(GitHubClient.prototype, 'repo').mockReturnValue({
    workflows: mockWorkflows,
  } as unknown as ReturnType<GitHubClient['repo']>);
});

const mockResponse: GitHubWorkflowsResponse = {
  total_count: 1,
  workflows: [
    {
      id: 1,
      name: 'CI',
      path: '.github/workflows/ci.yml',
      state: 'active',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      url: '',
      html_url: '',
      badge_url: '',
    },
  ],
};

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhRepoWorkflowsInfinite', () => {
  it('returns data on success', async () => {
    mockWorkflows.mockResolvedValue(mockResponse);
    const { result } = renderHook(() => useGhRepoWorkflowsInfinite('owner', 'repo'), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data?.pages[0]).toEqual(mockResponse);
  });

  it('returns error on failure', async () => {
    mockWorkflows.mockRejectedValue(new GitHubApiError(404, 'Not Found'));
    const { result } = renderHook(() => useGhRepoWorkflowsInfinite('owner', 'repo'), { wrapper });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when owner is empty', () => {
    const { result } = renderHook(() => useGhRepoWorkflowsInfinite('', 'repo'), { wrapper });
    expect(result.current.isLoading).toBe(false);
    expect(mockWorkflows).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useGhRepoWorkflowsInfinite('owner', 'repo', undefined, { enabled: false }),
      { wrapper },
    );
    expect(result.current.isLoading).toBe(false);
    expect(mockWorkflows).not.toHaveBeenCalled();
  });
  it('accepts queryOptions', async () => {
    mockWorkflows.mockResolvedValue(mockResponse);
    const { result } = renderHook(
      () => useGhRepoWorkflowsInfinite('owner', 'repo', { queryOptions: { staleTime: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
