import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import { useGhClient } from '../GhClientContext.js';

/**
 * Deletes a milestone from a GitHub repository.
 *
 * Uses `useMutation` — call `mutate(milestoneNumber)` to delete.
 *
 * @param owner - Repository owner (user or org)
 * @param repo - Repository name
 * @returns TanStack Mutation result
 */
export function useGhDeleteMilestone(
  owner: string,
  repo: string,
): UseMutationResult<void, Error, number> {
  const client = useGhClient();

  return useMutation<void, Error, number>({
    mutationFn: (milestoneNumber) => client.repo(owner, repo).deleteMilestone(milestoneNumber),
  });
}
