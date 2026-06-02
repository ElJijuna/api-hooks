import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import type { CreateWebhookData, GitHubWebhook } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';

/**
 * Creates a webhook on a GitHub repository.
 *
 * @param owner - Repository owner
 * @param repo - Repository name
 * @returns TanStack Mutation result with the created webhook
 */
export function useGhCreateRepoWebhook(
  owner: string,
  repo: string,
): UseMutationResult<GitHubWebhook, Error, CreateWebhookData> {
  const client = useGhClient();

  return useMutation<GitHubWebhook, Error, CreateWebhookData>({
    mutationFn: (data) => client.repo(owner, repo).createWebhook(data),
  });
}
