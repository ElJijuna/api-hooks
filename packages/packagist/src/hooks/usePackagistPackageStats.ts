import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { PackageName, PackageStatsResponse } from 'php-packagist-api-client';
import { packagistQueryKeys } from '../keys/packagistQueryKeys.js';
import { usePackagistClient } from '../PackagistClientContext.js';
import type { UsePackagistQueryOptions } from './options.js';

/**
 * Fetches download stats for a Packagist package.
 *
 * @param name - Composer package name
 * @param options - Query options
 * @returns TanStack Query result with {@link PackageStatsResponse}
 */
export function usePackagistPackageStats(
  name: PackageName | string,
  options: UsePackagistQueryOptions = {},
): UseQueryResult<PackageStatsResponse, Error> {
  const { enabled = true } = options;
  const client = usePackagistClient();

  return useQuery<PackageStatsResponse, Error>({
    queryKey: packagistQueryKeys.packageStats(name),
    queryFn: ({ signal }) => client.package(name as PackageName).stats(signal),
    enabled: enabled && name.length > 0,
  });
}
