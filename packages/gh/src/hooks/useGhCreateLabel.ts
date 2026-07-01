import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import type { CreateLabelData, GitHubLabel } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import type { MutationOverrides } from '../types.js';

export interface UseGhCreateLabelOptions {
  mutationOptions?: MutationOverrides<GitHubLabel, CreateLabelData>;
}

/**
 * Creates a new label in a GitHub repository.
 *
 * Uses `useMutation` — call `mutate(data)` or `mutateAsync(data)` to create the label.
 *
 * @param owner - Repository owner (user or org)
 * @param repo - Repository name
 * @returns TanStack Mutation result with the created {@link GitHubLabel}
 */
export function useGhCreateLabel(
  owner: string,
  repo: string,
  options: UseGhCreateLabelOptions = {},
): UseMutationResult<GitHubLabel, Error, CreateLabelData> {
  const { mutationOptions } = options;
  const client = useGhClient();

  return useMutation<GitHubLabel, Error, CreateLabelData>({
    mutationFn: (data) => client.repo(owner, repo).createLabel(data),
    ...mutationOptions,
  });
}
