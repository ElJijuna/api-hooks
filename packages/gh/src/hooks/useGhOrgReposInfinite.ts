import { useMemo } from 'react';
import { useInfiniteQuery, type UseInfiniteQueryResult, type InfiniteData } from '@tanstack/react-query';
import { GitHubClient, type GitHubRepository, type GitHubPagedResponse, type ReposParams } from 'gh-api-client';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhOrgReposInfiniteOptions {
  /** Disable the query. Also disabled when `orgName` is empty. */
  enabled?: boolean;
  /** GitHub personal access token — required for private repositories. */
  token?: string;
}

/**
 * Infinite-scroll variant of `useGhOrgRepos`.
 *
 * @param orgName - Organization login name
 * @param params - Optional filter params (without `page`)
 * @param options - Query options
 * @returns TanStack Infinite Query result with pages of `GitHubPagedResponse<GitHubRepository>`
 */
export function useGhOrgReposInfinite(
  orgName: string,
  params?: Omit<ReposParams, 'page'>,
  options: UseGhOrgReposInfiniteOptions = {}
): UseInfiniteQueryResult<InfiniteData<GitHubPagedResponse<GitHubRepository>, number>, Error> {
  const { enabled = true, token } = options;
  const client = useMemo(() => new GitHubClient(token ? { token } : {}), [token]);

  return useInfiniteQuery({
    queryKey: ghQueryKeys.orgReposInfinite(orgName, params),
    queryFn: ({ pageParam, signal }) =>
      client.org(orgName).repos({ ...params, page: pageParam }, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.nextPage : undefined,
    enabled: enabled && orgName.length > 0,
  });
}
