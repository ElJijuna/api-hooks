import {
  type InfiniteData,
  type UseInfiniteQueryResult,
  useInfiniteQuery,
} from '@tanstack/react-query';
import type { GitHubPagedResponse, GitHubUser, SearchUsersParams } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhSearchUsersInfiniteOptions {
  /** Disable the query. Also disabled when `params.q` is empty. */
  enabled?: boolean;
}

/**
 * Infinite-scroll variant of `useGhSearchUsers`.
 *
 * @param params - Search params without `page`. `q` is required.
 * @param options - Query options
 * @returns TanStack Infinite Query result with pages of `GitHubPagedResponse<GitHubUser>`
 */
export function useGhSearchUsersInfinite(
  params: Omit<SearchUsersParams, 'page'>,
  options: UseGhSearchUsersInfiniteOptions = {},
): UseInfiniteQueryResult<InfiniteData<GitHubPagedResponse<GitHubUser>, number>, Error> {
  const { enabled = true } = options;

  const client = useGhClient();

  return useInfiniteQuery({
    queryKey: ghQueryKeys.searchUsersInfinite(params),
    queryFn: ({ pageParam, signal }) => client.searchUsers({ ...params, page: pageParam }, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.nextPage : undefined),
    enabled: enabled && params.q.length > 0,
  });
}
