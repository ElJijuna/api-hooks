import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import type { GitHubRepositoryAdvisory } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import type { MutationOverrides } from '../types.js';

export interface RequestRepoAdvisoryCveVariables {
  ghsaId: string;
}

export interface UseGhRequestRepoAdvisoryCveOptions {
  mutationOptions?: MutationOverrides<GitHubRepositoryAdvisory, RequestRepoAdvisoryCveVariables>;
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
  repo: string,
  options: UseGhRequestRepoAdvisoryCveOptions = {},
): UseMutationResult<GitHubRepositoryAdvisory, Error, RequestRepoAdvisoryCveVariables> {
  const { mutationOptions } = options;
  const client = useGhClient();

  return useMutation<GitHubRepositoryAdvisory, Error, RequestRepoAdvisoryCveVariables>({
    mutationFn: ({ ghsaId }) => client.repo(owner, repo).requestCve(ghsaId),
    ...mutationOptions,
  });
}
