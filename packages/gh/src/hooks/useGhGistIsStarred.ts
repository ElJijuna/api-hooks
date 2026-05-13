import { useMemo } from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { GitHubClient } from 'gh-api-client';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhGistIsStarredOptions {
  /** Disable the query. Also disabled when `gistId` is empty. */
  enabled?: boolean;
  /** GitHub personal access token — required to check star status. */
  token?: string;
}

/**
 * Checks whether the authenticated user has starred a GitHub Gist.
 *
 * @param gistId - Gist ID
 * @param options - Query options including optional `token`
 * @returns TanStack Query result with `boolean`
 */
export function useGhGistIsStarred(
  gistId: string,
  options: UseGhGistIsStarredOptions = {}
): UseQueryResult<boolean, Error> {
  const { enabled = true, token } = options;
  const client = useMemo(() => new GitHubClient(token ? { token } : {}), [token]);

  return useQuery<boolean, Error>({
    queryKey: ghQueryKeys.gistIsStarred(gistId),
    queryFn: ({ signal }) => client.gist(gistId).isStarred(signal),
    enabled: enabled && gistId.length > 0,
  });
}
