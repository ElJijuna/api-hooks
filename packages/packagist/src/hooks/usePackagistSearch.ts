import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { SearchPackagesOptions, SearchPackagesResponse } from 'php-packagist-api-client';
import { packagistQueryKeys } from '../keys/packagistQueryKeys.js';
import { usePackagistClient } from '../PackagistClientContext.js';
import type { UsePackagistQueryOptions } from './options.js';

function hasSearchFilter(params: SearchPackagesOptions) {
  return Boolean(
    params.query || params.type || (Array.isArray(params.tags) ? params.tags.length : params.tags),
  );
}

/**
 * Searches Packagist packages by query, tag, type, or combined filters.
 *
 * @param params - Packagist search filters
 * @param options - Query options
 * @returns TanStack Query result with {@link SearchPackagesResponse}
 */
export function usePackagistSearch(
  params: SearchPackagesOptions,
  options: UsePackagistQueryOptions = {},
): UseQueryResult<SearchPackagesResponse, Error> {
  const { enabled = true, queryOptions } = options;
  const client = usePackagistClient();

  return useQuery<SearchPackagesResponse, Error>({
    queryKey: packagistQueryKeys.search(params),
    queryFn: ({ signal }) => client.search(params, signal),
    ...queryOptions,
    enabled: enabled && hasSearchFilter(params),
  });
}
