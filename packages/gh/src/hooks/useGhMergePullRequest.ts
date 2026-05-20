import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { PullRequestResource } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';

type MergeResult = Awaited<ReturnType<PullRequestResource['merge']>>;
type MergeData = Parameters<PullRequestResource['merge']>[0];

/**
 * Merges a GitHub pull request.
 *
 * Uses `useMutation` — call `mutate(data?)` or `mutateAsync(data?)` to trigger the merge.
 *
 * @param owner - Repository owner (user or org)
 * @param repo - Repository name
 * @param pullNumber - Pull request number
 * @returns TanStack Mutation result with {@link MergeResult}
 */
export function useGhMergePullRequest(
  owner: string,
  repo: string,
  pullNumber: number
): UseMutationResult<MergeResult, Error, MergeData | undefined> {

  const client = useGhClient();

  return useMutation<MergeResult, Error, MergeData | undefined>({
    mutationFn: (data) => client.repo(owner, repo).pullRequest(pullNumber).merge(data),
  });
}
