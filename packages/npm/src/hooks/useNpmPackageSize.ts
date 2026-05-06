
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { type PackagephobiaSize } from 'npmjs-api-client';
import { npmQueryKeys } from '../keys/npmQueryKeys.js';
import { useNpmClient } from '../NpmClientContext.js';

export interface UseNpmPackageSizeOptions {
  /** Disable the query. Also disabled when `name` is empty. */
  enabled?: boolean;
}

/**
 * Fetches the publish size and full install size (including all transitive dependencies)
 * for the latest version of a package from Packagephobia.
 *
 * @param name - Package name (e.g. `'react'`)
 * @param options - Query options
 * @returns TanStack Query result with {@link PackagephobiaSize}
 */
export function useNpmPackageSize(
  name: string,
  options: UseNpmPackageSizeOptions = {}
): UseQueryResult<PackagephobiaSize, Error> {
  const { enabled = true } = options;
  const client = useNpmClient();

  return useQuery<PackagephobiaSize, Error>({
    queryKey: npmQueryKeys.packageSize(name),
    queryFn: ({ signal }) => client.package(name).size(signal),
    enabled: enabled && name.length > 0,
  });
}
