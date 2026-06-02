import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import type { GitHubMilestone, UpdateMilestoneData } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';

type UpdateMilestoneVars = { milestoneNumber: number; data: UpdateMilestoneData };

/**
 * Updates an existing milestone in a GitHub repository.
 *
 * Uses `useMutation` — call `mutate({ milestoneNumber, data })` to update.
 *
 * @param owner - Repository owner (user or org)
 * @param repo - Repository name
 * @returns TanStack Mutation result with the updated {@link GitHubMilestone}
 */
export function useGhUpdateMilestone(
  owner: string,
  repo: string,
): UseMutationResult<GitHubMilestone, Error, UpdateMilestoneVars> {
  const client = useGhClient();

  return useMutation<GitHubMilestone, Error, UpdateMilestoneVars>({
    mutationFn: ({ milestoneNumber, data }) =>
      client.repo(owner, repo).updateMilestone(milestoneNumber, data),
  });
}
