import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import { useGhClient } from '../GhClientContext.js';
import type { MutationOverrides } from '../types.js';

export interface UseGhDeleteLabelOptions {
  mutationOptions?: MutationOverrides<void, string>;
}

/**
 * Deletes a label from a GitHub repository.
 *
 * Uses `useMutation` — call `mutate(name)` or `mutateAsync(name)` to delete.
 *
 * @param owner - Repository owner (user or org)
 * @param repo - Repository name
 * @returns TanStack Mutation result
 */
export function useGhDeleteLabel(
  owner: string,
  repo: string,
  options: UseGhDeleteLabelOptions = {},
): UseMutationResult<void, Error, string> {
  const { mutationOptions } = options;
  const client = useGhClient();

  return useMutation<void, Error, string>({
    mutationFn: (name) => client.repo(owner, repo).deleteLabel(name),
    ...mutationOptions,
  });
}
