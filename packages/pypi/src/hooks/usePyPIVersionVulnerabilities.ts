import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { PyPIClient, type PyPIVulnerability } from 'pypi-api-client';
import { useMemo } from 'react';
import { pypiQueryKeys } from '../keys/pypiQueryKeys.js';
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
  const { enabled = true } = options;
  const client = useMemo(() => new PyPIClient(), []);

  return useQuery<PyPIVulnerability[], Error>({
    queryKey: pypiQueryKeys.versionVulnerabilities(name, version),
    queryFn: ({ signal }) => client.package(name).version(version).vulnerabilities(signal),
    enabled: enabled && name.length > 0 && version.length > 0,
  });
}
