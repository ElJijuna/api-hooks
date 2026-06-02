import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import type { CommitResource, GitHubCommitStatus } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';

type CreateStatusData = Parameters<CommitResource['createStatus']>[0];

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
): UseMutationResult<GitHubCommitStatus, Error, CreateStatusData> {
  const client = useGhClient();

  return useMutation<GitHubCommitStatus, Error, CreateStatusData>({
    mutationFn: (data) => client.repo(owner, repo).commit(ref).createStatus(data),
  });
}
