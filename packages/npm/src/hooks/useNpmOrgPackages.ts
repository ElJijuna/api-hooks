import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { type NpmOrgPackages } from 'npmjs-api-client';
import { npmQueryKeys } from '../keys/npmQueryKeys.js';
import { useNpmClient } from '../NpmClientContext.js';

export interface UseNpmOrgPackagesOptions {
  enabled?: boolean;
}

export function useNpmOrgPackages(
  org: string,
  options: UseNpmOrgPackagesOptions = {}
): UseQueryResult<NpmOrgPackages, Error> {
  const { enabled = true } = options;
  const client = useNpmClient();

  return useQuery<NpmOrgPackages, Error>({
    queryKey: npmQueryKeys.orgPackages(org),
    queryFn: ({ signal }) => client.org(org).packages(signal),
    enabled: enabled && org.length > 0,
  });
}
