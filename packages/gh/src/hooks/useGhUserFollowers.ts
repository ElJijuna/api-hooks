import { useMemo } from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { GitHubClient, type GitHubPagedResponse, type GitHubUser, type PaginationParams } from 'gh-api-client';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhUserFollowersOptions {
  /** Disable the query. Also disabled when `login` is empty. */
  enabled?: boolean;
  /** GitHub personal access token. */
  token?: string;
}

/**
 * Fetches the list of users following a GitHub user.
 *
 * @param login - GitHub username
 * @param params - Optional pagination params
 * @param options - Query options including optional `token`
 * @returns TanStack Query result with a paged list of {@link GitHubUser}
 */
export function useGhUserFollowers(
  login: string,
  params?: PaginationParams,
  options: UseGhUserFollowersOptions = {}
): UseQueryResult<GitHubPagedResponse<GitHubUser>, Error> {
  const { enabled = true, token } = options;
  const client = useMemo(() => new GitHubClient(token ? { token } : {}), [token]);

  return useQuery<GitHubPagedResponse<GitHubUser>, Error>({
    queryKey: ghQueryKeys.userFollowers(login, params),
    queryFn: ({ signal }) => client.user(login).followers(params, signal),
    enabled: enabled && login.length > 0,
  });
}
