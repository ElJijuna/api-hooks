import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { type GitHubRepository, type GitHubPagedResponse, type ReposParams } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhOrgReposOptions {
  /** Disable the query. Also disabled when `orgName` is empty. */
  enabled?: boolean;
}

/**
 * Fetches repositories belonging to a GitHub organization.
 *
 * @param orgName - Organization login name
 * @param params - Optional filter/pagination params
 * @param options - Query options
 * @returns TanStack Query result with `GitHubPagedResponse<GitHubRepository>`
 */
export function useGhOrgRepos(
  orgName: string,
  params?: ReposParams,
  options: UseGhOrgReposOptions = {}
): UseQueryResult<GitHubPagedResponse<GitHubRepository>, Error> {
  const { enabled = true } = options;

  const client = useGhClient();

  return useQuery<GitHubPagedResponse<GitHubRepository>, Error>({
    queryKey: ghQueryKeys.orgRepos(orgName, params),
    queryFn: ({ signal }) => client.org(orgName).repos(params, signal),
    enabled: enabled && orgName.length > 0,
  });
}
