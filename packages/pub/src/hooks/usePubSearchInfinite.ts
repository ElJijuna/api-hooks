import {
  type InfiniteData,
  type UseInfiniteQueryResult,
  useInfiniteQuery,
} from '@tanstack/react-query';
import type { PubSearchParams, PubSearchResult } from 'pub-api-client';
import { pubQueryKeys } from '../keys/pubQueryKeys.js';
import { usePubClient } from '../PubClientContext.js';
import type { InfiniteQueryOverrides } from '../types.js';

export interface UsePubSearchInfiniteOptions extends Omit<PubSearchParams, 'page'> {
  /** Disable the query. */
  enabled?: boolean;
  queryOptions?: InfiniteQueryOverrides<PubSearchResult>;
}

/**
 * Infinite-scroll variant of `usePubSearch`.
 *
 * Each page is fetched by advancing the 1-based `page` number. Continues while
 * `lastPage.next` is present. Call `fetchNextPage()` to load the next batch —
 * results accumulate in `data.pages`.
 *
 * @param options - Same as `usePubSearch` params but without `page` (managed internally)
 * @returns TanStack Infinite Query result with pages of {@link PubSearchResult}
 */
export function usePubSearchInfinite(
  options: UsePubSearchInfiniteOptions = {},
): UseInfiniteQueryResult<InfiniteData<PubSearchResult, number>, Error> {
  const { enabled = true, queryOptions, ...rest } = options;
  const client = usePubClient();

  return useInfiniteQuery({
    queryKey: pubQueryKeys.searchInfinite(rest),
    queryFn: ({ pageParam, signal }) => client.search({ ...rest, page: pageParam }, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, lastPageParam) =>
      lastPage.next ? lastPageParam + 1 : undefined,
    ...queryOptions,
    enabled,
  });
}
