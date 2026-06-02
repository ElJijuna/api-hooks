import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import type { GitHubIssueComment } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';

/**
 * Adds a comment to a GitHub issue.
 *
 * Uses `useMutation` — call `mutate(body)` or `mutateAsync(body)` to post the comment.
 *
 * @param owner - Repository owner (user or org)
 * @param repo - Repository name
 * @param issueNumber - Issue number
 * @returns TanStack Mutation result with the created {@link GitHubIssueComment}
 */
export function useGhAddIssueComment(
  owner: string,
  repo: string,
  issueNumber: number,
): UseMutationResult<GitHubIssueComment, Error, string> {
  const client = useGhClient();

  return useMutation<GitHubIssueComment, Error, string>({
    mutationFn: (body) => client.repo(owner, repo).issue(issueNumber).addComment(body),
  });
}
