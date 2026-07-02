import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { CratesSearchParams, CratesSearchResult } from 'crates-api-client';
import { useCratesClient } from '../CratesClientContext.js';
import { cratesQueryKeys } from '../keys/cratesQueryKeys.js';
import type { UseCratesQueryOptions } from './options.js';

/**
 * Searches crates.io by text, with pagination and sort order.
 *
 * @param params - Search parameters (`query`, `page`, `perPage`, `sort`)
 * @param options - Query options
 * @returns TanStack Query result with {@link CratesSearchResult}
 */
export function useCratesSearch(
  params: CratesSearchParams = {},
  options: UseCratesQueryOptions = {},
): UseQueryResult<CratesSearchResult, Error> {
  const { enabled = true, queryOptions } = options;
  const client = useCratesClient();

  return useQuery<CratesSearchResult, Error>({
    queryKey: cratesQueryKeys.search(params),
    queryFn: ({ signal }) => client.search(params, signal),
    ...queryOptions,
    enabled,
  });
}
