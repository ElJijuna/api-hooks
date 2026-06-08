import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { CommitResource } from 'gh-api-client';
import { GitHubApiError, GitHubClient, type GitHubCommitStatus } from 'gh-api-client';
import type { ReactNode } from 'react';
import { useGhCreateCommitStatus } from './useGhCreateCommitStatus.js';

type CreateStatusData = Parameters<CommitResource['createStatus']>[0];

const mockCreateStatus = jest.fn<(data: CreateStatusData) => Promise<GitHubCommitStatus>>();
const mockCommit = jest.fn().mockReturnValue({ createStatus: mockCreateStatus });

beforeEach(() => {
  jest.clearAllMocks();
  mockCommit.mockReturnValue({ createStatus: mockCreateStatus });
  jest
    .spyOn(GitHubClient.prototype, 'repo')
    .mockReturnValue({ commit: mockCommit } as unknown as ReturnType<GitHubClient['repo']>);
});

const mockStatus = {
  id: 1,
  state: 'success',
  description: 'All checks passed',
  context: 'ci/tests',
  target_url: 'https://ci.example.com/builds/1',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
} as unknown as GitHubCommitStatus;

const statusData: CreateStatusData = {
  state: 'success',
  context: 'ci/tests',
  description: 'All checks passed',
};

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhCreateCommitStatus', () => {
  it('returns created status on success', async () => {
    mockCreateStatus.mockResolvedValue(mockStatus);

    const { result } = renderHook(() => useGhCreateCommitStatus('owner', 'repo', 'abc123'), {
      wrapper,
    });

    act(() => {
      result.current.mutate(statusData);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockStatus);
    expect(mockCreateStatus).toHaveBeenCalledWith(statusData);
  });

  it('returns error on failure', async () => {
    mockCreateStatus.mockRejectedValue(new GitHubApiError(422, 'Unprocessable Entity'));

    const { result } = renderHook(() => useGhCreateCommitStatus('owner', 'repo', 'abc123'), {
      wrapper,
    });

    act(() => {
      result.current.mutate(statusData);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('is idle before mutate is called', () => {
    const { result } = renderHook(() => useGhCreateCommitStatus('owner', 'repo', 'abc123'), {
      wrapper,
    });

    expect(result.current.isIdle).toBe(true);
  });
});
