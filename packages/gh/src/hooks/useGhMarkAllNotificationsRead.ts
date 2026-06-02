import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import { useGhClient } from '../GhClientContext.js';

/**
 * Marks all notifications as read.
 *
 * Uses `useMutation` — call `mutate()` or `mutateAsync()` to trigger.
 *
 * @returns TanStack Mutation result with `void`
 */
export function useGhMarkAllNotificationsRead(): UseMutationResult<void, Error, void> {
  const client = useGhClient();

  return useMutation<void, Error, void>({
    mutationFn: () => client.markAllNotificationsRead(),
  });
}
