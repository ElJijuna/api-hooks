import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { type GitHubUser, type GitHubPagedResponse, type OrgMembersParams } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhOrgMembersOptions {
  /** Disable the query. Also disabled when `orgName` is empty. */
  enabled?: boolean;
}

/**
 * Fetches members of a GitHub organization.
 *
 * @param orgName - Organization login name
 * @param params - Optional filter/pagination params (role, filter, per_page, page)
 * @param options - Query options
 * @returns TanStack Query result with `GitHubPagedResponse<GitHubUser>`
 */
export function useGhOrgMembers(
  orgName: string,
  params?: OrgMembersParams,
  options: UseGhOrgMembersOptions = {}
): UseQueryResult<GitHubPagedResponse<GitHubUser>, Error> {
  const { enabled = true } = options;

  const client = useGhClient();

  return useQuery<GitHubPagedResponse<GitHubUser>, Error>({
    queryKey: ghQueryKeys.orgMembers(orgName, params),
    queryFn: ({ signal }) => client.org(orgName).members(params, signal),
    enabled: enabled && orgName.length > 0,
  });
}
