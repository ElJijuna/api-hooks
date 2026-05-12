import { useMemo } from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { GitHubClient, type GitHubCommit, type GitHubPagedResponse, type PaginationParams } from 'gh-api-client';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhPullRequestCommitsOptions {
  /** Disable the query. Also disabled when any required param is empty/zero. */
  enabled?: boolean;
  /** GitHub personal access token — required for private repositories. */
  token?: string;
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
  options: UseGhPullRequestCommitsOptions = {}
): UseQueryResult<GitHubPagedResponse<GitHubCommit>, Error> {
  const { enabled = true, token } = options;
  const client = useMemo(() => new GitHubClient(token ? { token } : {}), [token]);

  return useQuery<GitHubPagedResponse<GitHubCommit>, Error>({
    queryKey: ghQueryKeys.pullRequestCommits(owner, repo, pullNumber, params),
    queryFn: ({ signal }) =>
      client.repo(owner, repo).pullRequest(pullNumber).commits(params, signal),
    enabled: enabled && owner.length > 0 && repo.length > 0 && pullNumber > 0,
  });
}
