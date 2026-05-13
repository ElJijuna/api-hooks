import { useMemo } from 'react';
import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { GitHubClient, PullRequestResource } from 'gh-api-client';

type MergeResult = Awaited<ReturnType<PullRequestResource['merge']>>;
type MergeData = Parameters<PullRequestResource['merge']>[0];

export interface UseGhMergePullRequestOptions {
  /** GitHub personal access token — required to merge pull requests. */
  token?: string;
}

/**
 * Merges a GitHub pull request.
 *
 * Uses `useMutation` — call `mutate(data?)` or `mutateAsync(data?)` to trigger the merge.
 *
 * @param owner - Repository owner (user or org)
 * @param repo - Repository name
 * @param pullNumber - Pull request number
 * @param options - Options including the required `token`
 * @returns TanStack Mutation result with {@link MergeResult}
 */
export function useGhMergePullRequest(
  owner: string,
  repo: string,
  pullNumber: number,
  options: UseGhMergePullRequestOptions = {}
): UseMutationResult<MergeResult, Error, MergeData | undefined> {
  const { token } = options;
  const client = useMemo(() => new GitHubClient(token ? { token } : {}), [token]);

  return useMutation<MergeResult, Error, MergeData | undefined>({
    mutationFn: (data) => client.repo(owner, repo).pullRequest(pullNumber).merge(data),
  });
}
