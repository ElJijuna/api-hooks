import { useMemo } from 'react';
import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { GitHubClient } from 'gh-api-client';

export interface UseGhStarGistOptions {
  /** GitHub personal access token — required to star gists. */
  token?: string;
}

/**
 * Stars a GitHub Gist for the authenticated user.
 *
 * Uses `useMutation` — call `mutate()` or `mutateAsync()` to trigger the star.
 *
 * @param gistId - Gist ID to star
 * @param options - Options including the required `token`
 * @returns TanStack Mutation result (`void`)
 */
export function useGhStarGist(
  gistId: string,
  options: UseGhStarGistOptions = {}
): UseMutationResult<void, Error, void> {
  const { token } = options;
  const client = useMemo(() => new GitHubClient(token ? { token } : {}), [token]);

  return useMutation<void, Error, void>({
    mutationFn: () => client.gist(gistId).star(),
  });
}
