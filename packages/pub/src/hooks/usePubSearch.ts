import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { PubSearchParams, PubSearchResult } from 'pub-api-client';
import { pubQueryKeys } from '../keys/pubQueryKeys.js';
import { usePubClient } from '../PubClientContext.js';
import type { UsePubQueryOptions } from './options.js';

/**
 * Searches pub.dev packages by text.
 *
 * @param params - Search parameters (`query`, `page`)
 * @param options - Query options
 * @returns TanStack Query result with {@link PubSearchResult}
 */
export function usePubSearch(
  params: PubSearchParams = {},
  options: UsePubQueryOptions = {},
): UseQueryResult<PubSearchResult, Error> {
  const { enabled = true, queryOptions } = options;
  const client = usePubClient();

  return useQuery<PubSearchResult, Error>({
    queryKey: pubQueryKeys.search(params),
    queryFn: ({ signal }) => client.search(params, signal),
    ...queryOptions,
    enabled,
  });
}
