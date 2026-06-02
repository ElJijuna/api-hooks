import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { NpmPackageVersion } from 'npmjs-api-client';
import { npmQueryKeys } from '../keys/npmQueryKeys.js';
import { useNpmClient } from '../NpmClientContext.js';

export interface UseNpmPackageVersionOptions {
  /** Disable the query. Also disabled when `name` or `version` is empty. */
  enabled?: boolean;
}

/**
 * Fetches the manifest for a specific published version.
 *
 * @param name - Package name (e.g. `'react'`)
 * @param version - Exact version string (e.g. `'18.2.0'`)
 * @param options - Query options
 * @returns TanStack Query result with {@link NpmPackageVersion}
 */
export function useNpmPackageVersion(
  name: string,
  version: string,
  options: UseNpmPackageVersionOptions = {},
): UseQueryResult<NpmPackageVersion, Error> {
  const { enabled = true } = options;
  const client = useNpmClient();

  return useQuery<NpmPackageVersion, Error>({
    queryKey: npmQueryKeys.packageVersion(name, version),
    queryFn: ({ signal }) => client.package(name).version(version).get(signal),
    enabled: enabled && name.length > 0 && version.length > 0,
  });
}
