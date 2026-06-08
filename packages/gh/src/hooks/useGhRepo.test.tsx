import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { GitHubApiError, GitHubClient, type GitHubRepository } from 'gh-api-client';
import type { ReactNode } from 'react';
import { useGhRepo } from './useGhRepo.js';

const mockGet = jest.fn<(signal?: AbortSignal) => Promise<GitHubRepository>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .spyOn(GitHubClient.prototype, 'repo')
    .mockReturnValue({ get: mockGet } as unknown as ReturnType<GitHubClient['repo']>);
});

const mockRepo = {
  id: 1,
  name: 'Hello-World',
  full_name: 'octocat/Hello-World',
} as unknown as GitHubRepository;

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhRepo', () => {
  it('returns data on success', async () => {
    mockGet.mockResolvedValue(mockRepo);
    const { result } = renderHook(() => useGhRepo('octocat', 'Hello-World'), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual(mockRepo);
    expect(result.current.isError).toBe(false);
    expect(mockGet).toHaveBeenCalledWith(expect.anything());
  });

  it('returns error on failure', async () => {
    mockGet.mockRejectedValue(new GitHubApiError(404, 'Not Found'));
    const { result } = renderHook(() => useGhRepo('octocat', 'nonexistent'), { wrapper });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when owner is empty', () => {
    const { result } = renderHook(() => useGhRepo('', 'Hello-World'), { wrapper });
    expect(result.current.isLoading).toBe(false);
    expect(mockGet).not.toHaveBeenCalled();
  });

  it('does not fetch when repo is empty', () => {
    const { result } = renderHook(() => useGhRepo('octocat', ''), { wrapper });
    expect(result.current.isLoading).toBe(false);
    expect(mockGet).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(() => useGhRepo('octocat', 'Hello-World', { enabled: false }), {
      wrapper,
    });
    expect(result.current.isLoading).toBe(false);
    expect(mockGet).not.toHaveBeenCalled();
  });
});
