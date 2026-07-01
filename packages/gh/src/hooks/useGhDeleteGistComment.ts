import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import { useGhClient } from '../GhClientContext.js';
import type { MutationOverrides } from '../types.js';

export interface DeleteGistCommentVariables {
  commentId: number;
}

export interface UseGhDeleteGistCommentOptions {
  mutationOptions?: MutationOverrides<void, DeleteGistCommentVariables>;
}

/**
 * Deletes a comment on a GitHub Gist.
 *
 * Uses `useMutation` — call `mutate({ commentId })` to trigger the deletion.
 *
 * @param gistId - Gist ID containing the comment
 * @returns TanStack Mutation result (`void`)
 */
export function useGhDeleteGistComment(
  gistId: string,
  options: UseGhDeleteGistCommentOptions = {},
): UseMutationResult<void, Error, DeleteGistCommentVariables> {
  const { mutationOptions } = options;
  const client = useGhClient();

  return useMutation<void, Error, DeleteGistCommentVariables>({
    mutationFn: ({ commentId }) => client.gist(gistId).deleteComment(commentId),
    ...mutationOptions,
  });
}
