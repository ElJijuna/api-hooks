import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { type GitHubIssue, type GitHubPagedResponse, type SearchIssuesParams } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhSearchIssuesOptions {
  /** Disable the query. Also disabled when `params.q` is empty. */
  enabled?: boolean;
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
  options: UseGhSearchIssuesOptions = {}
): UseQueryResult<GitHubPagedResponse<GitHubIssue>, Error> {
  const { enabled = true } = options;

  const client = useGhClient();

  return useQuery<GitHubPagedResponse<GitHubIssue>, Error>({
    queryKey: ghQueryKeys.searchIssues(params),
    queryFn: ({ signal }) => client.searchIssues(params, signal),
    enabled: enabled && params.q.length > 0,
  });
}
