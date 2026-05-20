import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { type GitHubGist } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';

/**
 * Forks a GitHub Gist.
 *
 * Uses `useMutation` — call `mutate()` or `mutateAsync()` to trigger the fork.
 *
 * @param gistId - Gist ID to fork
 * @returns TanStack Mutation result with the forked {@link GitHubGist}
 */
export function useGhForkGist(
  gistId: string
): UseMutationResult<GitHubGist, Error, void> {

  const client = useGhClient();

  return useMutation<GitHubGist, Error, void>({
    mutationFn: () => client.gist(gistId).fork(),
  });
}
