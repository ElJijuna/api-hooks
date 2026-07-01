import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import type { CreateIssueData, GitHubIssue } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import type { MutationOverrides } from '../types.js';

export interface UseGhCreateIssueOptions {
  mutationOptions?: MutationOverrides<GitHubIssue, CreateIssueData>;
}

/**
 * Creates a new issue in a GitHub repository.
 *
 * Uses `useMutation` — call `mutate(data)` or `mutateAsync(data)` to create the issue.
 *
 * @param owner - Repository owner (user or org)
 * @param repo - Repository name
 * @returns TanStack Mutation result with the created {@link GitHubIssue}
 */
export function useGhCreateIssue(
  owner: string,
  repo: string,
  options: UseGhCreateIssueOptions = {},
): UseMutationResult<GitHubIssue, Error, CreateIssueData> {
  const { mutationOptions } = options;
  const client = useGhClient();

  return useMutation<GitHubIssue, Error, CreateIssueData>({
    mutationFn: (data) => client.repo(owner, repo).createIssue(data),
    ...mutationOptions,
  });
}
