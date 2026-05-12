import { useMemo } from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { GitHubClient, type GitHubIssue, type GitHubPagedResponse, type IssuesParams } from 'gh-api-client';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhRepoIssuesOptions {
  /** Disable the query. Also disabled when `owner` or `repo` is empty. */
  enabled?: boolean;
  /** GitHub personal access token — required for private repositories. */
  token?: string;
}

/**
 * Fetches issues for a GitHub repository.
 *
 * Note: GitHub returns pull requests as issues from this endpoint.
 * Filter them out by checking for the absence of `pull_request`.
 *
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param params - Optional filter/pagination params
 * @param options - Query options
 * @returns TanStack Query result with `GitHubPagedResponse<GitHubIssue>`
 */
export function useGhRepoIssues(
  owner: string,
  repo: string,
  params?: IssuesParams,
  options: UseGhRepoIssuesOptions = {}
): UseQueryResult<GitHubPagedResponse<GitHubIssue>, Error> {
  const { enabled = true, token } = options;
  const client = useMemo(() => new GitHubClient(token ? { token } : {}), [token]);

  return useQuery<GitHubPagedResponse<GitHubIssue>, Error>({
    queryKey: ghQueryKeys.repoIssues(owner, repo, params),
    queryFn: ({ signal }) => client.repo(owner, repo).issues(params, signal),
    enabled: enabled && owner.length > 0 && repo.length > 0,
  });
}
