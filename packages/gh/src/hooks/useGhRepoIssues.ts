import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { GitHubIssue, GitHubPagedResponse, IssuesParams } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';
import type { QueryOverrides } from '../types.js';

export interface UseGhRepoIssuesOptions {
  /** Disable the query. Also disabled when `owner` or `repo` is empty. */
  enabled?: boolean;
  queryOptions?: QueryOverrides<GitHubPagedResponse<GitHubIssue>>;
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
  options: UseGhRepoIssuesOptions = {},
): UseQueryResult<GitHubPagedResponse<GitHubIssue>, Error> {
  const { enabled = true, queryOptions } = options;

  const client = useGhClient();

  return useQuery<GitHubPagedResponse<GitHubIssue>, Error>({
    queryKey: ghQueryKeys.repoIssues(owner, repo, params),
    queryFn: ({ signal }) => client.repo(owner, repo).issues(params, signal),
    ...queryOptions,
    enabled: enabled && owner.length > 0 && repo.length > 0,
  });
}
