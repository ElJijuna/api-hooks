import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import { useGhClient } from '../GhClientContext.js';
import type { MutationOverrides } from '../types.js';

export interface UseGhStarGistOptions {
  mutationOptions?: MutationOverrides<void, void>;
}

/**
 * Stars a GitHub Gist for the authenticated user.
 *
 * Uses `useMutation` — call `mutate()` or `mutateAsync()` to trigger the star.
 *
 * @param gistId - Gist ID to star
 * @returns TanStack Mutation result (`void`)
 */
export function useGhStarGist(
  gistId: string,
  options: UseGhStarGistOptions = {},
): UseMutationResult<void, Error, void> {
  const { mutationOptions } = options;
  const client = useGhClient();

  return useMutation<void, Error, void>({
    mutationFn: () => client.gist(gistId).star(),
    ...mutationOptions,
  });
}
