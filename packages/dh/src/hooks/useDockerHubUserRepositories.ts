import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type {
  DockerHubPagedResponse,
  DockerHubRepositoriesParams,
  DockerHubRepository,
} from 'dockerhub-api-client';
import { useDhClient } from '../DhClientContext.js';
import { dhQueryKeys } from '../keys/dhQueryKeys.js';
import type { QueryOverrides } from '../types.js';

export interface UseDockerHubUserRepositoriesOptions extends DockerHubRepositoriesParams {
  /** Disable the query. Also disabled when `username` is empty. */
  enabled?: boolean;
  queryOptions?: QueryOverrides<DockerHubPagedResponse<DockerHubRepository>>;
}

/**
 * Lists public repositories owned by a Docker Hub user.
 *
 * @param username - Docker Hub username
 * @param options - Optional filters: `page`, `page_size`, `ordering`
 * @returns TanStack Query result with a paged response of {@link DockerHubRepository}
 */
export function useDockerHubUserRepositories(
  username: string,
  options: UseDockerHubUserRepositoriesOptions = {},
): UseQueryResult<DockerHubPagedResponse<DockerHubRepository>, Error> {
  const { enabled = true, queryOptions, ...params } = options;
  const client = useDhClient();

  return useQuery<DockerHubPagedResponse<DockerHubRepository>, Error>({
    queryKey: dhQueryKeys.userRepositories(username, params),
    queryFn: ({ signal }) => client.user(username).repositories(params, signal),
    ...queryOptions,
    enabled: enabled && username.length > 0,
  });
}
