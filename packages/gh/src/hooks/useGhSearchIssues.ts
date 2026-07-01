import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { GitHubIssue, GitHubPagedResponse, SearchIssuesParams } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';
import type { QueryOverrides } from '../types.js';

export interface UseGhSearchIssuesOptions {
  /** Disable the query. Also disabled when `params.q` is empty. */
  enabled?: boolean;
  queryOptions?: QueryOverrides<GitHubPagedResponse<GitHubIssue>>;
}

/**
 * Searches for issues and pull requests using GitHub's search syntax.
 *
 * @param params - Search params. `q` is required (e.g. `'is:pr is:open author:octocat'`)
 * @param options - Query options
 * @returns TanStack Query result with `GitHubPagedResponse<GitHubIssue>` (includes `totalCount`)
 */
export function useGhSearchIssues(
  params: SearchIssuesParams,
  options: UseGhSearchIssuesOptions = {},
): UseQueryResult<GitHubPagedResponse<GitHubIssue>, Error> {
  const { enabled = true, queryOptions } = options;

  const client = useGhClient();

  return useQuery<GitHubPagedResponse<GitHubIssue>, Error>({
    queryKey: ghQueryKeys.searchIssues(params),
    queryFn: ({ signal }) => client.searchIssues(params, signal),
    ...queryOptions,
    enabled: enabled && params.q.length > 0,
  });
}
