import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import {
  type MetadataOptions,
  type PackageMetadataResponse,
  type PackageName,
} from 'php-packagist-api-client';
import { usePackagistClient } from '../PackagistClientContext.js';
import { packagistQueryKeys } from '../keys/packagistQueryKeys.js';
import type { UsePackagistQueryOptions } from './options.js';

/**
 * Fetches Composer v2 metadata for a Packagist package.
 *
 * @param name - Composer package name
 * @param params - Metadata options
 * @param options - Query options
 * @returns TanStack Query result with {@link PackageMetadataResponse}
 */
export function usePackagistPackageMetadata(
  name: PackageName | string,
  params?: MetadataOptions,
  options: UsePackagistQueryOptions = {},
): UseQueryResult<PackageMetadataResponse, Error> {
  const { enabled = true } = options;
  const client = usePackagistClient();

  return useQuery<PackageMetadataResponse, Error>({
    queryKey: packagistQueryKeys.packageMetadata(name, params),
    queryFn: ({ signal }) => client.package(name as PackageName).metadata(params, signal),
    enabled: enabled && name.length > 0,
  });
}
