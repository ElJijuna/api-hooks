import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { PyPIBreakdownDownloads } from 'pypi-api-client';
import { pypiQueryKeys } from '../keys/pypiQueryKeys.js';
import { usePyPIClient } from '../PyPIClientContext.js';
import type { UsePyPIDownloadBreakdownOptions } from './downloadBreakdownOptions.js';

/**
 * Fetches per-day downloads split by mirror and non-mirror traffic.
 *
 * @param name - PyPI project name (e.g. `'requests'`)
 * @param options - Query options, including optional date filters
 * @returns TanStack Query result with {@link PyPIBreakdownDownloads}
 */
export function usePyPIDownloadsByMirrors(
  name: string,
  options: UsePyPIDownloadBreakdownOptions = {},
): UseQueryResult<PyPIBreakdownDownloads, Error> {
  const { enabled = true, params, queryOptions } = options;
  const client = usePyPIClient();

  return useQuery<PyPIBreakdownDownloads, Error>({
    queryKey: pypiQueryKeys.downloadsByMirrors(name, params),
    queryFn: ({ signal }) => client.package(name).downloadsByMirrors(params, signal),
    ...queryOptions,
    enabled: enabled && name.length > 0,
  });
}
