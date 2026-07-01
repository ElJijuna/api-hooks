import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import { useGhClient } from '../GhClientContext.js';
import type { MutationOverrides } from '../types.js';

export interface UseGhRemoveCollaboratorOptions {
  mutationOptions?: MutationOverrides<void, string>;
}

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
  repo: string,
  options: UseGhRemoveCollaboratorOptions = {},
): UseMutationResult<void, Error, string> {
  const { mutationOptions } = options;
  const client = useGhClient();

  return useMutation<void, Error, string>({
    mutationFn: (username) => client.repo(owner, repo).removeCollaborator(username),
    ...mutationOptions,
  });
}
