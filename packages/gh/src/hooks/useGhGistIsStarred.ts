import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhGistIsStarredOptions {
  /** Disable the query. Also disabled when `gistId` is empty. */
  enabled?: boolean;
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
  const { enabled = true } = options;

  const client = useGhClient();

  return useQuery<boolean, Error>({
    queryKey: ghQueryKeys.gistIsStarred(gistId),
    queryFn: ({ signal }) => client.gist(gistId).isStarred(signal),
    enabled: enabled && gistId.length > 0,
  });
}
