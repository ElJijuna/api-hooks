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
import { useGhSearchUsers } from './useGhSearchUsers.js';

const mockSearchUsers =
  jest.fn<(params?: object, signal?: AbortSignal) => Promise<GitHubPagedResponse<GitHubUser>>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(GitHubClient.prototype, 'searchUsers').mockImplementation(mockSearchUsers);
});

const mockUser = { id: 1, login: 'octocat', name: 'Octocat' } as unknown as GitHubUser;
const mockResponse: GitHubPagedResponse<GitHubUser> = {
  values: [mockUser],
  hasNextPage: false,
  totalCount: 1,
};

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhSearchUsers', () => {
  it('returns data on success', async () => {
    mockSearchUsers.mockResolvedValue(mockResponse);
    const { result } = renderHook(() => useGhSearchUsers({ q: 'octocat' }), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual(mockResponse);
    expect(mockSearchUsers).toHaveBeenCalledWith({ q: 'octocat' }, expect.anything());
  });

  it('returns error on failure', async () => {
    mockSearchUsers.mockRejectedValue(new GitHubApiError(401, 'Unauthorized'));
    const { result } = renderHook(() => useGhSearchUsers({ q: 'octocat' }), { wrapper });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when q is empty', () => {
    const { result } = renderHook(() => useGhSearchUsers({ q: '' }), { wrapper });
    expect(result.current.isLoading).toBe(false);
    expect(mockSearchUsers).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(() => useGhSearchUsers({ q: 'octocat' }, { enabled: false }), {
      wrapper,
    });
    expect(result.current.isLoading).toBe(false);
    expect(mockSearchUsers).not.toHaveBeenCalled();
  });
});
