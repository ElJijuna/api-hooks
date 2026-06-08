import {
  type InfiniteData,
  type UseInfiniteQueryResult,
  useInfiniteQuery,
} from '@tanstack/react-query';
import type {
  DockerHubPagedResponse,
  DockerHubRepositoriesParams,
  DockerHubRepository,
} from 'dockerhub-api-client';
import { useDhClient } from '../DhClientContext.js';
import { dhQueryKeys } from '../keys/dhQueryKeys.js';

export interface UseDockerHubUserRepositoriesInfiniteOptions
  extends Omit<DockerHubRepositoriesParams, 'page'> {
  /** Disable the query. Also disabled when `username` is empty. */
  enabled?: boolean;
}

/**
 * Infinite-scroll variant of `useDockerHubUserRepositories`.
 *
 * Call `fetchNextPage()` to load the next page. Results accumulate in `data.pages`.
 *
 * @param username - Docker Hub username
 * @param options - Optional filters: `page_size`, `ordering`
 * @returns TanStack Infinite Query result with pages of {@link DockerHubRepository}
 */
export function useDockerHubUserRepositoriesInfinite(
  username: string,
  options: UseDockerHubUserRepositoriesInfiniteOptions = {},
): UseInfiniteQueryResult<
  InfiniteData<DockerHubPagedResponse<DockerHubRepository>, number>,
  Error
> {
  const { enabled = true, ...params } = options;
  const client = useDhClient();

  return useInfiniteQuery({
    queryKey: dhQueryKeys.userRepositoriesInfinite(username, params),
    queryFn: ({ pageParam, signal }) =>
      client.user(username).repositories({ ...params, page: pageParam }, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: enabled && username.length > 0,
  });
}
