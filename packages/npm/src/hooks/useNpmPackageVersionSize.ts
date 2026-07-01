import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { PackagephobiaSize } from 'npmjs-api-client';
import { npmQueryKeys } from '../keys/npmQueryKeys.js';
import { useNpmClient } from '../NpmClientContext.js';
import type { QueryOverrides } from '../types.js';

export interface UseNpmPackageVersionSizeOptions {
  /** Disable the query. Also disabled when `name` or `version` is empty. */
  enabled?: boolean;
  queryOptions?: QueryOverrides<PackagephobiaSize>;
}

/**
 * Fetches the publish size and full install size for a specific version of a package
 * from Packagephobia.
 *
 * @param name - Package name (e.g. `'react'`)
 * @param version - Version string (e.g. `'18.2.0'`)
 * @param options - Query options
 * @returns TanStack Query result with {@link PackagephobiaSize}
 */
export function useNpmPackageVersionSize(
  name: string,
  version: string,
  options: UseNpmPackageVersionSizeOptions = {},
): UseQueryResult<PackagephobiaSize, Error> {
  const { enabled = true, queryOptions } = options;
  const client = useNpmClient();

  return useQuery<PackagephobiaSize, Error>({
    queryKey: npmQueryKeys.packageVersionSize(name, version),
    queryFn: ({ signal }) => client.package(name).version(version).size(signal),
    ...queryOptions,
    enabled: enabled && name.length > 0 && version.length > 0,
  });
}
