import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { type PackageListOptions, type PackageListResponse } from 'php-packagist-api-client';
import { usePackagistClient } from '../PackagistClientContext.js';
import { packagistQueryKeys } from '../keys/packagistQueryKeys.js';
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
  const { enabled = true } = options;
  const client = usePackagistClient();

  return useQuery<PackageListResponse, Error>({
    queryKey: packagistQueryKeys.listPackages(params),
    queryFn: ({ signal }) => client.listPackages(params, signal),
    enabled,
  });
}
