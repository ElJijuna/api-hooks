import {
  type InfiniteData,
  type UseInfiniteQueryResult,
  useInfiniteQuery,
} from '@tanstack/react-query';
import type { GistCommit, GitHubPagedResponse, PaginationParams } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';
import type { InfiniteQueryOverrides } from '../types.js';

export interface UseGhGistCommitsInfiniteOptions {
  /** Disable the query. */
  enabled?: boolean;
  queryOptions?: InfiniteQueryOverrides<GitHubPagedResponse<GistCommit>>;
}

/**
 * Infinite-scroll variant of `useGhGistCommits`.
 *
 * @param gistId - Gist ID
 * @param params - Optional params (`PaginationParams` without `page`)
 * @param options - Query options including optional `token`
 * @returns TanStack Infinite Query result with pages of `GitHubPagedResponse<GistCommit>`
 */
export function useGhGistCommitsInfinite(
  gistId: string,
  params?: Omit<PaginationParams, 'page'>,
  options: UseGhGistCommitsInfiniteOptions = {},
): UseInfiniteQueryResult<InfiniteData<GitHubPagedResponse<GistCommit>, number>, Error> {
  const { enabled = true, queryOptions } = options;

  const client = useGhClient();

  return useInfiniteQuery({
    queryKey: ghQueryKeys.gistCommitsInfinite(gistId, params),
    queryFn: ({ pageParam, signal }) =>
      client.gist(gistId).commits({ ...params, page: pageParam }, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.nextPage : undefined),
    ...queryOptions,
    enabled: enabled && gistId.length > 0,
  });
}
