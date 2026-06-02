import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import { useGhClient } from '../GhClientContext.js';

/**
 * Deletes a label from a GitHub repository.
 *
 * Uses `useMutation` — call `mutate(name)` or `mutateAsync(name)` to delete.
 *
 * @param owner - Repository owner (user or org)
 * @param repo - Repository name
 * @returns TanStack Mutation result
 */
export function useGhDeleteLabel(
  owner: string,
  repo: string,
): UseMutationResult<void, Error, string> {
  const client = useGhClient();

  return useMutation<void, Error, string>({
    mutationFn: (name) => client.repo(owner, repo).deleteLabel(name),
  });
}
