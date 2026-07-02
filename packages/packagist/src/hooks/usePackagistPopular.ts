import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { PopularPackagesOptions, PopularPackagesResponse } from 'php-packagist-api-client';
import { packagistQueryKeys } from '../keys/packagistQueryKeys.js';
import { usePackagistClient } from '../PackagistClientContext.js';
import type { UsePackagistQueryOptions } from './options.js';

/**
 * Lists popular Packagist packages.
 *
 * @param params - Pagination options
 * @param options - Query options
 * @returns TanStack Query result with {@link PopularPackagesResponse}
 */
export function usePackagistPopular(
  params?: PopularPackagesOptions,
  options: UsePackagistQueryOptions = {},
): UseQueryResult<PopularPackagesResponse, Error> {
  const { enabled = true, queryOptions } = options;
  const client = usePackagistClient();

  return useQuery<PopularPackagesResponse, Error>({
    queryKey: packagistQueryKeys.popular(params),
    queryFn: ({ signal }) => client.popular(params, signal),
    ...queryOptions,
    enabled,
  });
}
