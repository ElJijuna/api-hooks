import { useMemo } from 'react';
import { useInfiniteQuery, type UseInfiniteQueryResult, type InfiniteData } from '@tanstack/react-query';
import { GitHubClient, type GitHubAdvisory, type GitHubPagedResponse, type AdvisoriesParams } from 'gh-api-client';
import { ghQueryKeys } from '../keys/ghQueryKeys.js';

export interface UseGhAdvisoriesInfiniteOptions {
  /** Disable the query. */
  enabled?: boolean;
  /** GitHub personal access token. */
  token?: string;
}

/**
 * Infinite-scroll variant of `useGhAdvisories`.
 *
 * @param params - Optional filter params (without `page`)
 * @param options - Query options
 * @returns TanStack Infinite Query result with pages of `GitHubPagedResponse<GitHubAdvisory>`
 */
export function useGhAdvisoriesInfinite(
  params?: Omit<AdvisoriesParams, 'page'>,
  options: UseGhAdvisoriesInfiniteOptions = {}
): UseInfiniteQueryResult<InfiniteData<GitHubPagedResponse<GitHubAdvisory>, number>, Error> {
  const { enabled = true, token } = options;
  const client = useMemo(() => new GitHubClient(token ? { token } : {}), [token]);

  return useInfiniteQuery({
    queryKey: ghQueryKeys.advisoriesInfinite(params),
    queryFn: ({ pageParam, signal }) =>
      client.advisories({ ...params, page: pageParam }, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.nextPage : undefined,
    enabled,
  });
}
