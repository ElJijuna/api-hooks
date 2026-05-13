import { useMemo } from 'react';
import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { GitHubClient, CommitResource } from 'gh-api-client';

type GitHubCommitComment = Awaited<ReturnType<CommitResource['addComment']>>;
type CommitCommentData = Parameters<CommitResource['addComment']>[0];

export interface UseGhAddCommitCommentOptions {
  /** GitHub personal access token — required for private repositories. */
  token?: string;
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
  options: UseGhAddCommitCommentOptions = {}
): UseMutationResult<GitHubCommitComment, Error, CommitCommentData> {
  const { token } = options;
  const client = useMemo(() => new GitHubClient(token ? { token } : {}), [token]);

  return useMutation<GitHubCommitComment, Error, CommitCommentData>({
    mutationFn: (data) => client.repo(owner, repo).commit(ref).addComment(data),
  });
}
