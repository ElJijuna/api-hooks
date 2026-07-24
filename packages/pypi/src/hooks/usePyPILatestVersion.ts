import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { PyPIVersionInfo } from 'pypi-api-client';
import { pypiQueryKeys } from '../keys/pypiQueryKeys.js';
import { usePyPIClient } from '../PyPIClientContext.js';
import type { UsePyPIQueryOptions } from './options.js';

/**
 * Fetches metadata for the latest published version of a PyPI project.
 *
 * @param name - PyPI project name (e.g. `'requests'`)
 * @param options - Query options
 * @returns TanStack Query result with {@link PyPIVersionInfo}
 */
export function usePyPILatestVersion(
  name: string,
  options: UsePyPIQueryOptions = {},
): UseQueryResult<PyPIVersionInfo, Error> {
  const { enabled = true, queryOptions } = options;
  const client = usePyPIClient();

  return useQuery<PyPIVersionInfo, Error>({
    queryKey: pypiQueryKeys.latestVersion(name),
    queryFn: ({ signal }) => client.package(name).latest().get(signal),
    ...queryOptions,
    enabled: enabled && name.length > 0,
  });
}
