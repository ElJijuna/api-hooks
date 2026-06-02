import {
  type InfiniteData,
  type UseInfiniteQueryResult,
  useInfiniteQuery,
} from '@tanstack/react-query';
import type { GitHubNotification, GitHubPagedResponse, NotificationsParams } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhNotificationsInfiniteOptions {
  /** Disable the query. */
  enabled?: boolean;
}

/**
 * Infinite-scroll variant of `useGhNotifications`.
 *
 * @param params - Optional filter params (without `page`)
 * @param options - Query options
 * @returns TanStack Infinite Query result with pages of `GitHubPagedResponse<GitHubNotification>`
 */
export function useGhNotificationsInfinite(
  params?: Omit<NotificationsParams, 'page'>,
  options: UseGhNotificationsInfiniteOptions = {},
): UseInfiniteQueryResult<InfiniteData<GitHubPagedResponse<GitHubNotification>, number>, Error> {
  const { enabled = true } = options;

  const client = useGhClient();

  return useInfiniteQuery({
    queryKey: ghQueryKeys.notificationsInfinite(params),
    queryFn: ({ pageParam, signal }) =>
      client.notifications({ ...params, page: pageParam }, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.nextPage : undefined),
    enabled,
  });
}
