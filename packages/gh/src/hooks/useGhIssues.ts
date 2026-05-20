import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { type GitHubIssue, type GitHubPagedResponse, type IssuesParams } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhIssuesOptions {
  /** Disable the query. */
  enabled?: boolean;
}

/**
 * Fetches issues assigned to the authenticated user across all repositories.
 *
 * Note: GitHub returns pull requests as issues from this endpoint.
 * Filter them out by checking for the absence of `pull_request`.
 *
 * @param params - Optional filters: `filter`, `state`, `labels`, `sort`, `direction`, `since`, `per_page`, `page`
 * @param options - Query options
 * @returns TanStack Query result with `GitHubPagedResponse<GitHubIssue>`
 */
export function useGhIssues(
  params?: IssuesParams,
  options: UseGhIssuesOptions = {}
): UseQueryResult<GitHubPagedResponse<GitHubIssue>, Error> {
  const { enabled = true } = options;

  const client = useGhClient();

  return useQuery<GitHubPagedResponse<GitHubIssue>, Error>({
    queryKey: ghQueryKeys.issues(params),
    queryFn: ({ signal }) => client.issues(params, signal),
    enabled,
  });
}
