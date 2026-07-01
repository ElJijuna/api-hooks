import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import type { CommitResource } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import type { MutationOverrides } from '../types.js';

type GitHubCommitComment = Awaited<ReturnType<CommitResource['addComment']>>;
type CommitCommentData = Parameters<CommitResource['addComment']>[0];

export interface UseGhAddCommitCommentOptions {
  mutationOptions?: MutationOverrides<GitHubCommitComment, CommitCommentData>;
}

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
  ref: string,
  options: UseGhAddCommitCommentOptions = {},
): UseMutationResult<GitHubCommitComment, Error, CommitCommentData> {
  const { mutationOptions } = options;
  const client = useGhClient();

  return useMutation<GitHubCommitComment, Error, CommitCommentData>({
    mutationFn: (data) => client.repo(owner, repo).commit(ref).addComment(data),
    ...mutationOptions,
  });
}
