import { useMemo } from 'react';
import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { GitHubClient } from 'gh-api-client';

export interface UseGhUnstarGistOptions {
  /** GitHub personal access token — required to unstar gists. */
  token?: string;
}

/**
 * Unstars a GitHub Gist for the authenticated user.
 *
 * Uses `useMutation` — call `mutate()` or `mutateAsync()` to trigger the unstar.
 *
 * @param gistId - Gist ID to unstar
 * @param options - Options including the required `token`
 * @returns TanStack Mutation result (`void`)
 */
export function useGhUnstarGist(
  gistId: string,
  options: UseGhUnstarGistOptions = {}
): UseMutationResult<void, Error, void> {
  const { token } = options;
  const client = useMemo(() => new GitHubClient(token ? { token } : {}), [token]);

  return useMutation<void, Error, void>({
    mutationFn: () => client.gist(gistId).unstar(),
  });
}
