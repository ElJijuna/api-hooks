import {
  type InfiniteData,
  type UseInfiniteQueryResult,
  useInfiniteQuery,
} from '@tanstack/react-query';
import type { GitHubIssue, GitHubPagedResponse, IssuesParams } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';
import type { InfiniteQueryOverrides } from '../types.js';

export interface UseGhRepoIssuesInfiniteOptions {
  /** Disable the query. Also disabled when `owner` or `repo` is empty. */
  enabled?: boolean;
  queryOptions?: InfiniteQueryOverrides<GitHubPagedResponse<GitHubIssue>>;
}

/**
 * Infinite-scroll variant of `useGhRepoIssues`.
 *
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param params - Optional filter params (without `page`)
 * @param options - Query options
 * @returns TanStack Infinite Query result with pages of `GitHubPagedResponse<GitHubIssue>`
 */
export function useGhRepoIssuesInfinite(
  owner: string,
  repo: string,
  params?: Omit<IssuesParams, 'page'>,
  options: UseGhRepoIssuesInfiniteOptions = {},
): UseInfiniteQueryResult<InfiniteData<GitHubPagedResponse<GitHubIssue>, number>, Error> {
  const { enabled = true, queryOptions } = options;

  const client = useGhClient();

  return useInfiniteQuery({
    queryKey: ghQueryKeys.repoIssuesInfinite(owner, repo, params),
    queryFn: ({ pageParam, signal }) =>
      client.repo(owner, repo).issues({ ...params, page: pageParam }, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.nextPage : undefined),
    ...queryOptions,
    enabled: enabled && owner.length > 0 && repo.length > 0,
  });
}
