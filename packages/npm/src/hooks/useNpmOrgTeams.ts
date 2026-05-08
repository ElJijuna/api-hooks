import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { npmQueryKeys } from '../keys/npmQueryKeys.js';
import { useNpmClient } from '../NpmClientContext.js';

export interface UseNpmOrgTeamsOptions {
  enabled?: boolean;
}

export function useNpmOrgTeams(
  org: string,
  options: UseNpmOrgTeamsOptions = {}
): UseQueryResult<string[], Error> {
  const { enabled = true } = options;
  const client = useNpmClient();

  return useQuery<string[], Error>({
    queryKey: npmQueryKeys.orgTeams(org),
    queryFn: ({ signal }) => client.org(org).teams(signal),
    enabled: enabled && org.length > 0,
  });
}
