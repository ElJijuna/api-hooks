import { useInfiniteQuery, type UseInfiniteQueryResult, type InfiniteData } from '@tanstack/react-query';
import { type GitHubRepository, type GitHubPagedResponse, type ReposParams } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhUserReposInfiniteOptions {
  /** Disable the query. Also disabled when `login` is empty. */
  enabled?: boolean;
}

/**
 * Infinite-scroll variant of `useGhUserRepos`.
 *
 * @param login - GitHub username
 * @param params - Optional filter params (without `page`)
 * @param options - Query options
 * @returns TanStack Infinite Query result with pages of `GitHubPagedResponse<GitHubRepository>`
 */
export function useGhUserReposInfinite(
  login: string,
  params?: Omit<ReposParams, 'page'>,
  options: UseGhUserReposInfiniteOptions = {}
): UseInfiniteQueryResult<InfiniteData<GitHubPagedResponse<GitHubRepository>, number>, Error> {
  const { enabled = true } = options;

  const client = useGhClient();

  return useInfiniteQuery({
    queryKey: ghQueryKeys.userReposInfinite(login, params),
    queryFn: ({ pageParam, signal }) =>
      client.user(login).repos({ ...params, page: pageParam }, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.nextPage : undefined,
    enabled: enabled && login.length > 0,
  });
}
