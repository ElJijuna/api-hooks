import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { PullRequestResource, type GitHubPullRequest } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';

type RequestReviewersData = Parameters<PullRequestResource['requestReviewers']>[0];

/**
 * Requests reviewers for a GitHub pull request.
 *
 * Uses `useMutation` — call `mutate(data)` or `mutateAsync(data)` to request reviewers.
 *
 * @param owner - Repository owner (user or org)
 * @param repo - Repository name
 * @param pullNumber - Pull request number
 * @returns TanStack Mutation result with the updated {@link GitHubPullRequest}
 */
export function useGhRequestReviewers(
  owner: string,
  repo: string,
  pullNumber: number
): UseMutationResult<GitHubPullRequest, Error, RequestReviewersData> {

  const client = useGhClient();

  return useMutation<GitHubPullRequest, Error, RequestReviewersData>({
    mutationFn: (data) => client.repo(owner, repo).pullRequest(pullNumber).requestReviewers(data),
  });
}
