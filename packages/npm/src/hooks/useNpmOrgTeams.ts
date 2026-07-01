import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { npmQueryKeys } from '../keys/npmQueryKeys.js';
import { useNpmClient } from '../NpmClientContext.js';
import type { QueryOverrides } from '../types.js';

export interface UseNpmOrgTeamsOptions {
  /** Disable the query. Also disabled when `org` is empty. */
  enabled?: boolean;
  queryOptions?: QueryOverrides<string[]>;
}

/**
 * Returns all teams in an org.
 *
 * Requires a registry token with org access passed to `NpmClientProvider`.
 *
 * @param org - Org name (e.g. `'npmcli'`)
 * @param options - Query options
 * @returns TanStack Query result with `string[]` (team names)
 */
export function useNpmOrgTeams(
  org: string,
  options: UseNpmOrgTeamsOptions = {},
): UseQueryResult<string[], Error> {
  const { enabled = true, queryOptions } = options;
  const client = useNpmClient();

  return useQuery<string[], Error>({
    queryKey: npmQueryKeys.orgTeams(org),
    queryFn: ({ signal }) => client.org(org).teams(signal),
    ...queryOptions,
    enabled: enabled && org.length > 0,
  });
}
