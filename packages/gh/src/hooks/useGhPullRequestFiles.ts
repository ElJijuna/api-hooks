import { useMemo } from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { GitHubClient, type GitHubPullRequestFile, type GitHubPagedResponse, type PullRequestFilesParams } from 'gh-api-client';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhPullRequestFilesOptions {
  /** Disable the query. Also disabled when any required param is empty/zero. */
  enabled?: boolean;
  /** GitHub personal access token — required for private repositories. */
  token?: string;
}

/**
 * Fetches the files changed by a pull request.
 *
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param pullNumber - Pull request number
 * @param params - Optional pagination params
 * @param options - Query options
 * @returns TanStack Query result with `GitHubPagedResponse<GitHubPullRequestFile>`
 */
export function useGhPullRequestFiles(
  owner: string,
  repo: string,
  pullNumber: number,
  params?: PullRequestFilesParams,
  options: UseGhPullRequestFilesOptions = {}
): UseQueryResult<GitHubPagedResponse<GitHubPullRequestFile>, Error> {
  const { enabled = true, token } = options;
  const client = useMemo(() => new GitHubClient(token ? { token } : {}), [token]);

  return useQuery<GitHubPagedResponse<GitHubPullRequestFile>, Error>({
    queryKey: ghQueryKeys.pullRequestFiles(owner, repo, pullNumber, params),
    queryFn: ({ signal }) =>
      client.repo(owner, repo).pullRequest(pullNumber).files(params, signal),
    enabled: enabled && owner.length > 0 && repo.length > 0 && pullNumber > 0,
  });
}
