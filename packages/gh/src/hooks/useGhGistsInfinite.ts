import {
  type InfiniteData,
  type UseInfiniteQueryResult,
  useInfiniteQuery,
} from '@tanstack/react-query';
import type { GistsParams, GitHubGist, GitHubPagedResponse } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';
import type { InfiniteQueryOverrides } from '../types.js';

export interface UseGhGistsInfiniteOptions {
  /** Disable the query. */
  enabled?: boolean;
  queryOptions?: InfiniteQueryOverrides<GitHubPagedResponse<GitHubGist>>;
}

/**
 * Infinite-scroll variant of `useGhGists`.
 *
 * Each page is fetched using `nextPage` from the previous response. Call `fetchNextPage()`
 * to load more. Results accumulate in `data.pages`.
 *
 * @param params - Optional filter params (`GistsParams` from `gh-api-client`, without `page`)
 * @param options - Query options including optional `token`
 * @returns TanStack Infinite Query result with pages of `GitHubPagedResponse<GitHubGist>`
 */
export function useGhGistsInfinite(
  params?: Omit<GistsParams, 'page'>,
  options: UseGhGistsInfiniteOptions = {},
): UseInfiniteQueryResult<InfiniteData<GitHubPagedResponse<GitHubGist>, number>, Error> {
  const { enabled = true, queryOptions } = options;

  const client = useGhClient();

  return useInfiniteQuery({
    queryKey: ghQueryKeys.gistsInfinite(params),
    queryFn: ({ pageParam, signal }) => client.listGists({ ...params, page: pageParam }, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.nextPage : undefined),
    ...queryOptions,
    enabled,
  });
}
