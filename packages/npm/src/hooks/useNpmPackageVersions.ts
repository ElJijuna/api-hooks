import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { NpmPackageVersion } from 'npmjs-api-client';
import { npmQueryKeys } from '../keys/npmQueryKeys.js';
import { useNpmClient } from '../NpmClientContext.js';
import type { QueryOverrides } from '../types.js';

export interface UseNpmPackageVersionsOptions {
  /** Disable the query. Also disabled when `name` is empty. */
  enabled?: boolean;
  queryOptions?: QueryOverrides<NpmPackageVersion[]>;
}

/**
 * Returns all published versions as an array sorted from oldest to newest.
 *
 * @param name - Package name (e.g. `'react'`)
 * @param options - Query options
 * @returns TanStack Query result with `NpmPackageVersion[]`
 */
export function useNpmPackageVersions(
  name: string,
  options: UseNpmPackageVersionsOptions = {},
): UseQueryResult<NpmPackageVersion[], Error> {
  const { enabled = true, queryOptions } = options;
  const client = useNpmClient();

  return useQuery<NpmPackageVersion[], Error>({
    queryKey: npmQueryKeys.packageVersions(name),
    queryFn: ({ signal }) => client.package(name).versions(signal),
    ...queryOptions,
    enabled: enabled && name.length > 0,
  });
}
