import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import type { GitHubRepositoryAdvisory, UpdateAdvisoryData } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import type { MutationOverrides } from '../types.js';

export interface UpdateRepoAdvisoryVariables {
  ghsaId: string;
  data: UpdateAdvisoryData;
}

export interface UseGhUpdateRepoAdvisoryOptions {
  mutationOptions?: MutationOverrides<GitHubRepositoryAdvisory, UpdateRepoAdvisoryVariables>;
}

/**
 * Updates a repository security advisory.
 *
 * @param owner - Repository owner
 * @param repo - Repository name
 * @returns TanStack Mutation result with the updated advisory
 */
export function useGhUpdateRepoAdvisory(
  owner: string,
  repo: string,
  options: UseGhUpdateRepoAdvisoryOptions = {},
): UseMutationResult<GitHubRepositoryAdvisory, Error, UpdateRepoAdvisoryVariables> {
  const { mutationOptions } = options;
  const client = useGhClient();

  return useMutation<GitHubRepositoryAdvisory, Error, UpdateRepoAdvisoryVariables>({
    mutationFn: ({ ghsaId, data }) => client.repo(owner, repo).updateAdvisory(ghsaId, data),
    ...mutationOptions,
  });
}
