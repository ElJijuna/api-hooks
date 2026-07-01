import {
  type InfiniteData,
  type UseInfiniteQueryResult,
  useInfiniteQuery,
} from '@tanstack/react-query';
import type { GitHubIssueComment, GitHubPagedResponse, PaginationParams } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';
import type { InfiniteQueryOverrides } from '../types.js';

export interface UseGhIssueCommentsInfiniteOptions {
  /** Disable the query. Also disabled when any required param is empty/zero. */
  enabled?: boolean;
  queryOptions?: InfiniteQueryOverrides<GitHubPagedResponse<GitHubIssueComment>>;
}

/**
 * Infinite-scroll variant of `useGhIssueComments`.
 *
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param issueNumber - Issue number
 * @param params - Optional filter params (without `page`)
 * @param options - Query options
 * @returns TanStack Infinite Query result with pages of `GitHubPagedResponse<GitHubIssueComment>`
 */
export function useGhIssueCommentsInfinite(
  owner: string,
  repo: string,
  issueNumber: number,
  params?: Omit<PaginationParams & { since?: string }, 'page'>,
  options: UseGhIssueCommentsInfiniteOptions = {},
): UseInfiniteQueryResult<InfiniteData<GitHubPagedResponse<GitHubIssueComment>, number>, Error> {
  const { enabled = true, queryOptions } = options;

  const client = useGhClient();

  return useInfiniteQuery({
    queryKey: ghQueryKeys.issueCommentsInfinite(owner, repo, issueNumber, params),
    queryFn: ({ pageParam, signal }) =>
      client
        .repo(owner, repo)
        .issue(issueNumber)
        .comments({ ...params, page: pageParam }, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.nextPage : undefined),
    ...queryOptions,
    enabled: enabled && owner.length > 0 && repo.length > 0 && issueNumber > 0,
  });
}
