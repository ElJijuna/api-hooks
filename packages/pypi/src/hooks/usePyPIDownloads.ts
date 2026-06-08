import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { PyPIClient, type PyPIRecentDownloads } from 'pypi-api-client';
import { useMemo } from 'react';
import { pypiQueryKeys } from '../keys/pypiQueryKeys.js';
import type { UsePyPIQueryOptions } from './options.js';

export function usePyPIDownloads(
  name: string,
  options: UsePyPIQueryOptions = {},
): UseQueryResult<PyPIRecentDownloads, Error> {
  const { enabled = true } = options;
  const client = useMemo(() => new PyPIClient(), []);

  return useQuery<PyPIRecentDownloads, Error>({
    queryKey: pypiQueryKeys.downloads(name),
    queryFn: ({ signal }) => client.package(name).downloads(signal),
    enabled: enabled && name.length > 0,
  });
}
