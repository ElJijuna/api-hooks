import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { type AddCollaboratorData } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';

type AddCollaboratorVars = { username: string; data?: AddCollaboratorData };

/**
 * Adds a collaborator to a GitHub repository.
 *
 * Uses `useMutation` — call `mutate({ username, data? })` to add the collaborator.
 *
 * @param owner - Repository owner (user or org)
 * @param repo - Repository name
 * @returns TanStack Mutation result
 */
export function useGhAddCollaborator(
  owner: string,
  repo: string
): UseMutationResult<void, Error, AddCollaboratorVars> {

  const client = useGhClient();

  return useMutation<void, Error, AddCollaboratorVars>({
    mutationFn: ({ username, data }) => client.repo(owner, repo).addCollaborator(username, data),
  });
}
