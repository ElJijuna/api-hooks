import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import type { GitHubRelease, UpdateReleaseData } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';

type UpdateReleaseVars = { releaseId: number; data: UpdateReleaseData };

/**
 * Updates an existing release in a GitHub repository.
 *
 * Uses `useMutation` — call `mutate({ releaseId, data })` to update.
 *
 * @param owner - Repository owner (user or org)
 * @param repo - Repository name
 * @returns TanStack Mutation result with the updated {@link GitHubRelease}
 */
export function useGhUpdateRelease(
  owner: string,
  repo: string,
): UseMutationResult<GitHubRelease, Error, UpdateReleaseVars> {
  const client = useGhClient();

  return useMutation<GitHubRelease, Error, UpdateReleaseVars>({
    mutationFn: ({ releaseId, data }) => client.repo(owner, repo).updateRelease(releaseId, data),
  });
}
