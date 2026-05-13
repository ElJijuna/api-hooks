import { useMemo } from 'react';
import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { GitHubClient, type GitHubRepository, type CreateForkData } from 'gh-api-client';

export interface UseGhCreateForkOptions {
  /** GitHub personal access token — required to fork repositories. */
  token?: string;
}

/**
 * Creates a fork of a GitHub repository.
 *
 * Uses `useMutation` — call `mutate(data?)` or `mutateAsync(data?)` to trigger the fork.
 *
 * @param owner - Repository owner (user or org)
 * @param repo - Repository name
 * @param options - Options including the required `token`
 * @returns TanStack Mutation result with the forked {@link GitHubRepository}
 */
export function useGhCreateFork(
  owner: string,
  repo: string,
  options: UseGhCreateForkOptions = {}
): UseMutationResult<GitHubRepository, Error, CreateForkData | undefined> {
  const { token } = options;
  const client = useMemo(() => new GitHubClient(token ? { token } : {}), [token]);

  return useMutation<GitHubRepository, Error, CreateForkData | undefined>({
    mutationFn: (data) => client.repo(owner, repo).createFork(data),
  });
}
