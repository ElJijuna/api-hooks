import {
  type InfiniteData,
  type UseInfiniteQueryResult,
  useInfiniteQuery,
} from '@tanstack/react-query';
import type {
  DockerHubPagedResponse,
  DockerHubTag,
  DockerHubTagsParams,
} from 'dockerhub-api-client';
import { useDhClient } from '../DhClientContext.js';
import { dhQueryKeys } from '../keys/dhQueryKeys.js';

export interface UseDockerHubRepositoryTagsInfiniteOptions
  extends Omit<DockerHubTagsParams, 'page'> {
  /** Disable the query. Also disabled when `namespace` or `name` is empty. */
  enabled?: boolean;
}

/**
 * Infinite-scroll variant of `useDockerHubRepositoryTags`.
 *
 * Call `fetchNextPage()` to load the next page. Results accumulate in `data.pages`.
 *
 * @param namespace - Namespace (username or organization)
 * @param name - Repository name
 * @param options - Optional filters: `page_size`, `name`, `ordering`
 * @returns TanStack Infinite Query result with pages of {@link DockerHubTag}
 */
export function useDockerHubRepositoryTagsInfinite(
  namespace: string,
  name: string,
  options: UseDockerHubRepositoryTagsInfiniteOptions = {},
): UseInfiniteQueryResult<InfiniteData<DockerHubPagedResponse<DockerHubTag>, number>, Error> {
  const { enabled = true, ...params } = options;
  const client = useDhClient();

  return useInfiniteQuery({
    queryKey: dhQueryKeys.repositoryTagsInfinite(namespace, name, params),
    queryFn: ({ pageParam, signal }) =>
      client.repository(namespace, name).tags({ ...params, page: pageParam }, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: enabled && namespace.length > 0 && name.length > 0,
  });
}
