import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { PyPIFile } from 'pypi-api-client';
import { pypiQueryKeys } from '../keys/pypiQueryKeys.js';
import { usePyPIClient } from '../PyPIClientContext.js';
import type { UsePyPIQueryOptions } from './options.js';

/**
 * Fetches distribution files for a specific PyPI project version.
 *
 * @param name - PyPI project name (e.g. `'requests'`)
 * @param version - Version string (e.g. `'2.31.0'`)
 * @param options - Query options
 * @returns TanStack Query result with {@link PyPIFile} entries
 */
export function usePyPIVersionFiles(
  name: string,
  version: string,
  options: UsePyPIQueryOptions = {},
): UseQueryResult<PyPIFile[], Error> {
  const { enabled = true, queryOptions } = options;
  const client = usePyPIClient();

  return useQuery<PyPIFile[], Error>({
    queryKey: pypiQueryKeys.versionFiles(name, version),
    queryFn: ({ signal }) => client.package(name).version(version).files(signal),
    ...queryOptions,
    enabled: enabled && name.length > 0 && version.length > 0,
  });
}
