import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { useGhClient } from '../GhClientContext.js';

/**
 * Deletes a GitHub Gist.
 *
 * Uses `useMutation` — call `mutate()` or `mutateAsync()` to trigger the deletion.
 *
 * @param gistId - Gist ID to delete
 * @returns TanStack Mutation result (`void`)
 */
export function useGhDeleteGist(
  gistId: string
): UseMutationResult<void, Error, void> {

  const client = useGhClient();

  return useMutation<void, Error, void>({
    mutationFn: () => client.gist(gistId).delete(),
  });
}
