import { useInfiniteQuery, type UseInfiniteQueryResult, type InfiniteData } from '@tanstack/react-query';
import { type GitHubIssue, type GitHubPagedResponse, type IssuesParams } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhIssuesInfiniteOptions {
  /** Disable the query. */
  enabled?: boolean;
}

/**
 * Infinite-scroll variant of `useGhIssues`.
 *
 * Fetches issues assigned to the authenticated user across all repositories.
 *
 * @param params - Optional filter params (without `page`)
 * @param options - Query options
 * @returns TanStack Infinite Query result with pages of `GitHubPagedResponse<GitHubIssue>`
 */
export function useGhIssuesInfinite(
  params?: Omit<IssuesParams, 'page'>,
  options: UseGhIssuesInfiniteOptions = {}
): UseInfiniteQueryResult<InfiniteData<GitHubPagedResponse<GitHubIssue>, number>, Error> {
  const { enabled = true } = options;

  const client = useGhClient();

  return useInfiniteQuery({
    queryKey: ghQueryKeys.issuesInfinite(params),
    queryFn: ({ pageParam, signal }) =>
      client.issues({ ...params, page: pageParam }, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.nextPage : undefined,
    enabled,
  });
}
