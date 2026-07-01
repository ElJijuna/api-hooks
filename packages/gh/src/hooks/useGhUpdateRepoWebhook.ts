import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import type { GitHubWebhook, UpdateWebhookData } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import type { MutationOverrides } from '../types.js';

export interface UpdateRepoWebhookVariables {
  hookId: number;
  data: UpdateWebhookData;
}

export interface UseGhUpdateRepoWebhookOptions {
  mutationOptions?: MutationOverrides<GitHubWebhook, UpdateRepoWebhookVariables>;
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
  options: UseGhUpdateRepoWebhookOptions = {},
): UseMutationResult<GitHubWebhook, Error, UpdateRepoWebhookVariables> {
  const { mutationOptions } = options;
  const client = useGhClient();

  return useMutation<GitHubWebhook, Error, UpdateRepoWebhookVariables>({
    mutationFn: ({ hookId, data }) => client.repo(owner, repo).updateWebhook(hookId, data),
    ...mutationOptions,
  });
}
