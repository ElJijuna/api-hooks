import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { npmQueryKeys } from '../keys/npmQueryKeys.js';
import { useNpmClient } from '../NpmClientContext.js';
import type { QueryOverrides } from '../types.js';

export interface UseNpmOrgTeamMembersOptions {
  /** Disable the query. Also disabled when `org` or `team` is empty. */
  enabled?: boolean;
  queryOptions?: QueryOverrides<string[]>;
}

/**
 * Returns all usernames in an org team.
 *
 * Requires a registry token with org access passed to `NpmClientProvider`.
 *
 * @param org - Org name (e.g. `'npmcli'`)
 * @param team - Team name (e.g. `'cli'`)
 * @param options - Query options
 * @returns TanStack Query result with `string[]` (usernames)
 */
export function useNpmOrgTeamMembers(
  org: string,
  team: string,
  options: UseNpmOrgTeamMembersOptions = {},
): UseQueryResult<string[], Error> {
  const { enabled = true, queryOptions } = options;
  const client = useNpmClient();

  return useQuery<string[], Error>({
    queryKey: npmQueryKeys.orgTeamMembers(org, team),
    queryFn: ({ signal }) => client.org(org).teamMembers(team, signal),
    ...queryOptions,
    enabled: enabled && org.length > 0 && team.length > 0,
  });
}
