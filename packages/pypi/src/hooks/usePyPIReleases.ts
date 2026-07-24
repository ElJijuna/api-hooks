import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { PyPIFile } from 'pypi-api-client';
import { pypiQueryKeys } from '../keys/pypiQueryKeys.js';
import { usePyPIClient } from '../PyPIClientContext.js';
import type { UsePyPIQueryOptions } from './options.js';

/**
 * Fetches the full releases map for a PyPI project.
 *
 * The result maps each version string to its distribution files.
 *
 * @param name - PyPI project name (e.g. `'requests'`)
 * @param options - Query options
 * @returns TanStack Query result with a version-to-files map
 */
export function usePyPIReleases(
  name: string,
  options: UsePyPIQueryOptions = {},
): UseQueryResult<Record<string, PyPIFile[]>, Error> {
  const { enabled = true, queryOptions } = options;
  const client = usePyPIClient();

  return useQuery<Record<string, PyPIFile[]>, Error>({
    queryKey: pypiQueryKeys.releases(name),
    queryFn: ({ signal }) => client.package(name).releases(signal),
    ...queryOptions,
    enabled: enabled && name.length > 0,
  });
}
