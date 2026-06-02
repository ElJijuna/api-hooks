import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import { useGhClient } from '../GhClientContext.js';

/**
 * Deletes a release from a GitHub repository.
 *
 * Uses `useMutation` — call `mutate(releaseId)` to delete.
 *
 * @param owner - Repository owner (user or org)
 * @param repo - Repository name
 * @returns TanStack Mutation result
 */
export function useGhDeleteRelease(
  owner: string,
  repo: string,
): UseMutationResult<void, Error, number> {
  const client = useGhClient();

  return useMutation<void, Error, number>({
    mutationFn: (releaseId) => client.repo(owner, repo).deleteRelease(releaseId),
  });
}
