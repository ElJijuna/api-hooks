import { useMemo } from 'react';
import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { GitHubClient, type GitHubGist } from 'gh-api-client';

export interface UseGhForkGistOptions {
  /** GitHub personal access token — required to fork gists. */
  token?: string;
}

/**
 * Forks a GitHub Gist.
 *
 * Uses `useMutation` — call `mutate()` or `mutateAsync()` to trigger the fork.
 *
 * @param gistId - Gist ID to fork
 * @param options - Options including the required `token`
 * @returns TanStack Mutation result with the forked {@link GitHubGist}
 */
export function useGhForkGist(
  gistId: string,
  options: UseGhForkGistOptions = {}
): UseMutationResult<GitHubGist, Error, void> {
  const { token } = options;
  const client = useMemo(() => new GitHubClient(token ? { token } : {}), [token]);

  return useMutation<GitHubGist, Error, void>({
    mutationFn: () => client.gist(gistId).fork(),
  });
}
