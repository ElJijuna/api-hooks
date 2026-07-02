import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { PyPIClient, type PyPIVulnerability } from 'pypi-api-client';
import { useMemo } from 'react';
import { pypiQueryKeys } from '../keys/pypiQueryKeys.js';
import type { UsePyPIQueryOptions } from './options.js';

/**
 * Fetches known vulnerabilities for the latest version of a PyPI project.
 *
 * @param name - PyPI project name (e.g. `'requests'`)
 * @param options - Query options
 * @returns TanStack Query result with {@link PyPIVulnerability} entries
 */
export function usePyPIPackageVulnerabilities(
  name: string,
  options: UsePyPIQueryOptions = {},
): UseQueryResult<PyPIVulnerability[], Error> {
  const { enabled = true, queryOptions } = options;
  const client = useMemo(() => new PyPIClient(), []);

  return useQuery<PyPIVulnerability[], Error>({
    queryKey: pypiQueryKeys.packageVulnerabilities(name),
    queryFn: ({ signal }) => client.package(name).vulnerabilities(signal),
    ...queryOptions,
    enabled: enabled && name.length > 0,
  });
}
