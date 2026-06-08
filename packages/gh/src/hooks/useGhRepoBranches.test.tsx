import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import {
  GitHubApiError,
  type GitHubBranch,
  GitHubClient,
  type GitHubPagedResponse,
} from 'gh-api-client';
import type { ReactNode } from 'react';
import { useGhRepoBranches } from './useGhRepoBranches.js';

const mockBranches =
  jest.fn<(params?: object, signal?: AbortSignal) => Promise<GitHubPagedResponse<GitHubBranch>>>();

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .spyOn(GitHubClient.prototype, 'repo')
    .mockReturnValue({ branches: mockBranches } as unknown as ReturnType<GitHubClient['repo']>);
});

const mockBranch = {
  name: 'main',
  commit: { sha: 'abc123', url: '' },
  protected: false,
} as unknown as GitHubBranch;
const mockResponse: GitHubPagedResponse<GitHubBranch> = {
  values: [mockBranch],
  hasNextPage: false,
};

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhRepoBranches', () => {
  it('returns data on success', async () => {
    mockBranches.mockResolvedValue(mockResponse);
    const { result } = renderHook(() => useGhRepoBranches('octocat', 'Hello-World'), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual(mockResponse);
    expect(result.current.isError).toBe(false);
    expect(mockBranches).toHaveBeenCalledWith(undefined, expect.anything());
  });

  it('passes params to the client', async () => {
    mockBranches.mockResolvedValue(mockResponse);
    const params = { per_page: 10, page: 2 };
    const { result } = renderHook(() => useGhRepoBranches('octocat', 'Hello-World', params), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(mockBranches).toHaveBeenCalledWith(params, expect.anything());
  });

  it('returns error on failure', async () => {
    mockBranches.mockRejectedValue(new GitHubApiError(401, 'Unauthorized'));
    const { result } = renderHook(() => useGhRepoBranches('octocat', 'Hello-World'), { wrapper });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useGhRepoBranches('octocat', 'Hello-World', undefined, { enabled: false }),
      { wrapper },
    );
    expect(result.current.isLoading).toBe(false);
    expect(mockBranches).not.toHaveBeenCalled();
  });
});
