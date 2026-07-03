import {
  type InfiniteData,
  type UseInfiniteQueryResult,
  useInfiniteQuery,
} from '@tanstack/react-query';
import type { SwiftSearchParams, SwiftSearchResult } from 'swiftpm-api-client';
import { swiftpmQueryKeys } from '../keys/swiftpmQueryKeys.js';
import { useSwiftPMClient } from '../SwiftPMClientContext.js';
import type { InfiniteQueryOverrides } from '../types.js';

export interface UseSwiftPMSearchInfiniteOptions extends Omit<SwiftSearchParams, 'page' | 'query'> {
  /** Disable the query. Also disabled when `query` is empty. */
  enabled?: boolean;
  queryOptions?: InfiniteQueryOverrides<SwiftSearchResult>;
}

/**
 * Infinite-scroll variant of `useSwiftPMSearch`.
 *
 * Each page is fetched by advancing the 1-based `page` number. Continues while
 * `lastPage.hasMoreResults` is `true`. Call `fetchNextPage()` to load the next
 * batch — results accumulate in `data.pages`.
 *
 * @param query - Keyword query string
 * @param options - Same as `useSwiftPMSearch` params but without `page` (managed internally)
 * @returns TanStack Infinite Query result with pages of {@link SwiftSearchResult}
 */
export function useSwiftPMSearchInfinite(
  query: string,
  options: UseSwiftPMSearchInfiniteOptions = {},
): UseInfiniteQueryResult<InfiniteData<SwiftSearchResult, number>, Error> {
  const { enabled = true, queryOptions, ...rest } = options;
  const client = useSwiftPMClient();

  return useInfiniteQuery({
    queryKey: swiftpmQueryKeys.searchInfinite({ query, ...rest }),
    queryFn: ({ pageParam, signal }) => client.search({ query, ...rest, page: pageParam }, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, lastPageParam) =>
      lastPage.hasMoreResults ? lastPageParam + 1 : undefined,
    ...queryOptions,
    enabled: enabled && query.length > 0,
  });
}
