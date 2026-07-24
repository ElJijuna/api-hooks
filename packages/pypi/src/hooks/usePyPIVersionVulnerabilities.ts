import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { PyPIVulnerability } from 'pypi-api-client';
import { pypiQueryKeys } from '../keys/pypiQueryKeys.js';
import { usePyPIClient } from '../PyPIClientContext.js';
import type { UsePyPIQueryOptions } from './options.js';

/**
 * Fetches known vulnerabilities for a specific PyPI project version.
 *
 * @param name - PyPI project name (e.g. `'requests'`)
 * @param version - Version string (e.g. `'2.31.0'`)
 * @param options - Query options
 * @returns TanStack Query result with {@link PyPIVulnerability} entries
 */
export function usePyPIVersionVulnerabilities(
  name: string,
  version: string,
  options: UsePyPIQueryOptions = {},
): UseQueryResult<PyPIVulnerability[], Error> {
  const { enabled = true, queryOptions } = options;
  const client = usePyPIClient();

  return useQuery<PyPIVulnerability[], Error>({
    queryKey: pypiQueryKeys.versionVulnerabilities(name, version),
    queryFn: ({ signal }) => client.package(name).version(version).vulnerabilities(signal),
    ...queryOptions,
    enabled: enabled && name.length > 0 && version.length > 0,
  });
}
