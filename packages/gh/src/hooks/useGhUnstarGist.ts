import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import { useGhClient } from '../GhClientContext.js';

/**
 * Unstars a GitHub Gist for the authenticated user.
 *
 * Uses `useMutation` — call `mutate()` or `mutateAsync()` to trigger the unstar.
 *
 * @param gistId - Gist ID to unstar
 * @returns TanStack Mutation result (`void`)
 */
export function useGhUnstarGist(gistId: string): UseMutationResult<void, Error, void> {
  const client = useGhClient();

  return useMutation<void, Error, void>({
    mutationFn: () => client.gist(gistId).unstar(),
  });
}
