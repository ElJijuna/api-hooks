import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { type PackageName, type PackageResponse } from 'php-packagist-api-client';
import { usePackagistClient } from '../PackagistClientContext.js';
import { packagistQueryKeys } from '../keys/packagistQueryKeys.js';
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
  const { enabled = true } = options;
  const client = usePackagistClient();

  return useQuery<PackageResponse, Error>({
    queryKey: packagistQueryKeys.package(name),
    queryFn: ({ signal }) => client.package(name as PackageName).get(signal),
    enabled: enabled && name.length > 0,
  });
}
