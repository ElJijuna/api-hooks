import { useMemo } from 'react';
import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { GitHubClient, PullRequestResource, type GitHubReviewComment } from 'gh-api-client';

type AddCommentData = Parameters<PullRequestResource['addComment']>[0];

export interface UseGhAddPullRequestCommentOptions {
  /** GitHub personal access token — required to add inline comments. */
  token?: string;
}

/**
 * Adds an inline diff comment to a GitHub pull request.
 *
 * Uses `useMutation` — call `mutate(data)` or `mutateAsync(data)` to post the comment.
 *
 * @param owner - Repository owner (user or org)
 * @param repo - Repository name
 * @param pullNumber - Pull request number
 * @param options - Options including the required `token`
 * @returns TanStack Mutation result with the created {@link GitHubReviewComment}
 */
export function useGhAddPullRequestComment(
  owner: string,
  repo: string,
  pullNumber: number,
  options: UseGhAddPullRequestCommentOptions = {}
): UseMutationResult<GitHubReviewComment, Error, AddCommentData> {
  const { token } = options;
  const client = useMemo(() => new GitHubClient(token ? { token } : {}), [token]);

  return useMutation<GitHubReviewComment, Error, AddCommentData>({
    mutationFn: (data) => client.repo(owner, repo).pullRequest(pullNumber).addComment(data),
  });
}
