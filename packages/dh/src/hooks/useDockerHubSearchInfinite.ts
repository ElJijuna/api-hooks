import {
  type InfiniteData,
  type UseInfiniteQueryResult,
  useInfiniteQuery,
} from '@tanstack/react-query';
import type {
  DockerHubPagedResponse,
  DockerHubSearchParams,
  DockerHubSearchResult,
} from 'dockerhub-api-client';
import { useDhClient } from '../DhClientContext.js';
import { dhQueryKeys } from '../keys/dhQueryKeys.js';

export interface UseDockerHubSearchInfiniteOptions extends Omit<DockerHubSearchParams, 'query' | 'page'> {
  /** Disable the query. Also disabled when `query` is empty. */
  enabled?: boolean;
}

/**
 * Infinite-scroll variant of `useDockerHubSearch`.
 *
 * Call `fetchNextPage()` to load the next page. Results accumulate in `data.pages`.
 *
 * @param query - Search query string
 * @param options - Optional filters: `page_size`, `type`
 * @returns TanStack Infinite Query result with pages of {@link DockerHubSearchResult}
 */
export function useDockerHubSearchInfinite(
  query: string,
  options: UseDockerHubSearchInfiniteOptions = {},
): UseInfiniteQueryResult<InfiniteData<DockerHubPagedResponse<DockerHubSearchResult>, number>, Error> {
  const { enabled = true, ...params } = options;
  const client = useDhClient();

  return useInfiniteQuery({
    queryKey: dhQueryKeys.searchInfinite({ query, ...params }),
    queryFn: ({ pageParam, signal }) =>
      client.search({ query, ...params, page: pageParam }, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: enabled && query.length > 0,
  });
}
