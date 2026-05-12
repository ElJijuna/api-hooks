import { useMemo } from 'react';
import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { GitHubClient, type GitHubGist, type UpdateGistData } from 'gh-api-client';

export interface UseGhUpdateGistOptions {
  /** GitHub personal access token — required to update gists. */
  token?: string;
}

/**
 * Updates an existing GitHub Gist.
 *
 * Uses `useMutation` — call `mutate(data)` or `mutateAsync(data)` to trigger the update.
 *
 * @param gistId - Gist ID to update
 * @param options - Options including the required `token`
 * @returns TanStack Mutation result with {@link GitHubGist}
 */
export function useGhUpdateGist(
  gistId: string,
  options: UseGhUpdateGistOptions = {}
): UseMutationResult<GitHubGist, Error, UpdateGistData> {
  const { token } = options;
  const client = useMemo(() => new GitHubClient(token ? { token } : {}), [token]);

  return useMutation<GitHubGist, Error, UpdateGistData>({
    mutationFn: (data) => client.gist(gistId).update(data),
  });
}
