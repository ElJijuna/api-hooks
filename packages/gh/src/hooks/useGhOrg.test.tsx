import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { GitHubApiError, GitHubClient, type GitHubOrganization } from 'gh-api-client';
import type { ReactNode } from 'react';
import { useGhOrg } from './useGhOrg.js';

const mockGet = jest.fn<(signal?: AbortSignal) => Promise<GitHubOrganization>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .spyOn(GitHubClient.prototype, 'org')
    .mockReturnValue({ get: mockGet } as unknown as ReturnType<GitHubClient['org']>);
});

const mockOrg = { login: 'github', id: 1 } as unknown as GitHubOrganization;

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhOrg', () => {
  it('returns data on success', async () => {
    mockGet.mockResolvedValue(mockOrg);
    const { result } = renderHook(() => useGhOrg('github'), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual(mockOrg);
    expect(result.current.isError).toBe(false);
    expect(mockGet).toHaveBeenCalledWith(expect.anything());
  });

  it('returns error on failure', async () => {
    mockGet.mockRejectedValue(new GitHubApiError(404, 'Not Found'));
    const { result } = renderHook(() => useGhOrg('nonexistent-org'), { wrapper });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when orgName is empty', () => {
    const { result } = renderHook(() => useGhOrg(''), { wrapper });
    expect(result.current.isLoading).toBe(false);
    expect(mockGet).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(() => useGhOrg('github', { enabled: false }), { wrapper });
    expect(result.current.isLoading).toBe(false);
    expect(mockGet).not.toHaveBeenCalled();
  });
  it('accepts queryOptions', async () => {
    mockGet.mockResolvedValue(mockOrg);
    const { result } = renderHook(() => useGhOrg('github', { queryOptions: { staleTime: 0 } }), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
