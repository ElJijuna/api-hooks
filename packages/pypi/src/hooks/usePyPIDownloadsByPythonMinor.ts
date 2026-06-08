import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { type PyPIBreakdownDownloads, PyPIClient } from 'pypi-api-client';
import { useMemo } from 'react';
import { pypiQueryKeys } from '../keys/pypiQueryKeys.js';
import type { UsePyPIDownloadBreakdownOptions } from './downloadBreakdownOptions.js';

export function usePyPIDownloadsByPythonMinor(
  name: string,
  options: UsePyPIDownloadBreakdownOptions = {},
): UseQueryResult<PyPIBreakdownDownloads, Error> {
  const { enabled = true, params } = options;
  const client = useMemo(() => new PyPIClient(), []);

  return useQuery<PyPIBreakdownDownloads, Error>({
    queryKey: pypiQueryKeys.downloadsByPythonMinor(name, params),
    queryFn: ({ signal }) => client.package(name).downloadsByPythonMinor(params, signal),
    enabled: enabled && name.length > 0,
  });
}
