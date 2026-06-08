import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { PyPIClient } from 'pypi-api-client';
import { useMemo } from 'react';
import { pypiQueryKeys } from '../keys/pypiQueryKeys.js';
import type { UsePyPIQueryOptions } from './options.js';

export function usePyPIPackageVersions(
  name: string,
  options: UsePyPIQueryOptions = {},
): UseQueryResult<string[], Error> {
  const { enabled = true } = options;
  const client = useMemo(() => new PyPIClient(), []);

  return useQuery<string[], Error>({
    queryKey: pypiQueryKeys.versions(name),
    queryFn: ({ signal }) => client.package(name).versions(signal),
    enabled: enabled && name.length > 0,
  });
}
