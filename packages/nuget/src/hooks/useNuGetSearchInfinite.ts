import {
  type InfiniteData,
  type UseInfiniteQueryResult,
  useInfiniteQuery,
} from '@tanstack/react-query';
import type { NuGetSearchParams, NuGetSearchResult } from 'nuget-api-client';
import { nugetQueryKeys } from '../keys/nugetQueryKeys.js';
import { useNuGetClient } from '../NuGetClientContext.js';
import type { InfiniteQueryOverrides } from '../types.js';

export interface UseNuGetSearchInfiniteOptions extends Omit<NuGetSearchParams, 'skip'> {
  /** Disable the query. */
  enabled?: boolean;
  queryOptions?: InfiniteQueryOverrides<NuGetSearchResult>;
}

/**
 * Infinite-scroll variant of `useNuGetSearch`.
 *
 * Each page is fetched by advancing the `skip` offset by `take`. Call
 * `fetchNextPage()` to load the next batch. Results accumulate in `data.pages`.
 *
 * @param options - Same as `useNuGetSearch` params but without `skip` (managed internally)
 * @returns TanStack Infinite Query result with pages of {@link NuGetSearchResult}
 */
export function useNuGetSearchInfinite(
  options: UseNuGetSearchInfiniteOptions = {},
): UseInfiniteQueryResult<InfiniteData<NuGetSearchResult, number>, Error> {
  const { enabled = true, queryOptions, ...rest } = options;
  const take = rest.take ?? 20;
  const client = useNuGetClient();

  return useInfiniteQuery({
    queryKey: nugetQueryKeys.searchInfinite(rest),
    queryFn: ({ pageParam, signal }) => client.search({ ...rest, skip: pageParam }, signal),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      const nextSkip = lastPageParam + take;
      return nextSkip < lastPage.totalHits ? nextSkip : undefined;
    },
    ...queryOptions,
    enabled,
  });
}
