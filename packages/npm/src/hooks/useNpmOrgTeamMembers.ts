import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { npmQueryKeys } from '../keys/npmQueryKeys.js';
import { useNpmClient } from '../NpmClientContext.js';

export interface UseNpmOrgTeamMembersOptions {
  enabled?: boolean;
}

export function useNpmOrgTeamMembers(
  org: string,
  team: string,
  options: UseNpmOrgTeamMembersOptions = {}
): UseQueryResult<string[], Error> {
  const { enabled = true } = options;
  const client = useNpmClient();

  return useQuery<string[], Error>({
    queryKey: npmQueryKeys.orgTeamMembers(org, team),
    queryFn: ({ signal }) => client.org(org).teamMembers(team, signal),
    enabled: enabled && org.length > 0 && team.length > 0,
  });
}
