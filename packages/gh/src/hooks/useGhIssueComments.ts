import { useMemo } from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { GitHubClient, type GitHubIssueComment, type GitHubPagedResponse, type PaginationParams } from 'gh-api-client';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhIssueCommentsOptions {
  /** Disable the query. Also disabled when any required param is empty/zero. */
  enabled?: boolean;
  /** GitHub personal access token — required for private repositories. */
  token?: string;
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
  const { enabled = true, token } = options;
  const client = useMemo(() => new GitHubClient(token ? { token } : {}), [token]);

  return useQuery<GitHubPagedResponse<GitHubIssueComment>, Error>({
    queryKey: ghQueryKeys.issueComments(owner, repo, issueNumber, params),
    queryFn: ({ signal }) =>
      client.repo(owner, repo).issue(issueNumber).comments(params, signal),
    enabled: enabled && owner.length > 0 && repo.length > 0 && issueNumber > 0,
  });
}
