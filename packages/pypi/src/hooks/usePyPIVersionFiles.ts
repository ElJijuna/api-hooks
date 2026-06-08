import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { PyPIClient, type PyPIFile } from 'pypi-api-client';
import { useMemo } from 'react';
import { pypiQueryKeys } from '../keys/pypiQueryKeys.js';
import type { UsePyPIQueryOptions } from './options.js';

export function usePyPIVersionFiles(
  name: string,
  version: string,
  options: UsePyPIQueryOptions = {},
): UseQueryResult<PyPIFile[], Error> {
  const { enabled = true } = options;
  const client = useMemo(() => new PyPIClient(), []);

  return useQuery<PyPIFile[], Error>({
    queryKey: pypiQueryKeys.versionFiles(name, version),
    queryFn: ({ signal }) => client.package(name).version(version).files(signal),
    enabled: enabled && name.length > 0 && version.length > 0,
  });
}
