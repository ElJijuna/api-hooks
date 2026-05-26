import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { useGhClient } from '../GhClientContext.js';

/**
 * Removes a collaborator from a GitHub repository.
 *
 * Uses `useMutation` — call `mutate(username)` to remove the collaborator.
 *
 * @param owner - Repository owner (user or org)
 * @param repo - Repository name
 * @returns TanStack Mutation result
 */
export function useGhRemoveCollaborator(
  owner: string,
  repo: string
): UseMutationResult<void, Error, string> {

  const client = useGhClient();

  return useMutation<void, Error, string>({
    mutationFn: (username) => client.repo(owner, repo).removeCollaborator(username),
  });
}
