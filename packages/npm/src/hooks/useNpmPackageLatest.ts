import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { NpmPackageVersion } from 'npmjs-api-client';
import { npmQueryKeys } from '../keys/npmQueryKeys.js';
import { useNpmClient } from '../NpmClientContext.js';

export interface UseNpmPackageLatestOptions {
  /** Disable the query. Also disabled when `name` is empty. */
  enabled?: boolean;
}

/**
 * Shorthand for the `latest` dist-tag. Shares the cache with `useNpmPackageVersion(name, 'latest')`.
 *
 * @param name - Package name (e.g. `'typescript'`)
 * @param options - Query options
 * @returns TanStack Query result with {@link NpmPackageVersion}
 */
export function useNpmPackageLatest(
  name: string,
  options: UseNpmPackageLatestOptions = {},
): UseQueryResult<NpmPackageVersion, Error> {
  const { enabled = true } = options;
  const client = useNpmClient();

  return useQuery<NpmPackageVersion, Error>({
    queryKey: npmQueryKeys.packageVersion(name, 'latest'),
    queryFn: ({ signal }) => client.package(name).latest().get(signal),
    enabled: enabled && name.length > 0,
  });
}
