import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { PackageListOptions, PackageListResponse } from 'php-packagist-api-client';
import { packagistQueryKeys } from '../keys/packagistQueryKeys.js';
import { usePackagistClient } from '../PackagistClientContext.js';
import type { UsePackagistQueryOptions } from './options.js';

/**
 * Lists package names from Packagist, optionally filtered by vendor or type.
 *
 * @param params - Packagist list filters
 * @param options - Query options
 * @returns TanStack Query result with {@link PackageListResponse}
 */
export function usePackagistListPackages(
  params?: PackageListOptions,
  options: UsePackagistQueryOptions = {},
): UseQueryResult<PackageListResponse, Error> {
  const { enabled = true, queryOptions } = options;
  const client = usePackagistClient();

  return useQuery<PackageListResponse, Error>({
    queryKey: packagistQueryKeys.listPackages(params),
    queryFn: ({ signal }) => client.listPackages(params, signal),
    ...queryOptions,
    enabled,
  });
}
