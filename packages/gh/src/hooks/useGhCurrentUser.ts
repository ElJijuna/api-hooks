import { useMemo } from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { GitHubClient, type GitHubUser } from 'gh-api-client';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhCurrentUserOptions {
  /** Disable the query. */
  enabled?: boolean;
  /** GitHub personal access token — required to fetch the authenticated user. */
  token?: string;
}

/**
 * Fetches the profile of the currently authenticated GitHub user.
 *
 * @param options - Query options including the required `token`
 * @returns TanStack Query result with {@link GitHubUser}
 */
export function useGhCurrentUser(
  options: UseGhCurrentUserOptions = {}
): UseQueryResult<GitHubUser, Error> {
  const { enabled = true, token } = options;
  const client = useMemo(() => new GitHubClient(token ? { token } : {}), [token]);

  return useQuery<GitHubUser, Error>({
    queryKey: ghQueryKeys.currentUser(),
    queryFn: ({ signal }) => client.currentUser(signal),
    enabled,
  });
}
