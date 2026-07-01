import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import { useGhClient } from '../GhClientContext.js';
import type { MutationOverrides } from '../types.js';

export interface UseGhDeleteMilestoneOptions {
  mutationOptions?: MutationOverrides<void, number>;
}

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
  options: UseGhDeleteMilestoneOptions = {},
): UseMutationResult<void, Error, number> {
  const { mutationOptions } = options;
  const client = useGhClient();

  return useMutation<void, Error, number>({
    mutationFn: (milestoneNumber) => client.repo(owner, repo).deleteMilestone(milestoneNumber),
    ...mutationOptions,
  });
}
