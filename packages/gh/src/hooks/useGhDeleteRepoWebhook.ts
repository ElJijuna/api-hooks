import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import { useGhClient } from '../GhClientContext.js';
import type { MutationOverrides } from '../types.js';

export interface DeleteRepoWebhookVariables {
  hookId: number;
}

export interface UseGhDeleteRepoWebhookOptions {
  mutationOptions?: MutationOverrides<void, DeleteRepoWebhookVariables>;
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
  repo: string,
  options: UseGhDeleteRepoWebhookOptions = {},
): UseMutationResult<void, Error, DeleteRepoWebhookVariables> {
  const { mutationOptions } = options;
  const client = useGhClient();

  return useMutation<void, Error, DeleteRepoWebhookVariables>({
    mutationFn: ({ hookId }) => client.repo(owner, repo).deleteWebhook(hookId),
    ...mutationOptions,
  });
}
