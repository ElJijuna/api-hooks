import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { GitHubCommit, GitHubPagedResponse, PaginationParams } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';
import type { QueryOverrides } from '../types.js';

export interface UseGhPullRequestCommitsOptions {
  /** Disable the query. Also disabled when any required param is empty/zero. */
  enabled?: boolean;
  queryOptions?: QueryOverrides<GitHubPagedResponse<GitHubCommit>>;
}

/**
 * Fetches the commits included in a pull request.
 *
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param pullNumber - Pull request number
 * @param params - Optional pagination params
 * @param options - Query options
 * @returns TanStack Query result with `GitHubPagedResponse<GitHubCommit>`
 */
export function useGhPullRequestCommits(
  owner: string,
  repo: string,
  pullNumber: number,
  params?: PaginationParams,
  options: UseGhPullRequestCommitsOptions = {},
): UseQueryResult<GitHubPagedResponse<GitHubCommit>, Error> {
  const { enabled = true, queryOptions } = options;

  const client = useGhClient();

  return useQuery<GitHubPagedResponse<GitHubCommit>, Error>({
    queryKey: ghQueryKeys.pullRequestCommits(owner, repo, pullNumber, params),
    queryFn: ({ signal }) =>
      client.repo(owner, repo).pullRequest(pullNumber).commits(params, signal),
    ...queryOptions,
    enabled: enabled && owner.length > 0 && repo.length > 0 && pullNumber > 0,
  });
}
