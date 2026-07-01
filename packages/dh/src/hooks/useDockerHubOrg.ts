import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { DockerHubOrganization } from 'dockerhub-api-client';
import { useDhClient } from '../DhClientContext.js';
import { dhQueryKeys } from '../keys/dhQueryKeys.js';
import type { QueryOverrides } from '../types.js';

export interface UseDockerHubOrgOptions {
  /** Disable the query. Also disabled when `orgname` is empty. */
  enabled?: boolean;
  queryOptions?: QueryOverrides<DockerHubOrganization>;
}

/**
 * Fetches a Docker Hub organization's profile.
 *
 * @param orgname - Organization name
 * @param options - Query options
 * @returns TanStack Query result with {@link DockerHubOrganization}
 */
export function useDockerHubOrg(
  orgname: string,
  options: UseDockerHubOrgOptions = {},
): UseQueryResult<DockerHubOrganization, Error> {
  const { enabled = true, queryOptions } = options;
  const client = useDhClient();

  return useQuery<DockerHubOrganization, Error>({
    queryKey: dhQueryKeys.org(orgname),
    queryFn: ({ signal }) => client.org(orgname, signal),
    ...queryOptions,
    enabled: enabled && orgname.length > 0,
  });
}
