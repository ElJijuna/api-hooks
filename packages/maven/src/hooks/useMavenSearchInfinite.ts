import {
  type InfiniteData,
  type UseInfiniteQueryResult,
  useInfiniteQuery,
} from '@tanstack/react-query';
import type { MavenSearchParams, MavenSearchResult } from 'maven-api-client';
import { mavenQueryKeys } from '../keys/mavenQueryKeys.js';
import { useMavenClient } from '../MavenClientContext.js';
import type { InfiniteQueryOverrides } from '../types.js';

export interface UseMavenSearchInfiniteOptions extends Omit<MavenSearchParams, 'start'> {
  /** Disable the query. */
  enabled?: boolean;
  queryOptions?: InfiniteQueryOverrides<MavenSearchResult>;
}

/**
 * Infinite-scroll variant of `useMavenSearch`.
 *
 * Each page is fetched by advancing the `start` offset by `rows`. Call
 * `fetchNextPage()` to load the next batch. Results accumulate in `data.pages`.
 *
 * @param options - Same as `useMavenSearch` params but without `start` (managed internally)
 * @returns TanStack Infinite Query result with pages of {@link MavenSearchResult}
 */
export function useMavenSearchInfinite(
  options: UseMavenSearchInfiniteOptions = {},
): UseInfiniteQueryResult<InfiniteData<MavenSearchResult, number>, Error> {
  const { enabled = true, queryOptions, ...rest } = options;
  const rows = rest.rows ?? 20;
  const client = useMavenClient();

  return useInfiniteQuery({
    queryKey: mavenQueryKeys.searchInfinite(rest),
    queryFn: ({ pageParam, signal }) => client.search({ ...rest, start: pageParam }, signal),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      const nextStart = lastPageParam + rows;
      return nextStart < lastPage.response.numFound ? nextStart : undefined;
    },
    ...queryOptions,
    enabled,
  });
}
