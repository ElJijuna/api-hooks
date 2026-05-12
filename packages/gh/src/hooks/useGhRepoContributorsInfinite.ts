import { useMemo } from 'react';
import { useInfiniteQuery, type UseInfiniteQueryResult, type InfiniteData } from '@tanstack/react-query';
import { GitHubClient, type GitHubPagedResponse, type PaginationParams } from 'gh-api-client';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';
import { type GitHubContributor } from './useGhRepoContributors.js';

export interface UseGhRepoContributorsInfiniteOptions {
  /** Disable the query. Also disabled when `owner` or `repo` is empty. */
  enabled?: boolean;
  /** GitHub personal access token — required for private repositories. */
  token?: string;
}

/**
 * Infinite-scroll variant of `useGhRepoContributors`.
 *
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param params - Optional params (without `page`)
 * @param options - Query options
 * @returns TanStack Infinite Query result with pages of `GitHubPagedResponse<GitHubContributor>`
 */
export function useGhRepoContributorsInfinite(
  owner: string,
  repo: string,
  params?: Omit<PaginationParams & { anon?: boolean }, 'page'>,
  options: UseGhRepoContributorsInfiniteOptions = {}
): UseInfiniteQueryResult<InfiniteData<GitHubPagedResponse<GitHubContributor>, number>, Error> {
  const { enabled = true, token } = options;
  const client = useMemo(() => new GitHubClient(token ? { token } : {}), [token]);

  return useInfiniteQuery({
    queryKey: ghQueryKeys.repoContributorsInfinite(owner, repo, params),
    queryFn: ({ pageParam, signal }) =>
      client.repo(owner, repo).contributors({ ...params, page: pageParam }, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.nextPage : undefined,
    enabled: enabled && owner.length > 0 && repo.length > 0,
  });
}
