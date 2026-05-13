import { useMemo } from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { GitHubClient, type GitHubPagedResponse, type GistCommit, type PaginationParams } from 'gh-api-client';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhGistCommitsOptions {
  /** Disable the query. Also disabled when `gistId` is empty. */
  enabled?: boolean;
  /** GitHub personal access token. */
  token?: string;
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
  const { enabled = true, token } = options;
  const client = useMemo(() => new GitHubClient(token ? { token } : {}), [token]);

  return useQuery<GitHubPagedResponse<GistCommit>, Error>({
    queryKey: ghQueryKeys.gistCommits(gistId, params),
    queryFn: ({ signal }) => client.gist(gistId).commits(params, signal),
    enabled: enabled && gistId.length > 0,
  });
}
