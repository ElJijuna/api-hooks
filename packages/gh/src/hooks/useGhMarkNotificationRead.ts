import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import { useGhClient } from '../GhClientContext.js';
import type { MutationOverrides } from '../types.js';

export interface UseGhMarkNotificationReadOptions {
  mutationOptions?: MutationOverrides<void, string>;
}

/**
 * Marks a single notification thread as read.
 *
 * Uses `useMutation` — call `mutate(threadId)` or `mutateAsync(threadId)` to trigger.
 *
 * @returns TanStack Mutation result with `void`
 */
export function useGhMarkNotificationRead(
  options: UseGhMarkNotificationReadOptions = {},
): UseMutationResult<void, Error, string> {
  const { mutationOptions } = options;
  const client = useGhClient();

  return useMutation<void, Error, string>({
    mutationFn: (threadId) => client.markNotificationRead(threadId),
    ...mutationOptions,
  });
}
