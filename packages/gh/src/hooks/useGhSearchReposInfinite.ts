import {
  type InfiniteData,
  type UseInfiniteQueryResult,
  useInfiniteQuery,
} from '@tanstack/react-query';
import type { GitHubPagedResponse, GitHubRepository, SearchReposParams } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhSearchReposInfiniteOptions {
  /** Disable the query. Also disabled when `params.q` is empty. */
  enabled?: boolean;
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
  options: UseGhSearchReposInfiniteOptions = {},
): UseInfiniteQueryResult<InfiniteData<GitHubPagedResponse<GitHubRepository>, number>, Error> {
  const { enabled = true } = options;

  const client = useGhClient();

  return useInfiniteQuery({
    queryKey: ghQueryKeys.searchReposInfinite(params),
    queryFn: ({ pageParam, signal }) => client.searchRepos({ ...params, page: pageParam }, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.nextPage : undefined),
    enabled: enabled && params.q.length > 0,
  });
}
