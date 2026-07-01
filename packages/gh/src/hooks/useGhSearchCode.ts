import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { GitHubCodeResult, GitHubPagedResponse, SearchCodeParams } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';
import type { QueryOverrides } from '../types.js';

export interface UseGhSearchCodeOptions {
  /** Disable the query. Also disabled when `params.q` is empty. */
  enabled?: boolean;
  queryOptions?: QueryOverrides<GitHubPagedResponse<GitHubCodeResult>>;
}

/**
 * Searches for code in GitHub repositories using GitHub's search syntax.
 *
 * @param params - Search params. `q` is required (e.g. `'addClass in:file language:js repo:jquery/jquery'`)
 * @param options - Query options
 * @returns TanStack Query result with `GitHubPagedResponse<GitHubCodeResult>` (includes `totalCount`)
 */
export function useGhSearchCode(
  params: SearchCodeParams,
  options: UseGhSearchCodeOptions = {},
): UseQueryResult<GitHubPagedResponse<GitHubCodeResult>, Error> {
  const { enabled = true, queryOptions } = options;

  const client = useGhClient();

  return useQuery<GitHubPagedResponse<GitHubCodeResult>, Error>({
    queryKey: ghQueryKeys.searchCode(params),
    queryFn: ({ signal }) => client.searchCode(params, signal),
    ...queryOptions,
    enabled: enabled && params.q.length > 0,
  });
}
