import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { type NpmAuthenticatedUser } from 'npmjs-api-client';
import { npmQueryKeys } from '../keys/npmQueryKeys.js';
import { useNpmClient } from '../NpmClientContext.js';

export interface UseNpmUserOptions {
  /** Disable the query. Also disabled when `username` is empty. */
  enabled?: boolean;
}

/**
 * Fetches the profile of an authenticated npm user.
 *
 * @param username - npm username
 * @param options - Query options
 * @returns TanStack Query result with {@link NpmAuthenticatedUser}
 */
export function useNpmUser(
  username: string,
  options: UseNpmUserOptions = {}
): UseQueryResult<NpmAuthenticatedUser, Error> {
  const { enabled = true } = options;
  const client = useNpmClient();

  return useQuery<NpmAuthenticatedUser, Error>({
    queryKey: npmQueryKeys.user(username),
    queryFn: ({ signal }) => client.user(username).get(signal),
    enabled: enabled && username.length > 0,
  });
}
