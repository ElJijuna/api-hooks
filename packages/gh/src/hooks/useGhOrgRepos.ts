import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { GitHubPagedResponse, GitHubRepository, ReposParams } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';
import type { QueryOverrides } from '../types.js';

export interface UseGhOrgReposOptions {
  /** Disable the query. Also disabled when `orgName` is empty. */
  enabled?: boolean;
  queryOptions?: QueryOverrides<GitHubPagedResponse<GitHubRepository>>;
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
  options: UseGhOrgReposOptions = {},
): UseQueryResult<GitHubPagedResponse<GitHubRepository>, Error> {
  const { enabled = true, queryOptions } = options;

  const client = useGhClient();

  return useQuery<GitHubPagedResponse<GitHubRepository>, Error>({
    queryKey: ghQueryKeys.orgRepos(orgName, params),
    queryFn: ({ signal }) => client.org(orgName).repos(params, signal),
    ...queryOptions,
    enabled: enabled && orgName.length > 0,
  });
}
