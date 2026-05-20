import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { type GitHubIssueComment, type GitHubPagedResponse, type PaginationParams } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhIssueCommentsOptions {
  /** Disable the query. Also disabled when any required param is empty/zero. */
  enabled?: boolean;
}

/**
 * Fetches comments for a GitHub issue.
 *
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param issueNumber - Issue number
 * @param params - Optional filter/pagination params (supports `since`, `per_page`, `page`)
 * @param options - Query options
 * @returns TanStack Query result with `GitHubPagedResponse<GitHubIssueComment>`
 */
export function useGhIssueComments(
  owner: string,
  repo: string,
  issueNumber: number,
  params?: PaginationParams & { since?: string },
  options: UseGhIssueCommentsOptions = {}
): UseQueryResult<GitHubPagedResponse<GitHubIssueComment>, Error> {
  const { enabled = true } = options;

  const client = useGhClient();

  return useQuery<GitHubPagedResponse<GitHubIssueComment>, Error>({
    queryKey: ghQueryKeys.issueComments(owner, repo, issueNumber, params),
    queryFn: ({ signal }) =>
      client.repo(owner, repo).issue(issueNumber).comments(params, signal),
    enabled: enabled && owner.length > 0 && repo.length > 0 && issueNumber > 0,
  });
}
