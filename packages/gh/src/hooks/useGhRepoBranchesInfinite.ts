import {
  type InfiniteData,
  type UseInfiniteQueryResult,
  useInfiniteQuery,
} from '@tanstack/react-query';
import type { BranchesParams, GitHubBranch, GitHubPagedResponse } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';
import type { InfiniteQueryOverrides } from '../types.js';

export interface UseGhRepoBranchesInfiniteOptions {
  /** Disable the query. Also disabled when `owner` or `repo` is empty. */
  enabled?: boolean;
  queryOptions?: InfiniteQueryOverrides<GitHubPagedResponse<GitHubBranch>>;
}

/**
 * Infinite-scroll variant of `useGhRepoBranches`.
 *
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param params - Optional filter params (without `page`)
 * @param options - Query options
 * @returns TanStack Infinite Query result with pages of `GitHubPagedResponse<GitHubBranch>`
 */
export function useGhRepoBranchesInfinite(
  owner: string,
  repo: string,
  params?: Omit<BranchesParams, 'page'>,
  options: UseGhRepoBranchesInfiniteOptions = {},
): UseInfiniteQueryResult<InfiniteData<GitHubPagedResponse<GitHubBranch>, number>, Error> {
  const { enabled = true, queryOptions } = options;

  const client = useGhClient();

  return useInfiniteQuery({
    queryKey: ghQueryKeys.repoBranchesInfinite(owner, repo, params),
    queryFn: ({ pageParam, signal }) =>
      client.repo(owner, repo).branches({ ...params, page: pageParam }, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.nextPage : undefined),
    ...queryOptions,
    enabled: enabled && owner.length > 0 && repo.length > 0,
  });
}
