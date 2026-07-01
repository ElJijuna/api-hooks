import {
  type InfiniteData,
  type UseInfiniteQueryResult,
  useInfiniteQuery,
} from '@tanstack/react-query';
import type { GistFork, GitHubPagedResponse, PaginationParams } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';
import type { InfiniteQueryOverrides } from '../types.js';

export interface UseGhGistForksInfiniteOptions {
  /** Disable the query. */
  enabled?: boolean;
  queryOptions?: InfiniteQueryOverrides<GitHubPagedResponse<GistFork>>;
}

/**
 * Infinite-scroll variant of `useGhGistForks`.
 *
 * @param gistId - Gist ID
 * @param params - Optional params (`PaginationParams` without `page`)
 * @param options - Query options including optional `token`
 * @returns TanStack Infinite Query result with pages of `GitHubPagedResponse<GistFork>`
 */
export function useGhGistForksInfinite(
  gistId: string,
  params?: Omit<PaginationParams, 'page'>,
  options: UseGhGistForksInfiniteOptions = {},
): UseInfiniteQueryResult<InfiniteData<GitHubPagedResponse<GistFork>, number>, Error> {
  const { enabled = true, queryOptions } = options;

  const client = useGhClient();

  return useInfiniteQuery({
    queryKey: ghQueryKeys.gistForksInfinite(gistId, params),
    queryFn: ({ pageParam, signal }) =>
      client.gist(gistId).forks({ ...params, page: pageParam }, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.nextPage : undefined),
    ...queryOptions,
    enabled: enabled && gistId.length > 0,
  });
}
