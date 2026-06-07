import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { DockerHubRepository } from 'dockerhub-api-client';
import { useDhClient } from '../DhClientContext.js';
import { dhQueryKeys } from '../keys/dhQueryKeys.js';

export interface UseDockerHubRepositoryOptions {
  /** Disable the query. Also disabled when `namespace` or `name` is empty. */
  enabled?: boolean;
}

/**
 * Fetches metadata for a Docker Hub repository.
 *
 * For official images use `'library'` as namespace (e.g. `'library'`, `'nginx'`).
 *
 * @param namespace - Namespace (username or organization)
 * @param name - Repository name
 * @param options - Query options
 * @returns TanStack Query result with {@link DockerHubRepository}
 */
export function useDockerHubRepository(
  namespace: string,
  name: string,
  options: UseDockerHubRepositoryOptions = {},
): UseQueryResult<DockerHubRepository, Error> {
  const { enabled = true } = options;
  const client = useDhClient();

  return useQuery<DockerHubRepository, Error>({
    queryKey: dhQueryKeys.repository(namespace, name),
    queryFn: ({ signal }) => client.repository(namespace, name).get(signal),
    enabled: enabled && namespace.length > 0 && name.length > 0,
  });
}
