import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import { useGhClient } from '../GhClientContext.js';
import type { MutationOverrides } from '../types.js';

export interface UseGhMarkAllNotificationsReadOptions {
  mutationOptions?: MutationOverrides<void, void>;
}

/**
 * Marks all notifications as read.
 *
 * Uses `useMutation` — call `mutate()` or `mutateAsync()` to trigger.
 *
 * @returns TanStack Mutation result with `void`
 */
export function useGhMarkAllNotificationsRead(
  options: UseGhMarkAllNotificationsReadOptions = {},
): UseMutationResult<void, Error, void> {
  const { mutationOptions } = options;
  const client = useGhClient();

  return useMutation<void, Error, void>({
    mutationFn: () => client.markAllNotificationsRead(),
    ...mutationOptions,
  });
}
