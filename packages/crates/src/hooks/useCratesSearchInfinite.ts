import {
  type InfiniteData,
  type UseInfiniteQueryResult,
  useInfiniteQuery,
} from '@tanstack/react-query';
import type { CratesSearchParams, CratesSearchResult } from 'crates-api-client';
import { useCratesClient } from '../CratesClientContext.js';
import { cratesQueryKeys } from '../keys/cratesQueryKeys.js';
import type { InfiniteQueryOverrides } from '../types.js';

export interface UseCratesSearchInfiniteOptions extends Omit<CratesSearchParams, 'page'> {
  /** Disable the query. */
  enabled?: boolean;
  queryOptions?: InfiniteQueryOverrides<CratesSearchResult>;
}

/**
 * Infinite-scroll variant of `useCratesSearch`.
 *
 * Each page is fetched by advancing the 1-based `page` number. Call
 * `fetchNextPage()` to load the next batch. Results accumulate in `data.pages`.
 *
 * @param options - Same as `useCratesSearch` params but without `page` (managed internally)
 * @returns TanStack Infinite Query result with pages of {@link CratesSearchResult}
 */
export function useCratesSearchInfinite(
  options: UseCratesSearchInfiniteOptions = {},
): UseInfiniteQueryResult<InfiniteData<CratesSearchResult, number>, Error> {
  const { enabled = true, queryOptions, ...rest } = options;
  const perPage = rest.perPage ?? 10;
  const client = useCratesClient();

  return useInfiniteQuery({
    queryKey: cratesQueryKeys.searchInfinite(rest),
    queryFn: ({ pageParam, signal }) => client.search({ ...rest, page: pageParam }, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      const fetchedSoFar = lastPageParam * perPage;
      return fetchedSoFar < lastPage.meta.total ? lastPageParam + 1 : undefined;
    },
    ...queryOptions,
    enabled,
  });
}
