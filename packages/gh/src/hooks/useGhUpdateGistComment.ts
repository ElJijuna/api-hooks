import { useMemo } from 'react';
import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { GitHubClient, type GistComment, type GistCommentData } from 'gh-api-client';

export interface UseGhUpdateGistCommentOptions {
  /** GitHub personal access token — required to update gist comments. */
  token?: string;
}

export interface UpdateGistCommentVariables {
  commentId: number;
  data: GistCommentData;
}

/**
 * Updates a comment on a GitHub Gist.
 *
 * Uses `useMutation` — call `mutate({ commentId, data })` to trigger the update.
 *
 * @param gistId - Gist ID containing the comment
 * @param options - Options including the required `token`
 * @returns TanStack Mutation result with the updated {@link GistComment}
 */
export function useGhUpdateGistComment(
  gistId: string,
  options: UseGhUpdateGistCommentOptions = {}
): UseMutationResult<GistComment, Error, UpdateGistCommentVariables> {
  const { token } = options;
  const client = useMemo(() => new GitHubClient(token ? { token } : {}), [token]);

  return useMutation<GistComment, Error, UpdateGistCommentVariables>({
    mutationFn: ({ commentId, data }) => client.gist(gistId).updateComment(commentId, data),
  });
}
