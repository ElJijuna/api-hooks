import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { PyPIDepsDevDependencies } from 'pypi-api-client';
import { pypiQueryKeys } from '../keys/pypiQueryKeys.js';
import { usePyPIClient } from '../PyPIClientContext.js';
import type { UsePyPIQueryOptions } from './options.js';

/**
 * Fetches the resolved deps.dev dependency graph for a specific PyPI project version.
 *
 * @param name - PyPI project name (e.g. `'requests'`)
 * @param version - Version string (e.g. `'2.31.0'`)
 * @param options - Query options
 * @returns TanStack Query result with {@link PyPIDepsDevDependencies}
 */
export function usePyPIVersionDependencies(
  name: string,
  version: string,
  options: UsePyPIQueryOptions = {},
): UseQueryResult<PyPIDepsDevDependencies, Error> {
  const { enabled = true, queryOptions } = options;
  const client = usePyPIClient();

  return useQuery<PyPIDepsDevDependencies, Error>({
    queryKey: pypiQueryKeys.versionDependencies(name, version),
    queryFn: ({ signal }) => client.package(name).version(version).dependencies(signal),
    ...queryOptions,
    enabled: enabled && name.length > 0 && version.length > 0,
  });
}
