import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { type PyPIBreakdownDownloads, PyPIClient } from 'pypi-api-client';
import { useMemo } from 'react';
import { pypiQueryKeys } from '../keys/pypiQueryKeys.js';
import type { UsePyPIDownloadBreakdownOptions } from './downloadBreakdownOptions.js';

/**
 * Fetches per-day downloads broken down by Python major version.
 *
 * @param name - PyPI project name (e.g. `'requests'`)
 * @param options - Query options, including optional date filters
 * @returns TanStack Query result with {@link PyPIBreakdownDownloads}
 */
export function usePyPIDownloadsByPythonMajor(
  name: string,
  options: UsePyPIDownloadBreakdownOptions = {},
): UseQueryResult<PyPIBreakdownDownloads, Error> {
  const { enabled = true, params } = options;
  const client = useMemo(() => new PyPIClient(), []);

  return useQuery<PyPIBreakdownDownloads, Error>({
    queryKey: pypiQueryKeys.downloadsByPythonMajor(name, params),
    queryFn: ({ signal }) => client.package(name).downloadsByPythonMajor(params, signal),
    enabled: enabled && name.length > 0,
  });
}
