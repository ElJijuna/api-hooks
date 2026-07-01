import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { GistsParams, GitHubGist, GitHubPagedResponse } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';
import type { QueryOverrides } from '../types.js';

export interface UseGhGistsOptions {
  /** Disable the query. */
  enabled?: boolean;
  queryOptions?: QueryOverrides<GitHubPagedResponse<GitHubGist>>;
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
  options: UseGhGistsOptions = {},
): UseQueryResult<GitHubPagedResponse<GitHubGist>, Error> {
  const { enabled = true, queryOptions } = options;

  const client = useGhClient();

  return useQuery<GitHubPagedResponse<GitHubGist>, Error>({
    queryKey: ghQueryKeys.gists(params),
    queryFn: ({ signal }) => client.listGists(params, signal),
    ...queryOptions,
    enabled,
  });
}
