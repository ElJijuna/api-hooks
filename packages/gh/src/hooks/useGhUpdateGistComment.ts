import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import type { GistComment, GistCommentData } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';

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
 * @returns TanStack Mutation result with the updated {@link GistComment}
 */
export function useGhUpdateGistComment(
  gistId: string,
): UseMutationResult<GistComment, Error, UpdateGistCommentVariables> {
  const client = useGhClient();

  return useMutation<GistComment, Error, UpdateGistCommentVariables>({
    mutationFn: ({ commentId, data }) => client.gist(gistId).updateComment(commentId, data),
  });
}
