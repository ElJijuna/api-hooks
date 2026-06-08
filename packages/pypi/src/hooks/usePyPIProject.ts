import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { PyPIClient, type PyPIProject } from 'pypi-api-client';
import { useMemo } from 'react';
import { pypiQueryKeys } from '../keys/pypiQueryKeys.js';
import type { UsePyPIQueryOptions } from './options.js';

export function usePyPIProject(
  name: string,
  options: UsePyPIQueryOptions = {},
): UseQueryResult<PyPIProject, Error> {
  const { enabled = true } = options;
  const client = useMemo(() => new PyPIClient(), []);

  return useQuery<PyPIProject, Error>({
    queryKey: pypiQueryKeys.project(name),
    queryFn: ({ signal }) => client.package(name).get(signal),
    enabled: enabled && name.length > 0,
  });
}
