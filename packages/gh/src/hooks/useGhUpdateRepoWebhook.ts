import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import type { GitHubWebhook, UpdateWebhookData } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';

export interface UpdateRepoWebhookVariables {
  hookId: number;
  data: UpdateWebhookData;
}

/**
 * Updates a webhook on a GitHub repository.
 *
 * @param owner - Repository owner
 * @param repo - Repository name
 * @returns TanStack Mutation result with the updated webhook
 */
export function useGhUpdateRepoWebhook(
  owner: string,
  repo: string,
): UseMutationResult<GitHubWebhook, Error, UpdateRepoWebhookVariables> {
  const client = useGhClient();

  return useMutation<GitHubWebhook, Error, UpdateRepoWebhookVariables>({
    mutationFn: ({ hookId, data }) => client.repo(owner, repo).updateWebhook(hookId, data),
  });
}
