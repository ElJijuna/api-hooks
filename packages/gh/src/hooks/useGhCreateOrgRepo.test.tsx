import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { GitHubClient, type GitHubRepository } from 'gh-api-client';
import type { ReactNode } from 'react';
import { useGhCreateOrgRepo } from './useGhCreateOrgRepo.js';

const mockCreateRepo = jest.fn<(data: object) => Promise<GitHubRepository>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(GitHubClient.prototype, 'org').mockReturnValue({
    createRepo: mockCreateRepo,
  } as unknown as ReturnType<GitHubClient['org']>);
});

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhCreateOrgRepo', () => {
  it('creates an org repo', async () => {
    const repo = { id: 1, name: 'hello' } as unknown as GitHubRepository;
    mockCreateRepo.mockResolvedValue(repo);

    const { result } = renderHook(() => useGhCreateOrgRepo('octo-org'), { wrapper });

    act(() => {
      result.current.mutate({ name: 'hello' });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(repo);
    expect(mockCreateRepo).toHaveBeenCalledWith({ name: 'hello' });
  });
  it('accepts mutationOptions', async () => {
    const repo = { id: 1, name: 'hello' } as unknown as GitHubRepository;
    mockCreateRepo.mockResolvedValue(repo);
    const onSuccess = jest.fn();
    const { result } = renderHook(
      () => useGhCreateOrgRepo('octo-org', { mutationOptions: { onSuccess } }),
      { wrapper },
    );
    act(() => {
      result.current.mutate({ name: 'hello' });
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(onSuccess).toHaveBeenCalled();
  });
});
