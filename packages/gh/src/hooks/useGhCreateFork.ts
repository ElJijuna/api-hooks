import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import type { CreateForkData, GitHubRepository } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';

/**
 * Creates a fork of a GitHub repository.
 *
 * Uses `useMutation` — call `mutate(data?)` or `mutateAsync(data?)` to trigger the fork.
 *
 * @param owner - Repository owner (user or org)
 * @param repo - Repository name
 * @returns TanStack Mutation result with the forked {@link GitHubRepository}
 */
export function useGhCreateFork(
  owner: string,
  repo: string,
): UseMutationResult<GitHubRepository, Error, CreateForkData | undefined> {
  const client = useGhClient();

  return useMutation<GitHubRepository, Error, CreateForkData | undefined>({
    mutationFn: (data) => client.repo(owner, repo).createFork(data),
  });
}
