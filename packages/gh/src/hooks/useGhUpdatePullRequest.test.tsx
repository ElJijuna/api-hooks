import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { PullRequestResource } from 'gh-api-client';
import { GitHubApiError, GitHubClient, type GitHubPullRequest } from 'gh-api-client';
import type { ReactNode } from 'react';
import { useGhUpdatePullRequest } from './useGhUpdatePullRequest.js';

type UpdatePullRequestData = Parameters<PullRequestResource['update']>[0];

const mockUpdate = jest.fn<(data: UpdatePullRequestData) => Promise<GitHubPullRequest>>();
const mockPullRequest = jest.fn().mockReturnValue({ update: mockUpdate });

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(GitHubClient.prototype, 'repo').mockReturnValue({
    pullRequest: mockPullRequest,
  } as unknown as ReturnType<GitHubClient['repo']>);
});

const mockPR = {
  id: 1,
  number: 42,
  title: 'Updated PR',
  state: 'open',
} as unknown as GitHubPullRequest;
const updateData: UpdatePullRequestData = { title: 'Updated PR' };

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhUpdatePullRequest', () => {
  it('returns updated PR on success', async () => {
    mockUpdate.mockResolvedValue(mockPR);

    const { result } = renderHook(() => useGhUpdatePullRequest('owner', 'repo', 42), { wrapper });

    act(() => {
      result.current.mutate(updateData);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockPR);
    expect(mockUpdate).toHaveBeenCalledWith(updateData);
  });

  it('returns error on failure', async () => {
    mockUpdate.mockRejectedValue(new GitHubApiError(422, 'Unprocessable Entity'));

    const { result } = renderHook(() => useGhUpdatePullRequest('owner', 'repo', 42), { wrapper });

    act(() => {
      result.current.mutate(updateData);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('is idle before mutate is called', () => {
    const { result } = renderHook(() => useGhUpdatePullRequest('owner', 'repo', 42), { wrapper });

    expect(result.current.isIdle).toBe(true);
  });
  it('accepts mutationOptions', async () => {
    mockUpdate.mockResolvedValue(mockPR);
    const onSuccess = jest.fn();
    const { result } = renderHook(
      () => useGhUpdatePullRequest('owner', 'repo', 42, { mutationOptions: { onSuccess } }),
      { wrapper },
    );
    act(() => {
      result.current.mutate(updateData);
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(onSuccess).toHaveBeenCalled();
  });
});
