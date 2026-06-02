import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { GitHubUser } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhUserOptions {
  /** Disable the query. Also disabled when `login` is empty. */
  enabled?: boolean;
}

/**
 * Fetches a GitHub user's public profile.
 *
 * @param login - GitHub username (e.g. `'torvalds'`)
 * @param options - Query options
 * @returns TanStack Query result with {@link GitHubUser}
 */
export function useGhUser(
  login: string,
  options: UseGhUserOptions = {},
): UseQueryResult<GitHubUser, Error> {
  const { enabled = true } = options;

  const client = useGhClient();

  return useQuery<GitHubUser, Error>({
    queryKey: ghQueryKeys.user(login),
    queryFn: ({ signal }) => client.user(login).get(signal),
    enabled: enabled && login.length > 0,
  });
}
