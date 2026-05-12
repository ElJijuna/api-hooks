import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GitHubClient, GitHubApiError, type GitHubUser, type GitHubPagedResponse } from 'gh-api-client';
import { useGhOrgMembersInfinite } from './useGhOrgMembersInfinite.js';

const mockMembers = jest.fn<(params?: object, signal?: AbortSignal) => Promise<GitHubPagedResponse<GitHubUser>>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(GitHubClient.prototype, 'org').mockReturnValue({ members: mockMembers } as unknown as ReturnType<GitHubClient['org']>);
});

const mockUser = { login: 'octocat', id: 1 } as unknown as GitHubUser;

function makeResponse(hasNextPage: boolean, nextPage?: number): GitHubPagedResponse<GitHubUser> {
  return { values: [mockUser], hasNextPage, nextPage };
}

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhOrgMembersInfinite', () => {
  it('fetches the first page on mount', async () => {
    mockMembers.mockResolvedValue(makeResponse(false));
    const { result } = renderHook(() => useGhOrgMembersInfinite('github'), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data?.pages).toHaveLength(1);
    expect(mockMembers).toHaveBeenCalledWith({ page: 1 }, expect.anything());
  });

  it('fetches the next page when fetchNextPage is called', async () => {
    mockMembers.mockResolvedValueOnce(makeResponse(true, 2)).mockResolvedValueOnce(makeResponse(false));
    const { result } = renderHook(() => useGhOrgMembersInfinite('github'), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    void result.current.fetchNextPage();
    await waitFor(() => expect(result.current.data?.pages).toHaveLength(2));
    expect(mockMembers).toHaveBeenNthCalledWith(2, { page: 2 }, expect.anything());
  });

  it('reports hasNextPage=false on the last page', async () => {
    mockMembers.mockResolvedValue(makeResponse(false));
    const { result } = renderHook(() => useGhOrgMembersInfinite('github'), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.hasNextPage).toBe(false);
  });

  it('returns error on failure', async () => {
    mockMembers.mockRejectedValue(new GitHubApiError(401, 'Unauthorized'));
    const { result } = renderHook(() => useGhOrgMembersInfinite('github'), { wrapper });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(() => useGhOrgMembersInfinite('github', undefined, { enabled: false }), { wrapper });
    expect(result.current.isLoading).toBe(false);
    expect(mockMembers).not.toHaveBeenCalled();
  });
});
