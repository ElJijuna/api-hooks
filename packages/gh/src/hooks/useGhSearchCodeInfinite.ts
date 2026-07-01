import {
  type InfiniteData,
  type UseInfiniteQueryResult,
  useInfiniteQuery,
} from '@tanstack/react-query';
import type { GitHubCodeResult, GitHubPagedResponse, SearchCodeParams } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';
import type { InfiniteQueryOverrides } from '../types.js';

export interface UseGhSearchCodeInfiniteOptions {
  /** Disable the query. Also disabled when `params.q` is empty. */
  enabled?: boolean;
  queryOptions?: InfiniteQueryOverrides<GitHubPagedResponse<GitHubCodeResult>>;
}

/**
 * Infinite-scroll variant of `useGhSearchCode`.
 *
 * @param params - Search params without `page`. `q` is required.
 * @param options - Query options
 * @returns TanStack Infinite Query result with pages of `GitHubPagedResponse<GitHubCodeResult>`
 */
export function useGhSearchCodeInfinite(
  params: Omit<SearchCodeParams, 'page'>,
  options: UseGhSearchCodeInfiniteOptions = {},
): UseInfiniteQueryResult<InfiniteData<GitHubPagedResponse<GitHubCodeResult>, number>, Error> {
  const { enabled = true, queryOptions } = options;

  const client = useGhClient();

  return useInfiniteQuery({
    queryKey: ghQueryKeys.searchCodeInfinite(params),
    queryFn: ({ pageParam, signal }) => client.searchCode({ ...params, page: pageParam }, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.nextPage : undefined),
    ...queryOptions,
    enabled: enabled && params.q.length > 0,
  });
}
