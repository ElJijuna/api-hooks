import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import type { GitHubGist, UpdateGistData } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import type { MutationOverrides } from '../types.js';

export interface UseGhUpdateGistOptions {
  mutationOptions?: MutationOverrides<GitHubGist, UpdateGistData>;
}

/**
 * Updates an existing GitHub Gist.
 *
 * Uses `useMutation` — call `mutate(data)` or `mutateAsync(data)` to trigger the update.
 *
 * @param gistId - Gist ID to update
 * @returns TanStack Mutation result with {@link GitHubGist}
 */
export function useGhUpdateGist(
  gistId: string,
  options: UseGhUpdateGistOptions = {},
): UseMutationResult<GitHubGist, Error, UpdateGistData> {
  const { mutationOptions } = options;
  const client = useGhClient();

  return useMutation<GitHubGist, Error, UpdateGistData>({
    mutationFn: (data) => client.gist(gistId).update(data),
    ...mutationOptions,
  });
}
