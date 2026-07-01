import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import type { CreateOrgRepoData, GitHubRepository } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import type { MutationOverrides } from '../types.js';

export interface UseGhCreateOrgRepoOptions {
  mutationOptions?: MutationOverrides<GitHubRepository, CreateOrgRepoData>;
}

/**
 * Creates a repository in a GitHub organization.
 *
 * Uses `useMutation` — call `mutate(data)` or `mutateAsync(data)` to create the repo.
 *
 * @param orgName - Organization login
 * @returns TanStack Mutation result with the created repository
 */
export function useGhCreateOrgRepo(
  orgName: string,
  options: UseGhCreateOrgRepoOptions = {},
): UseMutationResult<GitHubRepository, Error, CreateOrgRepoData> {
  const { mutationOptions } = options;
  const client = useGhClient();

  return useMutation<GitHubRepository, Error, CreateOrgRepoData>({
    mutationFn: (data) => client.org(orgName).createRepo(data),
    ...mutationOptions,
  });
}
