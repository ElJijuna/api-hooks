import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { PyPIClient } from 'pypi-api-client';
import { useMemo } from 'react';
import { pypiQueryKeys } from '../keys/pypiQueryKeys.js';
import type { UsePyPIQueryOptions } from './options.js';

/**
 * Fetches all published version strings for a PyPI project.
 *
 * @param name - PyPI project name (e.g. `'requests'`)
 * @param options - Query options
 * @returns TanStack Query result with version strings
 */
export function usePyPIPackageVersions(
  name: string,
  options: UsePyPIQueryOptions = {},
): UseQueryResult<string[], Error> {
  const { enabled = true, queryOptions } = options;
  const client = useMemo(() => new PyPIClient(), []);

  return useQuery<string[], Error>({
    queryKey: pypiQueryKeys.versions(name),
    queryFn: ({ signal }) => client.package(name).versions(signal),
    ...queryOptions,
    enabled: enabled && name.length > 0,
  });
}
