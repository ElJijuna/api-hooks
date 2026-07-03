import {
  type InfiniteData,
  type UseInfiniteQueryResult,
  useInfiniteQuery,
} from '@tanstack/react-query';
import type { HexPackage, HexPackageSearchParams } from 'hex-api-client';
import { useHexClient } from '../HexClientContext.js';
import { hexQueryKeys } from '../keys/hexQueryKeys.js';
import type { InfiniteQueryOverrides } from '../types.js';

export interface UseHexPackagesInfiniteOptions extends Omit<HexPackageSearchParams, 'page'> {
  /** Disable the query. */
  enabled?: boolean;
  queryOptions?: InfiniteQueryOverrides<HexPackage[]>;
}

/**
 * Infinite-scroll variant of `useHexPackages`.
 *
 * Each page is fetched by advancing the 1-based `page` number. Hex.pm's list
 * endpoint returns no total count, so `hasNextPage` is derived heuristically:
 * a full page (`length === per_page`) implies more results may exist. Call
 * `fetchNextPage()` to load the next batch — results accumulate in `data.pages`.
 *
 * @param options - Same as `useHexPackages` params but without `page` (managed internally)
 * @returns TanStack Infinite Query result with pages of `HexPackage[]`
 */
export function useHexPackagesInfinite(
  options: UseHexPackagesInfiniteOptions = {},
): UseInfiniteQueryResult<InfiniteData<HexPackage[], number>, Error> {
  const { enabled = true, queryOptions, ...rest } = options;
  const perPage = rest.per_page ?? 10;
  const client = useHexClient();

  return useInfiniteQuery({
    queryKey: hexQueryKeys.packagesInfinite(rest),
    queryFn: ({ pageParam, signal }) => client.packages({ ...rest, page: pageParam }, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, lastPageParam) =>
      lastPage.length === perPage ? lastPageParam + 1 : undefined,
    ...queryOptions,
    enabled,
  });
}
