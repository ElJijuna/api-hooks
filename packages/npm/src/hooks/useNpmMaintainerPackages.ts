
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { type NpmSearchResult, type MaintainerPackagesParams } from 'npmjs-api-client';
import { npmQueryKeys } from '../keys/npmQueryKeys.js';
import { useNpmClient } from '../NpmClientContext.js';

export interface UseNpmMaintainerPackagesOptions extends MaintainerPackagesParams {
  enabled?: boolean;
}

export function useNpmMaintainerPackages(
  username: string,
  options: UseNpmMaintainerPackagesOptions = {}
): UseQueryResult<NpmSearchResult, Error> {
  const { enabled = true, ...params } = options;
  const client = useNpmClient();

  const queryParams = Object.keys(params).length > 0 ? params : undefined;

  return useQuery<NpmSearchResult, Error>({
    queryKey: npmQueryKeys.maintainerPackages(username, queryParams),
    queryFn: ({ signal }) => client.maintainer(username).packages(queryParams, signal),
    enabled: enabled && username.length > 0,
  });
}
