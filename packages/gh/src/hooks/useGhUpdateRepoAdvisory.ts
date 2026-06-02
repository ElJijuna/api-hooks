import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import type { GitHubRepositoryAdvisory, UpdateAdvisoryData } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';

export interface UpdateRepoAdvisoryVariables {
  ghsaId: string;
  data: UpdateAdvisoryData;
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
): UseMutationResult<GitHubRepositoryAdvisory, Error, UpdateRepoAdvisoryVariables> {
  const client = useGhClient();

  return useMutation<GitHubRepositoryAdvisory, Error, UpdateRepoAdvisoryVariables>({
    mutationFn: ({ ghsaId, data }) => client.repo(owner, repo).updateAdvisory(ghsaId, data),
  });
}
