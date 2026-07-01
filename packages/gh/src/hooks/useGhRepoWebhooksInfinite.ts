import {
  type InfiniteData,
  type UseInfiniteQueryResult,
  useInfiniteQuery,
} from '@tanstack/react-query';
import type { GitHubPagedResponse, GitHubWebhook, WebhooksParams } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';
import type { InfiniteQueryOverrides } from '../types.js';

export interface UseGhRepoWebhooksInfiniteOptions {
  /** Disable the query. */
  enabled?: boolean;
  queryOptions?: InfiniteQueryOverrides<GitHubPagedResponse<GitHubWebhook>>;
}

/**
 * Infinite-scroll variant of `useGhRepoWebhooks`.
 *
 * @param owner - Repository owner (user or org)
 * @param repo - Repository name
 * @param params - Optional params (`WebhooksParams` without `page`)
 * @param options - Query options including the required `token`
 * @returns TanStack Infinite Query result with pages of `GitHubPagedResponse<GitHubWebhook>`
 */
export function useGhRepoWebhooksInfinite(
  owner: string,
  repo: string,
  params?: Omit<WebhooksParams, 'page'>,
  options: UseGhRepoWebhooksInfiniteOptions = {},
): UseInfiniteQueryResult<InfiniteData<GitHubPagedResponse<GitHubWebhook>, number>, Error> {
  const { enabled = true, queryOptions } = options;

  const client = useGhClient();

  return useInfiniteQuery({
    queryKey: ghQueryKeys.repoWebhooksInfinite(owner, repo, params),
    queryFn: ({ pageParam, signal }) =>
      client.repo(owner, repo).webhooks({ ...params, page: pageParam }, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.nextPage : undefined),
    ...queryOptions,
    enabled: enabled && owner.length > 0 && repo.length > 0,
  });
}
