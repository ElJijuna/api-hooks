import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import {
  GitHubApiError,
  GitHubClient,
  type GitHubPagedResponse,
  type GitHubRepositoryAdvisory,
} from 'gh-api-client';
import type { ReactNode } from 'react';
import { useGhRepoAdvisories } from './useGhRepoAdvisories.js';

const mockRepoAdvisories =
  jest.fn<
    (
      params?: object,
      signal?: AbortSignal,
    ) => Promise<GitHubPagedResponse<GitHubRepositoryAdvisory>>
  >();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(GitHubClient.prototype, 'repo').mockReturnValue({
    repoAdvisories: mockRepoAdvisories,
  } as unknown as ReturnType<GitHubClient['repo']>);
});

const mockResponse: GitHubPagedResponse<GitHubRepositoryAdvisory> = {
  values: [
    {
      ghsa_id: 'GHSA-1234-5678-9abc',
      cve_id: null,
      summary: 'Test vulnerability',
      description: 'Details...',
      severity: 'high',
      state: 'published',
      html_url: 'https://github.com/owner/repo/security/advisories/GHSA-1234-5678-9abc',
      vulnerabilities: [],
      cvss: null,
      cwes: null,
      credits: null,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      published_at: '2024-01-01T00:00:00Z',
      withdrawn_at: null,
    } as unknown as GitHubRepositoryAdvisory,
  ],
  hasNextPage: false,
};

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhRepoAdvisories', () => {
  it('returns data on success', async () => {
    mockRepoAdvisories.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useGhRepoAdvisories('owner', 'repo'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockResponse);
    expect(result.current.isError).toBe(false);
  });

  it('returns error on failure', async () => {
    mockRepoAdvisories.mockRejectedValue(new GitHubApiError(404, 'Not Found'));

    const { result } = renderHook(() => useGhRepoAdvisories('owner', 'repo'), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when owner is empty', () => {
    const { result } = renderHook(() => useGhRepoAdvisories('', 'repo'), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockRepoAdvisories).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useGhRepoAdvisories('owner', 'repo', undefined, { enabled: false }),
      { wrapper },
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockRepoAdvisories).not.toHaveBeenCalled();
  });
  it('accepts queryOptions', async () => {
    mockRepoAdvisories.mockResolvedValue(mockResponse);
    const { result } = renderHook(
      () => useGhRepoAdvisories('owner', 'repo', { queryOptions: { staleTime: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
