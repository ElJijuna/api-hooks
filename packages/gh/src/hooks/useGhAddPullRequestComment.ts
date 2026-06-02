import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import type { GitHubReviewComment, PullRequestResource } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';

type AddCommentData = Parameters<PullRequestResource['addComment']>[0];

/**
 * Adds an inline diff comment to a GitHub pull request.
 *
 * Uses `useMutation` — call `mutate(data)` or `mutateAsync(data)` to post the comment.
 *
 * @param owner - Repository owner (user or org)
 * @param repo - Repository name
 * @param pullNumber - Pull request number
 * @returns TanStack Mutation result with the created {@link GitHubReviewComment}
 */
export function useGhAddPullRequestComment(
  owner: string,
  repo: string,
  pullNumber: number,
): UseMutationResult<GitHubReviewComment, Error, AddCommentData> {
  const client = useGhClient();

  return useMutation<GitHubReviewComment, Error, AddCommentData>({
    mutationFn: (data) => client.repo(owner, repo).pullRequest(pullNumber).addComment(data),
  });
}
