import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { NpmUser } from 'npmjs-api-client';
import { npmQueryKeys } from '../keys/npmQueryKeys.js';
import { useNpmClient } from '../NpmClientContext.js';
import type { QueryOverrides } from '../types.js';

export interface UseNpmMaintainerOptions {
  /** Disable the query. Also disabled when `username` is empty. */
  enabled?: boolean;
  queryOptions?: QueryOverrides<NpmUser>;
}

/**
 * Fetches the public profile of an npm user.
 *
 * @param username - npm username (e.g. `'sindresorhus'`)
 * @param options - Query options
 * @returns TanStack Query result with {@link NpmUser}
 */
export function useNpmMaintainer(
  username: string,
  options: UseNpmMaintainerOptions = {},
): UseQueryResult<NpmUser, Error> {
  const { enabled = true, queryOptions } = options;
  const client = useNpmClient();

  return useQuery<NpmUser, Error>({
    queryKey: npmQueryKeys.maintainer(username),
    queryFn: ({ signal }) => client.maintainer(username).info(signal),
    ...queryOptions,
    enabled: enabled && username.length > 0,
  });
}
