
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { type NpmUser } from 'npmjs-api-client';
import { npmQueryKeys } from '../keys/npmQueryKeys.js';
import { useNpmClient } from '../NpmClientContext.js';

export interface UseNpmMaintainerOptions {
  /** Disable the query. Also disabled when `username` is empty. */
  enabled?: boolean;
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
  options: UseNpmMaintainerOptions = {}
): UseQueryResult<NpmUser, Error> {
  const { enabled = true } = options;
  const client = useNpmClient();

  return useQuery<NpmUser, Error>({
    queryKey: npmQueryKeys.maintainer(username),
    queryFn: ({ signal }) => client.maintainer(username).info(signal),
    enabled: enabled && username.length > 0,
  });
}
