import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { NpmOrgPackages } from 'npmjs-api-client';
import { npmQueryKeys } from '../keys/npmQueryKeys.js';
import { useNpmClient } from '../NpmClientContext.js';

export interface UseNpmOrgPackagesOptions {
  /** Disable the query. Also disabled when `org` is empty. */
  enabled?: boolean;
}

/**
 * Returns all packages an org has access to, keyed by package name.
 *
 * Requires a registry token with org access passed to `NpmClientProvider`.
 *
 * @param org - Org name (e.g. `'npmcli'`)
 * @param options - Query options
 * @returns TanStack Query result with {@link NpmOrgPackages}
 */
export function useNpmOrgPackages(
  org: string,
  options: UseNpmOrgPackagesOptions = {},
): UseQueryResult<NpmOrgPackages, Error> {
  const { enabled = true } = options;
  const client = useNpmClient();

  return useQuery<NpmOrgPackages, Error>({
    queryKey: npmQueryKeys.orgPackages(org),
    queryFn: ({ signal }) => client.org(org).packages(signal),
    enabled: enabled && org.length > 0,
  });
}
