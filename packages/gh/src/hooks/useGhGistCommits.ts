import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { GistCommit, GitHubPagedResponse, PaginationParams } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';
import type { QueryOverrides } from '../types.js';

export interface UseGhGistCommitsOptions {
  /** Disable the query. Also disabled when `gistId` is empty. */
  enabled?: boolean;
  queryOptions?: QueryOverrides<GitHubPagedResponse<GistCommit>>;
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
  options: UseGhGistCommitsOptions = {},
): UseQueryResult<GitHubPagedResponse<GistCommit>, Error> {
  const { enabled = true, queryOptions } = options;

  const client = useGhClient();

  return useQuery<GitHubPagedResponse<GistCommit>, Error>({
    queryKey: ghQueryKeys.gistCommits(gistId, params),
    queryFn: ({ signal }) => client.gist(gistId).commits(params, signal),
    ...queryOptions,
    enabled: enabled && gistId.length > 0,
  });
}
