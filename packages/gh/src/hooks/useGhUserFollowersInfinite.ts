import { useInfiniteQuery, type UseInfiniteQueryResult, type InfiniteData } from '@tanstack/react-query';
import { type GitHubPagedResponse, type GitHubUser, type PaginationParams } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhUserFollowersInfiniteOptions {
  /** Disable the query. */
  enabled?: boolean;
}

/**
 * Infinite-scroll variant of `useGhUserFollowers`.
 *
 * @param login - GitHub username
 * @param params - Optional params (`PaginationParams` without `page`)
 * @param options - Query options including optional `token`
 * @returns TanStack Infinite Query result with pages of `GitHubPagedResponse<GitHubUser>`
 */
export function useGhUserFollowersInfinite(
  login: string,
  params?: Omit<PaginationParams, 'page'>,
  options: UseGhUserFollowersInfiniteOptions = {}
): UseInfiniteQueryResult<InfiniteData<GitHubPagedResponse<GitHubUser>, number>, Error> {
  const { enabled = true } = options;

  const client = useGhClient();

  return useInfiniteQuery({
    queryKey: ghQueryKeys.userFollowersInfinite(login, params),
    queryFn: ({ pageParam, signal }) =>
      client.user(login).followers({ ...params, page: pageParam }, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.nextPage : undefined,
    enabled: enabled && login.length > 0,
  });
}
