
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { type NpmPackageVersion } from 'npmjs-api-client';
import { npmQueryKeys } from '../keys/npmQueryKeys.js';
import { useNpmClient } from '../NpmClientContext.js';

export interface UseNpmPackageVersionOptions {
  enabled?: boolean;
}

export function useNpmPackageVersion(
  name: string,
  version: string,
  options: UseNpmPackageVersionOptions = {}
): UseQueryResult<NpmPackageVersion, Error> {
  const { enabled = true } = options;
  const client = useNpmClient();

  return useQuery<NpmPackageVersion, Error>({
    queryKey: npmQueryKeys.packageVersion(name, version),
    queryFn: ({ signal }) => client.package(name).version(version).get(signal),
    enabled: enabled && name.length > 0 && version.length > 0,
  });
}
