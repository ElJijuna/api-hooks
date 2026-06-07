import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { DockerHubUser } from 'dockerhub-api-client';
import { useDhClient } from '../DhClientContext.js';
import { dhQueryKeys } from '../keys/dhQueryKeys.js';

export interface UseDockerHubUserOptions {
  /** Disable the query. Also disabled when `username` is empty. */
  enabled?: boolean;
}

/**
 * Fetches a Docker Hub user's public profile.
 *
 * @param username - Docker Hub username
 * @param options - Query options
 * @returns TanStack Query result with {@link DockerHubUser}
 */
export function useDockerHubUser(
  username: string,
  options: UseDockerHubUserOptions = {},
): UseQueryResult<DockerHubUser, Error> {
  const { enabled = true } = options;
  const client = useDhClient();

  return useQuery<DockerHubUser, Error>({
    queryKey: dhQueryKeys.user(username),
    queryFn: ({ signal }) => client.user(username).get(signal),
    enabled: enabled && username.length > 0,
  });
}
