import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { type NpmOrgMembers } from 'npmjs-api-client';
import { npmQueryKeys } from '../keys/npmQueryKeys.js';
import { useNpmClient } from '../NpmClientContext.js';

export interface UseNpmOrgMembersOptions {
  enabled?: boolean;
}

export function useNpmOrgMembers(
  org: string,
  options: UseNpmOrgMembersOptions = {}
): UseQueryResult<NpmOrgMembers, Error> {
  const { enabled = true } = options;
  const client = useNpmClient();

  return useQuery<NpmOrgMembers, Error>({
    queryKey: npmQueryKeys.orgMembers(org),
    queryFn: ({ signal }) => client.org(org).members(signal),
    enabled: enabled && org.length > 0,
  });
}
