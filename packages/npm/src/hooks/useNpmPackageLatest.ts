
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { type NpmPackageVersion } from 'npmjs-api-client';
import { useNpmClient } from '../NpmClientContext.js';
import { npmQueryKeys } from '../keys/npmQueryKeys.js';

export interface UseNpmPackageLatestOptions {
  enabled?: boolean;
}

export function useNpmPackageLatest(
  name: string,
  options: UseNpmPackageLatestOptions = {}
): UseQueryResult<NpmPackageVersion, Error> {
  const { enabled = true } = options;
  const client = useNpmClient();

  return useQuery<NpmPackageVersion, Error>({
    queryKey: npmQueryKeys.packageVersion(name, 'latest'),
    queryFn: ({ signal }) => client.package(name).latest().get(signal),
    enabled: enabled && name.length > 0,
  });
}
