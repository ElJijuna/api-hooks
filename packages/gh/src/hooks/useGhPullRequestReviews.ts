import { useMemo } from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { GitHubClient, type GitHubReview, type GitHubPagedResponse, type ReviewsParams } from 'gh-api-client';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhPullRequestReviewsOptions {
  /** Disable the query. Also disabled when any required param is empty/zero. */
  enabled?: boolean;
  /** GitHub personal access token — required for private repositories. */
  token?: string;
}

/**
 * Fetches the reviews submitted on a pull request.
 *
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param pullNumber - Pull request number
 * @param params - Optional pagination params
 * @param options - Query options
 * @returns TanStack Query result with `GitHubPagedResponse<GitHubReview>`
 */
export function useGhPullRequestReviews(
  owner: string,
  repo: string,
  pullNumber: number,
  params?: ReviewsParams,
  options: UseGhPullRequestReviewsOptions = {}
): UseQueryResult<GitHubPagedResponse<GitHubReview>, Error> {
  const { enabled = true, token } = options;
  const client = useMemo(() => new GitHubClient(token ? { token } : {}), [token]);

  return useQuery<GitHubPagedResponse<GitHubReview>, Error>({
    queryKey: ghQueryKeys.pullRequestReviews(owner, repo, pullNumber, params),
    queryFn: ({ signal }) =>
      client.repo(owner, repo).pullRequest(pullNumber).reviews(params, signal),
    enabled: enabled && owner.length > 0 && repo.length > 0 && pullNumber > 0,
  });
}
