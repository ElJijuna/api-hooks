import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { PyPIClient, type PyPIProject } from 'pypi-api-client';
import { useMemo } from 'react';
import { pypiQueryKeys } from '../keys/pypiQueryKeys.js';
import type { UsePyPIQueryOptions } from './options.js';

/**
 * Fetches full PyPI project metadata, including latest info, releases, files, and vulnerabilities.
 *
 * @param name - PyPI project name (e.g. `'requests'`)
 * @param options - Query options
 * @returns TanStack Query result with {@link PyPIProject}
 */
export function usePyPIProject(
  name: string,
  options: UsePyPIQueryOptions = {},
): UseQueryResult<PyPIProject, Error> {
  const { enabled = true, queryOptions } = options;
  const client = useMemo(() => new PyPIClient(), []);

  return useQuery<PyPIProject, Error>({
    queryKey: pypiQueryKeys.project(name),
    queryFn: ({ signal }) => client.package(name).get(signal),
    ...queryOptions,
    enabled: enabled && name.length > 0,
  });
}
