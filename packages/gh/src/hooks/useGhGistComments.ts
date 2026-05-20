import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { type GitHubPagedResponse, type GistComment, type PaginationParams } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhGistCommentsOptions {
  /** Disable the query. Also disabled when `gistId` is empty. */
  enabled?: boolean;
}

/**
 * Fetches comments on a GitHub Gist.
 *
 * @param gistId - Gist ID
 * @param params - Optional pagination params
 * @param options - Query options including optional `token`
 * @returns TanStack Query result with a paged list of {@link GistComment}
 */
export function useGhGistComments(
  gistId: string,
  params?: PaginationParams,
  options: UseGhGistCommentsOptions = {}
): UseQueryResult<GitHubPagedResponse<GistComment>, Error> {
  const { enabled = true } = options;

  const client = useGhClient();

  return useQuery<GitHubPagedResponse<GistComment>, Error>({
    queryKey: ghQueryKeys.gistComments(gistId, params),
    queryFn: ({ signal }) => client.gist(gistId).comments(params, signal),
    enabled: enabled && gistId.length > 0,
  });
}
