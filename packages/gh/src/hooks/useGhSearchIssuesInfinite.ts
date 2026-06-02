import {
  type InfiniteData,
  type UseInfiniteQueryResult,
  useInfiniteQuery,
} from '@tanstack/react-query';
import type { GitHubIssue, GitHubPagedResponse, SearchIssuesParams } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhSearchIssuesInfiniteOptions {
  /** Disable the query. Also disabled when `params.q` is empty. */
  enabled?: boolean;
}

/**
 * Infinite-scroll variant of `useGhSearchIssues`.
 *
 * @param params - Search params without `page`. `q` is required.
 * @param options - Query options
 * @returns TanStack Infinite Query result with pages of `GitHubPagedResponse<GitHubIssue>`
 */
export function useGhSearchIssuesInfinite(
  params: Omit<SearchIssuesParams, 'page'>,
  options: UseGhSearchIssuesInfiniteOptions = {},
): UseInfiniteQueryResult<InfiniteData<GitHubPagedResponse<GitHubIssue>, number>, Error> {
  const { enabled = true } = options;

  const client = useGhClient();

  return useInfiniteQuery({
    queryKey: ghQueryKeys.searchIssuesInfinite(params),
    queryFn: ({ pageParam, signal }) => client.searchIssues({ ...params, page: pageParam }, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.nextPage : undefined),
    enabled: enabled && params.q.length > 0,
  });
}
