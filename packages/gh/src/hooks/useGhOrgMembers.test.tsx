import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import {
  GitHubApiError,
  GitHubClient,
  type GitHubPagedResponse,
  type GitHubUser,
} from 'gh-api-client';
import type { ReactNode } from 'react';
import { useGhOrgMembers } from './useGhOrgMembers.js';

const mockMembers =
  jest.fn<(params?: object, signal?: AbortSignal) => Promise<GitHubPagedResponse<GitHubUser>>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .spyOn(GitHubClient.prototype, 'org')
    .mockReturnValue({ members: mockMembers } as unknown as ReturnType<GitHubClient['org']>);
});

const mockUser = { login: 'octocat', id: 1 } as unknown as GitHubUser;
const mockResponse: GitHubPagedResponse<GitHubUser> = { values: [mockUser], hasNextPage: false };

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhOrgMembers', () => {
  it('returns data on success', async () => {
    mockMembers.mockResolvedValue(mockResponse);
    const { result } = renderHook(() => useGhOrgMembers('github'), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual(mockResponse);
    expect(result.current.isError).toBe(false);
    expect(mockMembers).toHaveBeenCalledWith(undefined, expect.anything());
  });

  it('passes params to the client', async () => {
    mockMembers.mockResolvedValue(mockResponse);
    const params = { per_page: 10, page: 2 };
    const { result } = renderHook(() => useGhOrgMembers('github', params), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(mockMembers).toHaveBeenCalledWith(params, expect.anything());
  });

  it('returns error on failure', async () => {
    mockMembers.mockRejectedValue(new GitHubApiError(401, 'Unauthorized'));
    const { result } = renderHook(() => useGhOrgMembers('github'), { wrapper });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(() => useGhOrgMembers('github', undefined, { enabled: false }), {
      wrapper,
    });
    expect(result.current.isLoading).toBe(false);
    expect(mockMembers).not.toHaveBeenCalled();
  });
  it('accepts queryOptions', async () => {
    mockMembers.mockResolvedValue(mockResponse);
    const { result } = renderHook(
      () => useGhOrgMembers('github', { queryOptions: { staleTime: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
