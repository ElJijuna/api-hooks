import { useMemo } from 'react';
import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { GitHubClient, type GitHubGist, type CreateGistData } from 'gh-api-client';

export interface UseGhCreateGistOptions {
  /** GitHub personal access token — required to create gists. */
  token?: string;
}

/**
 * Creates a new GitHub Gist.
 *
 * Uses `useMutation` — call `mutate(data)` or `mutateAsync(data)` to trigger the creation.
 *
 * @param options - Options including the required `token`
 * @returns TanStack Mutation result with {@link GitHubGist}
 */
export function useGhCreateGist(options: UseGhCreateGistOptions = {}): UseMutationResult<GitHubGist, Error, CreateGistData> {
  const { token } = options;
  const client = useMemo(() => new GitHubClient(token ? { token } : {}), [token]);

  return useMutation<GitHubGist, Error, CreateGistData>({
    mutationFn: (data) => client.createGist(data),
  });
}
