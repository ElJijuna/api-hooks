import { useMemo } from 'react';
import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { GitHubClient, PullRequestResource, type GitHubPullRequest } from 'gh-api-client';

type RequestReviewersData = Parameters<PullRequestResource['requestReviewers']>[0];

export interface UseGhRequestReviewersOptions {
  /** GitHub personal access token — required to request reviewers. */
  token?: string;
}

/**
 * Requests reviewers for a GitHub pull request.
 *
 * Uses `useMutation` — call `mutate(data)` or `mutateAsync(data)` to request reviewers.
 *
 * @param owner - Repository owner (user or org)
 * @param repo - Repository name
 * @param pullNumber - Pull request number
 * @param options - Options including the required `token`
 * @returns TanStack Mutation result with the updated {@link GitHubPullRequest}
 */
export function useGhRequestReviewers(
  owner: string,
  repo: string,
  pullNumber: number,
  options: UseGhRequestReviewersOptions = {}
): UseMutationResult<GitHubPullRequest, Error, RequestReviewersData> {
  const { token } = options;
  const client = useMemo(() => new GitHubClient(token ? { token } : {}), [token]);

  return useMutation<GitHubPullRequest, Error, RequestReviewersData>({
    mutationFn: (data) => client.repo(owner, repo).pullRequest(pullNumber).requestReviewers(data),
  });
}
