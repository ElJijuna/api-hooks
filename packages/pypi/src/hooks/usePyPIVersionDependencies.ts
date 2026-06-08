import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { PyPIClient, type PyPIDepsDevDependencies } from 'pypi-api-client';
import { useMemo } from 'react';
import { pypiQueryKeys } from '../keys/pypiQueryKeys.js';
import type { UsePyPIQueryOptions } from './options.js';

export function usePyPIVersionDependencies(
  name: string,
  version: string,
  options: UsePyPIQueryOptions = {},
): UseQueryResult<PyPIDepsDevDependencies, Error> {
  const { enabled = true } = options;
  const client = useMemo(() => new PyPIClient(), []);

  return useQuery<PyPIDepsDevDependencies, Error>({
    queryKey: pypiQueryKeys.versionDependencies(name, version),
    queryFn: ({ signal }) => client.package(name).version(version).dependencies(signal),
    enabled: enabled && name.length > 0 && version.length > 0,
  });
}
