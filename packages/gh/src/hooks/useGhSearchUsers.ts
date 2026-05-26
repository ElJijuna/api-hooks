import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { type GitHubUser, type GitHubPagedResponse, type SearchUsersParams } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhSearchUsersOptions {
  /** Disable the query. Also disabled when `params.q` is empty. */
  enabled?: boolean;
}

/**
 * Searches for GitHub users using GitHub's search syntax.
 *
 * @param params - Search params. `q` is required (e.g. `'type:user location:london'`)
 * @param options - Query options
 * @returns TanStack Query result with `GitHubPagedResponse<GitHubUser>` (includes `totalCount`)
 */
export function useGhSearchUsers(
  params: SearchUsersParams,
  options: UseGhSearchUsersOptions = {}
): UseQueryResult<GitHubPagedResponse<GitHubUser>, Error> {
  const { enabled = true } = options;

  const client = useGhClient();

  return useQuery<GitHubPagedResponse<GitHubUser>, Error>({
    queryKey: ghQueryKeys.searchUsers(params),
    queryFn: ({ signal }) => client.searchUsers(params, signal),
    enabled: enabled && params.q.length > 0,
  });
}
