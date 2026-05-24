import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { type GitHubRepositoryAdvisory } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';

export interface RequestRepoAdvisoryCveVariables {
  ghsaId: string;
}

/**
 * Requests a CVE ID for a repository security advisory.
 *
 * @param owner - Repository owner
 * @param repo - Repository name
 * @returns TanStack Mutation result with the updated advisory
 */
export function useGhRequestRepoAdvisoryCve(
  owner: string,
  repo: string
): UseMutationResult<GitHubRepositoryAdvisory, Error, RequestRepoAdvisoryCveVariables> {
  const client = useGhClient();

  return useMutation<GitHubRepositoryAdvisory, Error, RequestRepoAdvisoryCveVariables>({
    mutationFn: ({ ghsaId }) => client.repo(owner, repo).requestCve(ghsaId),
  });
}
