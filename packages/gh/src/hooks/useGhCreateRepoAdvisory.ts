import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import type { CreateAdvisoryData, GitHubRepositoryAdvisory } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';

/**
 * Creates a draft security advisory in a GitHub repository.
 *
 * @param owner - Repository owner
 * @param repo - Repository name
 * @returns TanStack Mutation result with the created advisory
 */
export function useGhCreateRepoAdvisory(
  owner: string,
  repo: string,
): UseMutationResult<GitHubRepositoryAdvisory, Error, CreateAdvisoryData> {
  const client = useGhClient();

  return useMutation<GitHubRepositoryAdvisory, Error, CreateAdvisoryData>({
    mutationFn: (data) => client.repo(owner, repo).createAdvisory(data),
  });
}
