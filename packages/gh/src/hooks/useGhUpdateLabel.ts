import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import type { GitHubLabel, UpdateLabelData } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';

type UpdateLabelVars = { name: string; data: UpdateLabelData };

/**
 * Updates an existing label in a GitHub repository.
 *
 * Uses `useMutation` — call `mutate({ name, data })` or `mutateAsync({ name, data })` to update.
 *
 * @param owner - Repository owner (user or org)
 * @param repo - Repository name
 * @returns TanStack Mutation result with the updated {@link GitHubLabel}
 */
export function useGhUpdateLabel(
  owner: string,
  repo: string,
): UseMutationResult<GitHubLabel, Error, UpdateLabelVars> {
  const client = useGhClient();

  return useMutation<GitHubLabel, Error, UpdateLabelVars>({
    mutationFn: ({ name, data }) => client.repo(owner, repo).updateLabel(name, data),
  });
}
