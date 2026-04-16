import { useMemo } from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { NpmClient, type NpmPackageVersion } from 'npmjs-api-client';
import { npmQueryKeys } from '../keys/npmQueryKeys.js';

export interface UseNpmPackageLatestOptions {
  enabled?: boolean;
}

export function useNpmPackageLatest(
  name: string,
  options: UseNpmPackageLatestOptions = {}
): UseQueryResult<NpmPackageVersion, Error> {
  const { enabled = true } = options;
  const client = useMemo(() => new NpmClient(), []);

  return useQuery<NpmPackageVersion, Error>({
    queryKey: npmQueryKeys.packageVersion(name, 'latest'),
    queryFn: ({ signal }) => client.package(name).latest().get(signal),
    enabled: enabled && name.length > 0,
  });
}
