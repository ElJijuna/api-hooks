import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { PyPIClient, type PyPIVersionInfo } from 'pypi-api-client';
import { useMemo } from 'react';
import { pypiQueryKeys } from '../keys/pypiQueryKeys.js';
import type { UsePyPIQueryOptions } from './options.js';

/**
 * Fetches metadata for a specific PyPI project version.
 *
 * @param name - PyPI project name (e.g. `'requests'`)
 * @param version - Version string (e.g. `'2.31.0'`)
 * @param options - Query options
 * @returns TanStack Query result with {@link PyPIVersionInfo}
 */
export function usePyPIVersion(
  name: string,
  version: string,
  options: UsePyPIQueryOptions = {},
): UseQueryResult<PyPIVersionInfo, Error> {
  const { enabled = true } = options;
  const client = useMemo(() => new PyPIClient(), []);

  return useQuery<PyPIVersionInfo, Error>({
    queryKey: pypiQueryKeys.version(name, version),
    queryFn: ({ signal }) => client.package(name).version(version).get(signal),
    enabled: enabled && name.length > 0 && version.length > 0,
  });
}
