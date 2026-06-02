import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import { useGhClient } from '../GhClientContext.js';

/**
 * Marks a single notification thread as read.
 *
 * Uses `useMutation` — call `mutate(threadId)` or `mutateAsync(threadId)` to trigger.
 *
 * @returns TanStack Mutation result with `void`
 */
export function useGhMarkNotificationRead(): UseMutationResult<void, Error, string> {
  const client = useGhClient();

  return useMutation<void, Error, string>({
    mutationFn: (threadId) => client.markNotificationRead(threadId),
  });
}
