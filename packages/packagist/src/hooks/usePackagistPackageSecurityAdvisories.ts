import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { type PackageName, type SecurityAdvisoriesResponse } from 'php-packagist-api-client';
import { usePackagistClient } from '../PackagistClientContext.js';
import { packagistQueryKeys } from '../keys/packagistQueryKeys.js';
import type { UsePackagistQueryOptions } from './options.js';

/**
 * Fetches security advisories for one Packagist package.
 *
 * @param name - Composer package name
 * @param options - Query options
 * @returns TanStack Query result with {@link SecurityAdvisoriesResponse}
 */
export function usePackagistPackageSecurityAdvisories(
  name: PackageName | string,
  options: UsePackagistQueryOptions = {},
): UseQueryResult<SecurityAdvisoriesResponse, Error> {
  const { enabled = true } = options;
  const client = usePackagistClient();

  return useQuery<SecurityAdvisoriesResponse, Error>({
    queryKey: packagistQueryKeys.packageSecurityAdvisories(name),
    queryFn: ({ signal }) => client.package(name as PackageName).securityAdvisories(signal),
    enabled: enabled && name.length > 0,
  });
}
