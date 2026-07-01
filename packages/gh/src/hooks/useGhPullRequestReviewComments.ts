import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { GitHubPagedResponse, GitHubReviewComment, ReviewCommentsParams } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';
import type { QueryOverrides } from '../types.js';

export interface UseGhPullRequestReviewCommentsOptions {
  /** Disable the query. Also disabled when any required param is empty/zero. */
  enabled?: boolean;
  queryOptions?: QueryOverrides<GitHubPagedResponse<GitHubReviewComment>>;
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
  options: UseGhPullRequestReviewCommentsOptions = {},
): UseQueryResult<GitHubPagedResponse<GitHubReviewComment>, Error> {
  const { enabled = true, queryOptions } = options;

  const client = useGhClient();

  return useQuery<GitHubPagedResponse<GitHubReviewComment>, Error>({
    queryKey: ghQueryKeys.pullRequestReviewComments(owner, repo, pullNumber, params),
    queryFn: ({ signal }) =>
      client.repo(owner, repo).pullRequest(pullNumber).reviewComments(params, signal),
    ...queryOptions,
    enabled: enabled && owner.length > 0 && repo.length > 0 && pullNumber > 0,
  });
}
