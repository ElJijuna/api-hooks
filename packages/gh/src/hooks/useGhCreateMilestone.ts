import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import type { CreateMilestoneData, GitHubMilestone } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';

/**
 * Creates a new milestone in a GitHub repository.
 *
 * Uses `useMutation` — call `mutate(data)` or `mutateAsync(data)` to create the milestone.
 *
 * @param owner - Repository owner (user or org)
 * @param repo - Repository name
 * @returns TanStack Mutation result with the created {@link GitHubMilestone}
 */
export function useGhCreateMilestone(
  owner: string,
  repo: string,
): UseMutationResult<GitHubMilestone, Error, CreateMilestoneData> {
  const client = useGhClient();

  return useMutation<GitHubMilestone, Error, CreateMilestoneData>({
    mutationFn: (data) => client.repo(owner, repo).createMilestone(data),
  });
}
