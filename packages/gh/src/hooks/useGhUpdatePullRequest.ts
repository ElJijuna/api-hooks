import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import type { GitHubPullRequest, PullRequestResource } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import type { MutationOverrides } from '../types.js';

type UpdatePullRequestData = Parameters<PullRequestResource['update']>[0];

export interface UseGhUpdatePullRequestOptions {
  mutationOptions?: MutationOverrides<GitHubPullRequest, UpdatePullRequestData>;
}

/**
 * Updates metadata of a GitHub pull request (title, body, state, base branch).
 *
 * Uses `useMutation` — call `mutate(data)` or `mutateAsync(data)` to trigger the update.
 *
 * @param owner - Repository owner (user or org)
 * @param repo - Repository name
 * @param pullNumber - Pull request number
 * @returns TanStack Mutation result with the updated {@link GitHubPullRequest}
 */
export function useGhUpdatePullRequest(
  owner: string,
  repo: string,
  pullNumber: number,
  options: UseGhUpdatePullRequestOptions = {},
): UseMutationResult<GitHubPullRequest, Error, UpdatePullRequestData> {
  const { mutationOptions } = options;
  const client = useGhClient();

  return useMutation<GitHubPullRequest, Error, UpdatePullRequestData>({
    mutationFn: (data) => client.repo(owner, repo).pullRequest(pullNumber).update(data),
    ...mutationOptions,
  });
}
