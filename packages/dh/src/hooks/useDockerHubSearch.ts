import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type {
  DockerHubPagedResponse,
  DockerHubSearchParams,
  DockerHubSearchResult,
} from 'dockerhub-api-client';
import { useDhClient } from '../DhClientContext.js';
import { dhQueryKeys } from '../keys/dhQueryKeys.js';
import type { QueryOverrides } from '../types.js';

export interface UseDockerHubSearchOptions extends Omit<DockerHubSearchParams, 'query'> {
  /** Disable the query. Also disabled when `query` is empty. */
  enabled?: boolean;
  queryOptions?: QueryOverrides<DockerHubPagedResponse<DockerHubSearchResult>>;
}

/**
 * Searches for repositories on Docker Hub.
 *
 * @param query - Search query string
 * @param options - Optional filters: `page`, `page_size`, `type`
 * @returns TanStack Query result with a paged response of {@link DockerHubSearchResult}
 */
export function useDockerHubSearch(
  query: string,
  options: UseDockerHubSearchOptions = {},
): UseQueryResult<DockerHubPagedResponse<DockerHubSearchResult>, Error> {
  const { enabled = true, queryOptions, ...params } = options;
  const client = useDhClient();

  return useQuery<DockerHubPagedResponse<DockerHubSearchResult>, Error>({
    queryKey: dhQueryKeys.search({ query, ...params }),
    queryFn: ({ signal }) => client.search({ query, ...params }, signal),
    ...queryOptions,
    enabled: enabled && query.length > 0,
  });
}
