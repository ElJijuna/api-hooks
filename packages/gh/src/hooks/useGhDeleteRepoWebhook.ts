import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { useGhClient } from '../GhClientContext.js';

export interface DeleteRepoWebhookVariables {
  hookId: number;
}

/**
 * Deletes a webhook from a GitHub repository.
 *
 * @param owner - Repository owner
 * @param repo - Repository name
 * @returns TanStack Mutation result
 */
export function useGhDeleteRepoWebhook(
  owner: string,
  repo: string
): UseMutationResult<void, Error, DeleteRepoWebhookVariables> {
  const client = useGhClient();

  return useMutation<void, Error, DeleteRepoWebhookVariables>({
    mutationFn: ({ hookId }) => client.repo(owner, repo).deleteWebhook(hookId),
  });
}
