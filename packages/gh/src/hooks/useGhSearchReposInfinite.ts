import { useMemo } from 'react';
import { useInfiniteQuery, type UseInfiniteQueryResult, type InfiniteData } from '@tanstack/react-query';
import { GitHubClient, type GitHubRepository, type GitHubPagedResponse, type SearchReposParams } from 'gh-api-client';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhSearchReposInfiniteOptions {
  /** Disable the query. Also disabled when `params.q` is empty. */
  enabled?: boolean;
  /** GitHub personal access token. */
  token?: string;
}

/**
 * Infinite-scroll variant of `useGhSearchRepos`.
 *
 * @param params - Search params without `page`. `q` is required.
 * @param options - Query options
 * @returns TanStack Infinite Query result with pages of `GitHubPagedResponse<GitHubRepository>`
 */
export function useGhSearchReposInfinite(
  params: Omit<SearchReposParams, 'page'>,
  options: UseGhSearchReposInfiniteOptions = {}
): UseInfiniteQueryResult<InfiniteData<GitHubPagedResponse<GitHubRepository>, number>, Error> {
  const { enabled = true, token } = options;
  const client = useMemo(() => new GitHubClient(token ? { token } : {}), [token]);

  return useInfiniteQuery({
    queryKey: ghQueryKeys.searchReposInfinite(params),
    queryFn: ({ pageParam, signal }) =>
      client.searchRepos({ ...params, page: pageParam }, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.nextPage : undefined,
    enabled: enabled && params.q.length > 0,
  });
}
