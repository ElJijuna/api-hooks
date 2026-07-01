import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import type { GitHubReview, PullRequestResource } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import type { MutationOverrides } from '../types.js';

type CreateReviewData = Parameters<PullRequestResource['createReview']>[0];

export interface UseGhCreatePullRequestReviewOptions {
  mutationOptions?: MutationOverrides<GitHubReview, CreateReviewData>;
}

/**
 * Submits a review on a GitHub pull request.
 *
 * Uses `useMutation` — call `mutate(data)` or `mutateAsync(data)` to submit the review.
 *
 * @param owner - Repository owner (user or org)
 * @param repo - Repository name
 * @param pullNumber - Pull request number
 * @returns TanStack Mutation result with the created {@link GitHubReview}
 */
export function useGhCreatePullRequestReview(
  owner: string,
  repo: string,
  pullNumber: number,
  options: UseGhCreatePullRequestReviewOptions = {},
): UseMutationResult<GitHubReview, Error, CreateReviewData> {
  const { mutationOptions } = options;
  const client = useGhClient();

  return useMutation<GitHubReview, Error, CreateReviewData>({
    mutationFn: (data) => client.repo(owner, repo).pullRequest(pullNumber).createReview(data),
    ...mutationOptions,
  });
}
