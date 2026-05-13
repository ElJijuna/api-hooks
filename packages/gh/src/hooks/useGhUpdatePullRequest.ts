import { useMemo } from 'react';
import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { GitHubClient, PullRequestResource, type GitHubPullRequest } from 'gh-api-client';

type UpdatePullRequestData = Parameters<PullRequestResource['update']>[0];

export interface UseGhUpdatePullRequestOptions {
  /** GitHub personal access token — required to update pull requests. */
  token?: string;
}

/**
 * Updates metadata of a GitHub pull request (title, body, state, base branch).
 *
 * Uses `useMutation` — call `mutate(data)` or `mutateAsync(data)` to trigger the update.
 *
 * @param owner - Repository owner (user or org)
 * @param repo - Repository name
 * @param pullNumber - Pull request number
 * @param options - Options including the required `token`
 * @returns TanStack Mutation result with the updated {@link GitHubPullRequest}
 */
export function useGhUpdatePullRequest(
  owner: string,
  repo: string,
  pullNumber: number,
  options: UseGhUpdatePullRequestOptions = {}
): UseMutationResult<GitHubPullRequest, Error, UpdatePullRequestData> {
  const { token } = options;
  const client = useMemo(() => new GitHubClient(token ? { token } : {}), [token]);

  return useMutation<GitHubPullRequest, Error, UpdatePullRequestData>({
    mutationFn: (data) => client.repo(owner, repo).pullRequest(pullNumber).update(data),
  });
}
