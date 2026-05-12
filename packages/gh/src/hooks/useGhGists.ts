import { useMemo } from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { GitHubClient, type GitHubGist, type GitHubPagedResponse, type GistsParams } from 'gh-api-client';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhGistsOptions {
  /** Disable the query. */
  enabled?: boolean;
  /** GitHub personal access token — required to list secret gists. */
  token?: string;
}

/**
 * Lists public gists, or all gists for a user when a `token` is provided.
 *
 * @param params - Optional filter/pagination params (`GistsParams` from `gh-api-client`)
 * @param options - Query options including optional `token`
 * @returns TanStack Query result with `GitHubPagedResponse<GitHubGist>`
 */
export function useGhGists(
  params?: GistsParams,
  options: UseGhGistsOptions = {}
): UseQueryResult<GitHubPagedResponse<GitHubGist>, Error> {
  const { enabled = true, token } = options;
  const client = useMemo(() => new GitHubClient(token ? { token } : {}), [token]);

  return useQuery<GitHubPagedResponse<GitHubGist>, Error>({
    queryKey: ghQueryKeys.gists(params),
    queryFn: ({ signal }) => client.listGists(params, signal),
    enabled,
  });
}
