import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { PyPIClient, type PyPIVulnerability } from 'pypi-api-client';
import { useMemo } from 'react';
import { pypiQueryKeys } from '../keys/pypiQueryKeys.js';
import type { UsePyPIQueryOptions } from './options.js';

export function usePyPIPackageVulnerabilities(
  name: string,
  options: UsePyPIQueryOptions = {},
): UseQueryResult<PyPIVulnerability[], Error> {
  const { enabled = true } = options;
  const client = useMemo(() => new PyPIClient(), []);

  return useQuery<PyPIVulnerability[], Error>({
    queryKey: pypiQueryKeys.packageVulnerabilities(name),
    queryFn: ({ signal }) => client.package(name).vulnerabilities(signal),
    enabled: enabled && name.length > 0,
  });
}
