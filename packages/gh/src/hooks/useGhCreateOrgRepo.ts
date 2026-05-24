import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { type CreateOrgRepoData, type GitHubRepository } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';

/**
 * Creates a repository in a GitHub organization.
 *
 * Uses `useMutation` — call `mutate(data)` or `mutateAsync(data)` to create the repo.
 *
 * @param orgName - Organization login
 * @returns TanStack Mutation result with the created repository
 */
export function useGhCreateOrgRepo(
  orgName: string
): UseMutationResult<GitHubRepository, Error, CreateOrgRepoData> {
  const client = useGhClient();

  return useMutation<GitHubRepository, Error, CreateOrgRepoData>({
    mutationFn: (data) => client.org(orgName).createRepo(data),
  });
}
