import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { CommitResource } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';

type GitHubCommitComment = Awaited<ReturnType<CommitResource['addComment']>>;
type CommitCommentData = Parameters<CommitResource['addComment']>[0];

/**
 * Adds a comment to a specific commit.
 *
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param ref - Commit SHA
 * @param options - Mutation options
 * @returns TanStack Mutation result
 */
export function useGhAddCommitComment(
  owner: string,
  repo: string,
  ref: string
): UseMutationResult<GitHubCommitComment, Error, CommitCommentData> {

  const client = useGhClient();

  return useMutation<GitHubCommitComment, Error, CommitCommentData>({
    mutationFn: (data) => client.repo(owner, repo).commit(ref).addComment(data),
  });
}
