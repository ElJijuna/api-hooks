import { useMemo } from 'react';
import { useInfiniteQuery, type UseInfiniteQueryResult, type InfiniteData } from '@tanstack/react-query';
import { GitHubClient, type GitHubGist, type GitHubPagedResponse, type GistsParams } from 'gh-api-client';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhGistsInfiniteOptions {
  /** Disable the query. */
  enabled?: boolean;
  /** GitHub personal access token — required to list secret gists. */
  token?: string;
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
  options: UseGhGistsInfiniteOptions = {}
): UseInfiniteQueryResult<InfiniteData<GitHubPagedResponse<GitHubGist>, number>, Error> {
  const { enabled = true, token } = options;
  const client = useMemo(() => new GitHubClient(token ? { token } : {}), [token]);

  return useInfiniteQuery({
    queryKey: ghQueryKeys.gistsInfinite(params),
    queryFn: ({ pageParam, signal }) =>
      client.listGists({ ...params, page: pageParam }, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.nextPage : undefined,
    enabled,
  });
}
