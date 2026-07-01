import {
  type InfiniteData,
  type UseInfiniteQueryResult,
  useInfiniteQuery,
} from '@tanstack/react-query';
import type { GitHubPagedResponse, GitHubTag, TagsParams } from 'gh-api-client';
import { useGhClient } from '../GhClientContext.js';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';
import type { InfiniteQueryOverrides } from '../types.js';

export interface UseGhRepoTagsInfiniteOptions {
  /** Disable the query. Also disabled when `owner` or `repo` is empty. */
  enabled?: boolean;
  queryOptions?: InfiniteQueryOverrides<GitHubPagedResponse<GitHubTag>>;
}

/**
 * Infinite-scroll variant of `useGhRepoTags`.
 *
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param params - Optional params (without `page`)
 * @param options - Query options
 * @returns TanStack Infinite Query result with pages of `GitHubPagedResponse<GitHubTag>`
 */
export function useGhRepoTagsInfinite(
  owner: string,
  repo: string,
  params?: Omit<TagsParams, 'page'>,
  options: UseGhRepoTagsInfiniteOptions = {},
): UseInfiniteQueryResult<InfiniteData<GitHubPagedResponse<GitHubTag>, number>, Error> {
  const { enabled = true, queryOptions } = options;

  const client = useGhClient();

  return useInfiniteQuery({
    queryKey: ghQueryKeys.repoTagsInfinite(owner, repo, params),
    queryFn: ({ pageParam, signal }) =>
      client.repo(owner, repo).tags({ ...params, page: pageParam }, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.nextPage : undefined),
    ...queryOptions,
    enabled: enabled && owner.length > 0 && repo.length > 0,
  });
}
