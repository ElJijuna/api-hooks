import { useMemo } from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { GitHubClient, type GitHubRepository, type GitHubPagedResponse, type ReposParams } from 'gh-api-client';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhOrgReposOptions {
  /** Disable the query. Also disabled when `orgName` is empty. */
  enabled?: boolean;
  /** GitHub personal access token — required for private repositories. */
  token?: string;
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
  const { enabled = true, token } = options;
  const client = useMemo(() => new GitHubClient(token ? { token } : {}), [token]);

  return useQuery<GitHubPagedResponse<GitHubRepository>, Error>({
    queryKey: ghQueryKeys.orgRepos(orgName, params),
    queryFn: ({ signal }) => client.org(orgName).repos(params, signal),
    enabled: enabled && orgName.length > 0,
  });
}
