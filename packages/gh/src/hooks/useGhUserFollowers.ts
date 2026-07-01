import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { GitHubPagedResponse, GitHubUser, PaginationParams } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';
import type { QueryOverrides } from '../types.js';

export interface UseGhUserFollowersOptions {
  /** Disable the query. Also disabled when `login` is empty. */
  enabled?: boolean;
  queryOptions?: QueryOverrides<GitHubPagedResponse<GitHubUser>>;
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
  options: UseGhUserFollowersOptions = {},
): UseQueryResult<GitHubPagedResponse<GitHubUser>, Error> {
  const { enabled = true, queryOptions } = options;

  const client = useGhClient();

  return useQuery<GitHubPagedResponse<GitHubUser>, Error>({
    queryKey: ghQueryKeys.userFollowers(login, params),
    queryFn: ({ signal }) => client.user(login).followers(params, signal),
    ...queryOptions,
    enabled: enabled && login.length > 0,
  });
}
