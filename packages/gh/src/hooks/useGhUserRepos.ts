import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { GitHubPagedResponse, GitHubRepository, ReposParams } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';
import type { QueryOverrides } from '../types.js';

export interface UseGhUserReposOptions {
  /** Disable the query. Also disabled when `login` is empty. */
  enabled?: boolean;
  queryOptions?: QueryOverrides<GitHubPagedResponse<GitHubRepository>>;
}

/**
 * Fetches the public repositories for a GitHub user.
 *
 * @param login - GitHub username
 * @param params - Optional filter/pagination params
 * @param options - Query options
 * @returns TanStack Query result with `GitHubPagedResponse<GitHubRepository>`
 */
export function useGhUserRepos(
  login: string,
  params?: ReposParams,
  options: UseGhUserReposOptions = {},
): UseQueryResult<GitHubPagedResponse<GitHubRepository>, Error> {
  const { enabled = true, queryOptions } = options;

  const client = useGhClient();

  return useQuery<GitHubPagedResponse<GitHubRepository>, Error>({
    queryKey: ghQueryKeys.userRepos(login, params),
    queryFn: ({ signal }) => client.user(login).repos(params, signal),
    ...queryOptions,
    enabled: enabled && login.length > 0,
  });
}
