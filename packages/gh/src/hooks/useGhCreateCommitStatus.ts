import { useMemo } from 'react';
import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { GitHubClient, CommitResource, type GitHubCommitStatus } from 'gh-api-client';

type CreateStatusData = Parameters<CommitResource['createStatus']>[0];

export interface UseGhCreateCommitStatusOptions {
  /** GitHub personal access token — required for private repositories. */
  token?: string;
}

/**
 * Creates a commit status for a specific ref.
 *
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param ref - Commit SHA
 * @param options - Mutation options
 * @returns TanStack Mutation result
 */
export function useGhCreateCommitStatus(
  owner: string,
  repo: string,
  ref: string,
  options: UseGhCreateCommitStatusOptions = {}
): UseMutationResult<GitHubCommitStatus, Error, CreateStatusData> {
  const { token } = options;
  const client = useMemo(() => new GitHubClient(token ? { token } : {}), [token]);

  return useMutation<GitHubCommitStatus, Error, CreateStatusData>({
    mutationFn: (data) => client.repo(owner, repo).commit(ref).createStatus(data),
  });
}
