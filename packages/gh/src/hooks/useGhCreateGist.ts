import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import type { CreateGistData, GitHubGist } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';

/**
 * Creates a new GitHub Gist.
 *
 * Uses `useMutation` — call `mutate(data)` or `mutateAsync(data)` to trigger the creation.
 *
 * @returns TanStack Mutation result with {@link GitHubGist}
 */
export function useGhCreateGist(): UseMutationResult<GitHubGist, Error, CreateGistData> {
  const client = useGhClient();

  return useMutation<GitHubGist, Error, CreateGistData>({
    mutationFn: (data) => client.createGist(data),
  });
}
