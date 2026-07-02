import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { PackageName, PackageResponse } from 'php-packagist-api-client';
import { packagistQueryKeys } from '../keys/packagistQueryKeys.js';
import { usePackagistClient } from '../PackagistClientContext.js';
import type { UsePackagistQueryOptions } from './options.js';

/**
 * Fetches full Packagist package data.
 *
 * @param name - Composer package name (e.g. `'monolog/monolog'`)
 * @param options - Query options
 * @returns TanStack Query result with {@link PackageResponse}
 */
export function usePackagistPackage(
  name: PackageName | string,
  options: UsePackagistQueryOptions = {},
): UseQueryResult<PackageResponse, Error> {
  const { enabled = true, queryOptions } = options;
  const client = usePackagistClient();

  return useQuery<PackageResponse, Error>({
    queryKey: packagistQueryKeys.package(name),
    queryFn: ({ signal }) => client.package(name as PackageName).get(signal),
    ...queryOptions,
    enabled: enabled && name.length > 0,
  });
}
