import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import type { AddCollaboratorData } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import type { MutationOverrides } from '../types.js';

type AddCollaboratorVars = { username: string; data?: AddCollaboratorData };

export interface UseGhAddCollaboratorOptions {
  mutationOptions?: MutationOverrides<void, AddCollaboratorVars>;
}

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
  repo: string,
  options: UseGhAddCollaboratorOptions = {},
): UseMutationResult<void, Error, AddCollaboratorVars> {
  const { mutationOptions } = options;
  const client = useGhClient();

  return useMutation<void, Error, AddCollaboratorVars>({
    mutationFn: ({ username, data }) => client.repo(owner, repo).addCollaborator(username, data),
    ...mutationOptions,
  });
}
