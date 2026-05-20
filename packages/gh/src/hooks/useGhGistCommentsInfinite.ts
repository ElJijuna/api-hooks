import { useInfiniteQuery, type UseInfiniteQueryResult, type InfiniteData } from '@tanstack/react-query';
import { type GitHubPagedResponse, type GistComment, type PaginationParams } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhGistCommentsInfiniteOptions {
  /** Disable the query. */
  enabled?: boolean;
}

/**
 * Infinite-scroll variant of `useGhGistComments`.
 *
 * @param gistId - Gist ID
 * @param params - Optional params (`PaginationParams` without `page`)
 * @param options - Query options including optional `token`
 * @returns TanStack Infinite Query result with pages of `GitHubPagedResponse<GistComment>`
 */
export function useGhGistCommentsInfinite(
  gistId: string,
  params?: Omit<PaginationParams, 'page'>,
  options: UseGhGistCommentsInfiniteOptions = {}
): UseInfiniteQueryResult<InfiniteData<GitHubPagedResponse<GistComment>, number>, Error> {
  const { enabled = true } = options;

  const client = useGhClient();

  return useInfiniteQuery({
    queryKey: ghQueryKeys.gistCommentsInfinite(gistId, params),
    queryFn: ({ pageParam, signal }) =>
      client.gist(gistId).comments({ ...params, page: pageParam }, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.nextPage : undefined,
    enabled: enabled && gistId.length > 0,
  });
}
