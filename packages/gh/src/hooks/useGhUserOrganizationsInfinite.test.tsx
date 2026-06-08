import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { GitHubClient, type GitHubOrganization, type GitHubPagedResponse } from 'gh-api-client';
import type { ReactNode } from 'react';
import { useGhUserOrganizationsInfinite } from './useGhUserOrganizationsInfinite.js';

const mockOrganizations =
  jest.fn<
    (params?: object, signal?: AbortSignal) => Promise<GitHubPagedResponse<GitHubOrganization>>
  >();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(GitHubClient.prototype, 'user').mockReturnValue({
    organizations: mockOrganizations,
  } as unknown as ReturnType<GitHubClient['user']>);
});

const page = {
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
  hasNextPage: true,
  nextPage: 2,
} satisfies GitHubPagedResponse<GitHubOrganization>;

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGhUserOrganizationsInfinite', () => {
  it('returns organizations on success', async () => {
    mockOrganizations.mockResolvedValue(page);

    const { result } = renderHook(
      () => useGhUserOrganizationsInfinite('octocat', { per_page: 10 }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data?.pages[0]).toEqual(page);
    expect(result.current.hasNextPage).toBe(true);
    expect(mockOrganizations).toHaveBeenCalledWith({ per_page: 10, page: 1 }, expect.anything());
  });

  it('does not fetch when login is empty', () => {
    const { result } = renderHook(() => useGhUserOrganizationsInfinite(''), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(mockOrganizations).not.toHaveBeenCalled();
  });
});
