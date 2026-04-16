import { useMemo } from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { NpmClient, type NpmPackageVersion } from 'npmjs-api-client';
import { npmQueryKeys } from '../keys/npmQueryKeys.js';

export interface UseNpmPackageVersionsOptions {
  enabled?: boolean;
}

export function useNpmPackageVersions(
  name: string,
  options: UseNpmPackageVersionsOptions = {}
): UseQueryResult<NpmPackageVersion[], Error> {
  const { enabled = true } = options;
  const client = useMemo(() => new NpmClient(), []);

  return useQuery<NpmPackageVersion[], Error>({
    queryKey: npmQueryKeys.packageVersions(name),
    queryFn: ({ signal }) => client.package(name).versions(signal),
    enabled: enabled && name.length > 0,
  });
}
