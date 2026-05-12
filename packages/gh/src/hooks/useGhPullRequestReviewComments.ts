import { useMemo } from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { GitHubClient, type GitHubReviewComment, type GitHubPagedResponse, type ReviewCommentsParams } from 'gh-api-client';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhPullRequestReviewCommentsOptions {
  /** Disable the query. Also disabled when any required param is empty/zero. */
  enabled?: boolean;
  /** GitHub personal access token — required for private repositories. */
  token?: string;
}

/**
 * Fetches the inline review comments on a pull request's diff.
 *
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param pullNumber - Pull request number
 * @param params - Optional filter/pagination params
 * @param options - Query options
 * @returns TanStack Query result with `GitHubPagedResponse<GitHubReviewComment>`
 */
export function useGhPullRequestReviewComments(
  owner: string,
  repo: string,
  pullNumber: number,
  params?: ReviewCommentsParams,
  options: UseGhPullRequestReviewCommentsOptions = {}
): UseQueryResult<GitHubPagedResponse<GitHubReviewComment>, Error> {
  const { enabled = true, token } = options;
  const client = useMemo(() => new GitHubClient(token ? { token } : {}), [token]);

  return useQuery<GitHubPagedResponse<GitHubReviewComment>, Error>({
    queryKey: ghQueryKeys.pullRequestReviewComments(owner, repo, pullNumber, params),
    queryFn: ({ signal }) =>
      client.repo(owner, repo).pullRequest(pullNumber).reviewComments(params, signal),
    enabled: enabled && owner.length > 0 && repo.length > 0 && pullNumber > 0,
  });
}
