import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { DepsDevDependencies } from 'npmjs-api-client';
import { npmQueryKeys } from '../keys/npmQueryKeys.js';
import { useNpmClient } from '../NpmClientContext.js';
import type { QueryOverrides } from '../types.js';

export interface UseNpmPackageVersionDependenciesOptions {
  /** Disable the query. Also disabled when `name` or `version` is empty. */
  enabled?: boolean;
  queryOptions?: QueryOverrides<DepsDevDependencies>;
}

/**
 * Fetches the fully resolved dependency graph for a specific version from deps.dev.
 *
 * Unlike the semver ranges in `package.json`, this returns exact resolved versions
 * for every direct and transitive dependency, along with the dependency graph edges.
 *
 * @param name - Package name (e.g. `'react'`)
 * @param version - Version string (e.g. `'18.2.0'`)
 * @param options - Query options
 * @returns TanStack Query result with {@link DepsDevDependencies}
 */
export function useNpmPackageVersionDependencies(
  name: string,
  version: string,
  options: UseNpmPackageVersionDependenciesOptions = {},
): UseQueryResult<DepsDevDependencies, Error> {
  const { enabled = true, queryOptions } = options;
  const client = useNpmClient();

  return useQuery<DepsDevDependencies, Error>({
    queryKey: npmQueryKeys.packageVersionDependencies(name, version),
    queryFn: ({ signal }) => client.package(name).version(version).dependencies(signal),
    ...queryOptions,
    enabled: enabled && name.length > 0 && version.length > 0,
  });
}
