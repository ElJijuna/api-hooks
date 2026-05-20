import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { type GitHubPagedResponse, type GistCommit, type PaginationParams } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhGistCommitsOptions {
  /** Disable the query. Also disabled when `gistId` is empty. */
  enabled?: boolean;
}

/**
 * Fetches the commit history of a GitHub Gist.
 *
 * @param gistId - Gist ID
 * @param params - Optional pagination params
 * @param options - Query options including optional `token`
 * @returns TanStack Query result with a paged list of {@link GistCommit}
 */
export function useGhGistCommits(
  gistId: string,
  params?: PaginationParams,
  options: UseGhGistCommitsOptions = {}
): UseQueryResult<GitHubPagedResponse<GistCommit>, Error> {
  const { enabled = true } = options;

  const client = useGhClient();

  return useQuery<GitHubPagedResponse<GistCommit>, Error>({
    queryKey: ghQueryKeys.gistCommits(gistId, params),
    queryFn: ({ signal }) => client.gist(gistId).commits(params, signal),
    enabled: enabled && gistId.length > 0,
  });
}
