import {
  type InfiniteData,
  type UseInfiniteQueryResult,
  useInfiniteQuery,
} from '@tanstack/react-query';
import type { NpmSearchParams, NpmSearchResult } from 'npmjs-api-client';
import { npmQueryKeys } from '../keys/npmQueryKeys.js';
import { useNpmClient } from '../NpmClientContext.js';
import type { InfiniteQueryOverrides } from '../types.js';

export interface UseNpmSearchInfiniteOptions extends Omit<NpmSearchParams, 'text' | 'from'> {
  /** Disable the query. Also disabled when `text` is empty. */
  enabled?: boolean;
  queryOptions?: InfiniteQueryOverrides<NpmSearchResult>;
}

/**
 * Infinite-scroll variant of `useNpmSearch`.
 *
 * Each page is fetched by advancing the `from` offset. Call `fetchNextPage()` to
 * load the next batch. Results accumulate in `data.pages`.
 *
 * @param text - Search query (e.g. `'react state management'`)
 * @param options - Same as `useNpmSearch` options but without `from` (managed internally)
 * @returns TanStack Infinite Query result with pages of {@link NpmSearchResult}
 */
export function useNpmSearchInfinite(
  text: string,
  options: UseNpmSearchInfiniteOptions = {},
): UseInfiniteQueryResult<InfiniteData<NpmSearchResult, number>, Error> {
  const { enabled = true, queryOptions, ...rest } = options;
  const size = rest.size ?? 20;
  const client = useNpmClient();

  return useInfiniteQuery({
    queryKey: npmQueryKeys.searchInfinite({ text, ...rest }),
    queryFn: ({ pageParam, signal }) => client.search({ text, ...rest, from: pageParam }, signal),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      const nextFrom = lastPageParam + size;
      return nextFrom < lastPage.total ? nextFrom : undefined;
    },
    ...queryOptions,
    enabled: enabled && text.length > 0,
  });
}
