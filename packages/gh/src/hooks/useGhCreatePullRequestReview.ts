import { useMemo } from 'react';
import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { GitHubClient, PullRequestResource, type GitHubReview } from 'gh-api-client';

type CreateReviewData = Parameters<PullRequestResource['createReview']>[0];

export interface UseGhCreatePullRequestReviewOptions {
  /** GitHub personal access token — required to submit reviews. */
  token?: string;
}

/**
 * Submits a review on a GitHub pull request.
 *
 * Uses `useMutation` — call `mutate(data)` or `mutateAsync(data)` to submit the review.
 *
 * @param owner - Repository owner (user or org)
 * @param repo - Repository name
 * @param pullNumber - Pull request number
 * @param options - Options including the required `token`
 * @returns TanStack Mutation result with the created {@link GitHubReview}
 */
export function useGhCreatePullRequestReview(
  owner: string,
  repo: string,
  pullNumber: number,
  options: UseGhCreatePullRequestReviewOptions = {}
): UseMutationResult<GitHubReview, Error, CreateReviewData> {
  const { token } = options;
  const client = useMemo(() => new GitHubClient(token ? { token } : {}), [token]);

  return useMutation<GitHubReview, Error, CreateReviewData>({
    mutationFn: (data) => client.repo(owner, repo).pullRequest(pullNumber).createReview(data),
  });
}
