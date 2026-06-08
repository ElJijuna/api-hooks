import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { NpmWhoami } from 'npmjs-api-client';
import { npmQueryKeys } from '../keys/npmQueryKeys.js';
import { useNpmClient } from '../NpmClientContext.js';

export interface UseNpmWhoamiOptions {
  /** Disable the query. */
  enabled?: boolean;
}

/**
 * Returns the npm username associated with the configured auth token.
 *
 * Requires a registry auth token — throws with status 401 if no token is set
 * or the token is invalid.
 *
 * @param options - Query options
 * @returns TanStack Query result with {@link NpmWhoami}
 */
export function useNpmWhoami(options: UseNpmWhoamiOptions = {}): UseQueryResult<NpmWhoami, Error> {
  const { enabled = true } = options;
  const client = useNpmClient();

  return useQuery<NpmWhoami, Error>({
    queryKey: npmQueryKeys.whoami(),
    queryFn: ({ signal }) => client.whoami(signal),
    enabled,
  });
}
