import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { NpmUserPackages, NpmUserPackagesParams } from 'npmjs-api-client';
import { npmQueryKeys } from '../keys/npmQueryKeys.js';
import { useNpmClient } from '../NpmClientContext.js';

export interface UseNpmUserPackagesOptions {
  /** Disable the query. Also disabled when `username` is empty. */
  enabled?: boolean;
}

/**
 * Fetches the list of packages published by an npm user.
 *
 * @param username - npm username
 * @param params - Optional pagination/filter params
 * @param options - Query options
 * @returns TanStack Query result with {@link NpmUserPackages} (`string[]`)
 */
export function useNpmUserPackages(
  username: string,
  params?: NpmUserPackagesParams,
  options: UseNpmUserPackagesOptions = {},
): UseQueryResult<NpmUserPackages, Error> {
  const { enabled = true } = options;
  const client = useNpmClient();

  return useQuery<NpmUserPackages, Error>({
    queryKey: npmQueryKeys.userPackages(username, params),
    queryFn: ({ signal }) => client.user(username).packages(params, signal),
    enabled: enabled && username.length > 0,
  });
}
