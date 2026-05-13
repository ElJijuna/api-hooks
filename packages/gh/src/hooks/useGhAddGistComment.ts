import { useMemo } from 'react';
import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { GitHubClient, type GistComment, type GistCommentData } from 'gh-api-client';

export interface UseGhAddGistCommentOptions {
  /** GitHub personal access token — required to comment on gists. */
  token?: string;
}

/**
 * Adds a comment to a GitHub Gist.
 *
 * Uses `useMutation` — call `mutate(data)` or `mutateAsync(data)` to post the comment.
 *
 * @param gistId - Gist ID to comment on
 * @param options - Options including the required `token`
 * @returns TanStack Mutation result with the created {@link GistComment}
 */
export function useGhAddGistComment(
  gistId: string,
  options: UseGhAddGistCommentOptions = {}
): UseMutationResult<GistComment, Error, GistCommentData> {
  const { token } = options;
  const client = useMemo(() => new GitHubClient(token ? { token } : {}), [token]);

  return useMutation<GistComment, Error, GistCommentData>({
    mutationFn: (data) => client.gist(gistId).addComment(data),
  });
}
