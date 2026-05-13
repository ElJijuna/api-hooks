import { useMemo } from 'react';
import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { GitHubClient } from 'gh-api-client';

export interface UseGhDeleteGistCommentOptions {
  /** GitHub personal access token — required to delete gist comments. */
  token?: string;
}

export interface DeleteGistCommentVariables {
  commentId: number;
}

/**
 * Deletes a comment on a GitHub Gist.
 *
 * Uses `useMutation` — call `mutate({ commentId })` to trigger the deletion.
 *
 * @param gistId - Gist ID containing the comment
 * @param options - Options including the required `token`
 * @returns TanStack Mutation result (`void`)
 */
export function useGhDeleteGistComment(
  gistId: string,
  options: UseGhDeleteGistCommentOptions = {}
): UseMutationResult<void, Error, DeleteGistCommentVariables> {
  const { token } = options;
  const client = useMemo(() => new GitHubClient(token ? { token } : {}), [token]);

  return useMutation<void, Error, DeleteGistCommentVariables>({
    mutationFn: ({ commentId }) => client.gist(gistId).deleteComment(commentId),
  });
}
