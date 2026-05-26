import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { IssueResource, type GitHubIssue } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';

type UpdateIssueData = Parameters<IssueResource['update']>[0];

/**
 * Updates a GitHub issue (title, body, state, labels, assignees, milestone).
 *
 * Uses `useMutation` — call `mutate(data)` or `mutateAsync(data)` to update.
 *
 * @param owner - Repository owner (user or org)
 * @param repo - Repository name
 * @param issueNumber - Issue number
 * @returns TanStack Mutation result with the updated {@link GitHubIssue}
 */
export function useGhUpdateIssue(
  owner: string,
  repo: string,
  issueNumber: number
): UseMutationResult<GitHubIssue, Error, UpdateIssueData> {

  const client = useGhClient();

  return useMutation<GitHubIssue, Error, UpdateIssueData>({
    mutationFn: (data) => client.repo(owner, repo).issue(issueNumber).update(data),
  });
}
