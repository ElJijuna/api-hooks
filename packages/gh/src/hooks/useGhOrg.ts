import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { type GitHubOrganization } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhOrgOptions {
  /** Disable the query. Also disabled when `orgName` is empty. */
  enabled?: boolean;
}

/**
 * Fetches a GitHub organization's details.
 *
 * @param orgName - Organization login name (e.g. `'github'`)
 * @param options - Query options
 * @returns TanStack Query result with {@link GitHubOrganization}
 */
export function useGhOrg(
  orgName: string,
  options: UseGhOrgOptions = {}
): UseQueryResult<GitHubOrganization, Error> {
  const { enabled = true } = options;

  const client = useGhClient();

  return useQuery<GitHubOrganization, Error>({
    queryKey: ghQueryKeys.org(orgName),
    queryFn: ({ signal }) => client.org(orgName).get(signal),
    enabled: enabled && orgName.length > 0,
  });
}
