import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { GitHubUser } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhCurrentUserOptions {
  /** Disable the query. */
  enabled?: boolean;
}

/**
 * Fetches the profile of the currently authenticated GitHub user.
 *
 * @param options - Query options including the required `token`
 * @returns TanStack Query result with {@link GitHubUser}
 */
export function useGhCurrentUser(
  options: UseGhCurrentUserOptions = {},
): UseQueryResult<GitHubUser, Error> {
  const { enabled = true } = options;

  const client = useGhClient();

  return useQuery<GitHubUser, Error>({
    queryKey: ghQueryKeys.currentUser(),
    queryFn: ({ signal }) => client.currentUser(signal),
    enabled,
  });
}
