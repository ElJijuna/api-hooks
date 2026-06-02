import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import type { CreateReleaseData, GitHubRelease } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';

/**
 * Creates a new release in a GitHub repository.
 *
 * Uses `useMutation` — call `mutate(data)` or `mutateAsync(data)` to create the release.
 *
 * @param owner - Repository owner (user or org)
 * @param repo - Repository name
 * @returns TanStack Mutation result with the created {@link GitHubRelease}
 */
export function useGhCreateRelease(
  owner: string,
  repo: string,
): UseMutationResult<GitHubRelease, Error, CreateReleaseData> {
  const client = useGhClient();

  return useMutation<GitHubRelease, Error, CreateReleaseData>({
    mutationFn: (data) => client.repo(owner, repo).createRelease(data),
  });
}
