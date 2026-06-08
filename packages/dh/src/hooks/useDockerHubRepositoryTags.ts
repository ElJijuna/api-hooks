import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type {
  DockerHubPagedResponse,
  DockerHubTag,
  DockerHubTagsParams,
} from 'dockerhub-api-client';
import { useDhClient } from '../DhClientContext.js';
import { dhQueryKeys } from '../keys/dhQueryKeys.js';

export interface UseDockerHubRepositoryTagsOptions extends DockerHubTagsParams {
  /** Disable the query. Also disabled when `namespace` or `name` is empty. */
  enabled?: boolean;
}

/**
 * Lists image tags for a Docker Hub repository.
 *
 * @param namespace - Namespace (username or organization)
 * @param name - Repository name
 * @param options - Optional filters: `page`, `page_size`, `name`, `ordering`
 * @returns TanStack Query result with a paged response of {@link DockerHubTag}
 */
export function useDockerHubRepositoryTags(
  namespace: string,
  name: string,
  options: UseDockerHubRepositoryTagsOptions = {},
): UseQueryResult<DockerHubPagedResponse<DockerHubTag>, Error> {
  const { enabled = true, ...params } = options;
  const client = useDhClient();

  return useQuery<DockerHubPagedResponse<DockerHubTag>, Error>({
    queryKey: dhQueryKeys.repositoryTags(namespace, name, params),
    queryFn: ({ signal }) => client.repository(namespace, name).tags(params, signal),
    enabled: enabled && namespace.length > 0 && name.length > 0,
  });
}
