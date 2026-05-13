import { useMemo } from 'react';
import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { GitHubClient, type GitHubIssue, type CreateIssueData } from 'gh-api-client';

export interface UseGhCreateIssueOptions {
  /** GitHub personal access token — required to create issues. */
  token?: string;
}

/**
 * Creates a new issue in a GitHub repository.
 *
 * Uses `useMutation` — call `mutate(data)` or `mutateAsync(data)` to create the issue.
 *
 * @param owner - Repository owner (user or org)
 * @param repo - Repository name
 * @param options - Options including the required `token`
 * @returns TanStack Mutation result with the created {@link GitHubIssue}
 */
export function useGhCreateIssue(
  owner: string,
  repo: string,
  options: UseGhCreateIssueOptions = {}
): UseMutationResult<GitHubIssue, Error, CreateIssueData> {
  const { token } = options;
  const client = useMemo(() => new GitHubClient(token ? { token } : {}), [token]);

  return useMutation<GitHubIssue, Error, CreateIssueData>({
    mutationFn: (data) => client.repo(owner, repo).createIssue(data),
  });
}
