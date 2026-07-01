import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import type { GistComment, GistCommentData } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import type { MutationOverrides } from '../types.js';

export interface UseGhAddGistCommentOptions {
  mutationOptions?: MutationOverrides<GistComment, GistCommentData>;
}

/**
 * Adds a comment to a GitHub Gist.
 *
 * Uses `useMutation` — call `mutate(data)` or `mutateAsync(data)` to post the comment.
 *
 * @param gistId - Gist ID to comment on
 * @returns TanStack Mutation result with the created {@link GistComment}
 */
export function useGhAddGistComment(
  gistId: string,
  options: UseGhAddGistCommentOptions = {},
): UseMutationResult<GistComment, Error, GistCommentData> {
  const { mutationOptions } = options;
  const client = useGhClient();

  return useMutation<GistComment, Error, GistCommentData>({
    mutationFn: (data) => client.gist(gistId).addComment(data),
    ...mutationOptions,
  });
}
