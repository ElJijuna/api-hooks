import { useMemo } from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { GitHubClient, type GitHubRepository, type GitHubPagedResponse, type ReposParams } from 'gh-api-client';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhUserReposOptions {
  /** Disable the query. Also disabled when `login` is empty. */
  enabled?: boolean;
  /** GitHub personal access token. */
  token?: string;
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
  options: UseGhUserReposOptions = {}
): UseQueryResult<GitHubPagedResponse<GitHubRepository>, Error> {
  const { enabled = true, token } = options;
  const client = useMemo(() => new GitHubClient(token ? { token } : {}), [token]);

  return useQuery<GitHubPagedResponse<GitHubRepository>, Error>({
    queryKey: ghQueryKeys.userRepos(login, params),
    queryFn: ({ signal }) => client.user(login).repos(params, signal),
    enabled: enabled && login.length > 0,
  });
}
