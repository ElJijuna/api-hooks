import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { MaintainerPackagesParams, NpmSearchResult } from 'npmjs-api-client';
import { npmQueryKeys } from '../keys/npmQueryKeys.js';
import { useNpmClient } from '../NpmClientContext.js';

export interface UseNpmMaintainerPackagesOptions extends MaintainerPackagesParams {
  /** Disable the query. Also disabled when `username` is empty. */
  enabled?: boolean;
}

/**
 * Searches for all packages published by a user, with pagination support.
 *
 * @param username - npm username (e.g. `'sindresorhus'`)
 * @param options - Pagination and scoring weights (`size`, `from`, `quality`, `popularity`, `maintenance`)
 * @returns TanStack Query result with {@link NpmSearchResult}
 */
export function useNpmMaintainerPackages(
  username: string,
  options: UseNpmMaintainerPackagesOptions = {},
): UseQueryResult<NpmSearchResult, Error> {
  const { enabled = true, ...params } = options;
  const client = useNpmClient();

  const queryParams = Object.keys(params).length > 0 ? params : undefined;

  return useQuery<NpmSearchResult, Error>({
    queryKey: npmQueryKeys.maintainerPackages(username, queryParams),
    queryFn: ({ signal }) => client.maintainer(username).packages(queryParams, signal),
    enabled: enabled && username.length > 0,
  });
}
