import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { NpmOrgMembers } from 'npmjs-api-client';
import { npmQueryKeys } from '../keys/npmQueryKeys.js';
import { useNpmClient } from '../NpmClientContext.js';
import type { QueryOverrides } from '../types.js';

export interface UseNpmOrgMembersOptions {
  /** Disable the query. Also disabled when `org` is empty. */
  enabled?: boolean;
  queryOptions?: QueryOverrides<NpmOrgMembers>;
}

/**
 * Returns all members in an org, keyed by username, with their roles.
 *
 * Requires a registry token with org access passed to `NpmClientProvider`.
 *
 * @param org - Org name (e.g. `'npmcli'`)
 * @param options - Query options
 * @returns TanStack Query result with {@link NpmOrgMembers}
 */
export function useNpmOrgMembers(
  org: string,
  options: UseNpmOrgMembersOptions = {},
): UseQueryResult<NpmOrgMembers, Error> {
  const { enabled = true, queryOptions } = options;
  const client = useNpmClient();

  return useQuery<NpmOrgMembers, Error>({
    queryKey: npmQueryKeys.orgMembers(org),
    queryFn: ({ signal }) => client.org(org).members(signal),
    ...queryOptions,
    enabled: enabled && org.length > 0,
  });
}
