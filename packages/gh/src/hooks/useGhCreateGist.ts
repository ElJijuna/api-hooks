import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import type { CreateGistData, GitHubGist } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import type { MutationOverrides } from '../types.js';

export interface UseGhCreateGistOptions {
  mutationOptions?: MutationOverrides<GitHubGist, CreateGistData>;
}

/**
 * Creates a new GitHub Gist.
 *
 * Uses `useMutation` — call `mutate(data)` or `mutateAsync(data)` to trigger the creation.
 *
 * @returns TanStack Mutation result with {@link GitHubGist}
 */
export function useGhCreateGist(
  options: UseGhCreateGistOptions = {},
): UseMutationResult<GitHubGist, Error, CreateGistData> {
  const { mutationOptions } = options;
  const client = useGhClient();

  return useMutation<GitHubGist, Error, CreateGistData>({
    mutationFn: (data) => client.createGist(data),
    ...mutationOptions,
  });
}
