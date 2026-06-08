import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { PyPIClient, type PyPIProjectInfo } from 'pypi-api-client';
import { useMemo } from 'react';
import { pypiQueryKeys } from '../keys/pypiQueryKeys.js';
import type { UsePyPIQueryOptions } from './options.js';

/**
 * Fetches the latest `info` metadata block for a PyPI project.
 *
 * @param name - PyPI project name (e.g. `'requests'`)
 * @param options - Query options
 * @returns TanStack Query result with {@link PyPIProjectInfo}
 */
export function usePyPIProjectInfo(
  name: string,
  options: UsePyPIQueryOptions = {},
): UseQueryResult<PyPIProjectInfo, Error> {
  const { enabled = true } = options;
  const client = useMemo(() => new PyPIClient(), []);

  return useQuery<PyPIProjectInfo, Error>({
    queryKey: pypiQueryKeys.info(name),
    queryFn: ({ signal }) => client.package(name).info(signal),
    enabled: enabled && name.length > 0,
  });
}
