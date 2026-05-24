import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  GitHubClient,
  GitHubApiError,
  type GitHubOrganization,
  type GitHubPagedResponse,
} from 'gh-api-client';
import { useGhUserOrganizations } from './useGhUserOrganizations.js';

const mockOrganizations = jest.fn<
  (params?: object, signal?: AbortSignal) => Promise<GitHubPagedResponse<GitHubOrganization>>
>();

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .spyOn(GitHubClient.prototype, 'user')
    .mockReturnValue({
      organizations: mockOrganizations,
    } as unknown as ReturnType<GitHubClient['user']>);
});

const response = {
  values: [
    {
      id: 1,
      login: 'github',
      name: 'GitHub',
      description: null,
      avatar_url: '',
      html_url: 'https://github.com/github',
      repos_url: '',
      public_repos: 1,
      public_gists: 0,
      followers: 0,
      following: 0,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      type: 'Organization',
    },
  ],
  hasNextPage: false,
} satisfies GitHubPagedResponse<GitHubOrganization>;

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhUserOrganizations', () => {
  it('returns organizations on success', async () => {
    mockOrganizations.mockResolvedValue(response);

    const { result } = renderHook(
      () => useGhUserOrganizations('octocat', { per_page: 10 }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(response);
    expect(result.current.isError).toBe(false);
    expect(mockOrganizations).toHaveBeenCalledWith({ per_page: 10 }, expect.anything());
  });

  it('returns error on failure', async () => {
    mockOrganizations.mockRejectedValue(new GitHubApiError(404, 'Not Found'));

    const { result } = renderHook(() => useGhUserOrganizations('missing'), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(GitHubApiError);
  });

  it('does not fetch when login is empty', () => {
    const { result } = renderHook(() => useGhUserOrganizations(''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockOrganizations).not.toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const { result } = renderHook(
      () => useGhUserOrganizations('octocat', undefined, { enabled: false }),
      { wrapper }
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockOrganizations).not.toHaveBeenCalled();
  });
});
