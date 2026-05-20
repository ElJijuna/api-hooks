import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { type GistComment, type GistCommentData } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';

/**
 * Adds a comment to a GitHub Gist.
 *
 * Uses `useMutation` — call `mutate(data)` or `mutateAsync(data)` to post the comment.
 *
 * @param gistId - Gist ID to comment on
 * @returns TanStack Mutation result with the created {@link GistComment}
 */
export function useGhAddGistComment(
  gistId: string
): UseMutationResult<GistComment, Error, GistCommentData> {

  const client = useGhClient();

  return useMutation<GistComment, Error, GistCommentData>({
    mutationFn: (data) => client.gist(gistId).addComment(data),
  });
}
