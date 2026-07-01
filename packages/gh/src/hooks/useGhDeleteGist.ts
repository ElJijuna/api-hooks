import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import { useGhClient } from '../GhClientContext.js';
import type { MutationOverrides } from '../types.js';

export interface UseGhDeleteGistOptions {
  mutationOptions?: MutationOverrides<void, void>;
}

/**
 * Deletes a GitHub Gist.
 *
 * Uses `useMutation` — call `mutate()` or `mutateAsync()` to trigger the deletion.
 *
 * @param gistId - Gist ID to delete
 * @returns TanStack Mutation result (`void`)
 */
export function useGhDeleteGist(
  gistId: string,
  options: UseGhDeleteGistOptions = {},
): UseMutationResult<void, Error, void> {
  const { mutationOptions } = options;
  const client = useGhClient();

  return useMutation<void, Error, void>({
    mutationFn: () => client.gist(gistId).delete(),
    ...mutationOptions,
  });
}
