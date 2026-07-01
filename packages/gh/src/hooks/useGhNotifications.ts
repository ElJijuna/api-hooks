import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { GitHubNotification, GitHubPagedResponse, NotificationsParams } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';
import type { QueryOverrides } from '../types.js';

export interface UseGhNotificationsOptions {
  /** Disable the query. */
  enabled?: boolean;
  queryOptions?: QueryOverrides<GitHubPagedResponse<GitHubNotification>>;
}

/**
 * Fetches notifications for the authenticated user.
 *
 * @param params - Optional filters: `all`, `participating`, `since`, `before`, `per_page`, `page`
 * @param options - Query options
 * @returns TanStack Query result with `GitHubPagedResponse<GitHubNotification>`
 */
export function useGhNotifications(
  params?: NotificationsParams,
  options: UseGhNotificationsOptions = {},
): UseQueryResult<GitHubPagedResponse<GitHubNotification>, Error> {
  const { enabled = true, queryOptions } = options;

  const client = useGhClient();

  return useQuery<GitHubPagedResponse<GitHubNotification>, Error>({
    queryKey: ghQueryKeys.notifications(params),
    queryFn: ({ signal }) => client.notifications(params, signal),
    ...queryOptions,
    enabled,
  });
}
