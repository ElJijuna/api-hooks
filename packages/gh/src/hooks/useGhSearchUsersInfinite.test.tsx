import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GitHubClient, GitHubApiError, type GitHubUser, type GitHubPagedResponse } from 'gh-api-client';
import { useGhSearchUsersInfinite } from './useGhSearchUsersInfinite.js';

const mockSearchUsers = jest.fn<(params?: object, signal?: AbortSignal) => Promise<GitHubPagedResponse<GitHubUser>>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(GitHubClient.prototype, 'searchUsers').mockImplementation(mockSearchUsers);
});

const mockUser = { id: 1, login: 'octocat' } as unknown as GitHubUser;
const mockResponse: GitHubPagedResponse<GitHubUser> = { values: [mockUser], hasNextPage: false, totalCount: 1 };

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhSearchUsersInfinite', () => {
  it('returns data on success', async () => {
    mockSearchUsers.mockResolvedValue(mockResponse);
    const { result } = renderHook(() => useGhSearchUsersInfinite({ q: 'octocat' }), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data?.pages[0]).toEqual(mockResponse);
  });

  it('returns error on failure', async () => {
    mockSearchUsers.mockRejectedValue(new GitHubApiError(401, 'Unauthorized'));
    const { result } = renderHook(() => useGhSearchUsersInfinite({ q: 'octocat' }), { wrapper });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when q is empty', () => {
    const { result } = renderHook(() => useGhSearchUsersInfinite({ q: '' }), { wrapper });
    expect(result.current.isLoading).toBe(false);
    expect(mockSearchUsers).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(() => useGhSearchUsersInfinite({ q: 'octocat' }, { enabled: false }), { wrapper });
    expect(result.current.isLoading).toBe(false);
    expect(mockSearchUsers).not.toHaveBeenCalled();
  });
});
