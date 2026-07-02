import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { CrateVersion } from 'crates-api-client';
import { useCratesClient } from '../CratesClientContext.js';
import { cratesQueryKeys } from '../keys/cratesQueryKeys.js';
import type { UseCratesQueryOptions } from './options.js';

/**
 * Fetches version metadata matching the crate's `max_version` (the latest non-yanked version).
 *
 * @param name - Crate name (e.g. `'serde'`)
 * @param options - Query options
 * @returns TanStack Query result with {@link CrateVersion}
 */
export function useCratesCrateLatest(
  name: string,
  options: UseCratesQueryOptions = {},
): UseQueryResult<CrateVersion, Error> {
  const { enabled = true, queryOptions } = options;
  const client = useCratesClient();

  return useQuery<CrateVersion, Error>({
    queryKey: cratesQueryKeys.crateLatest(name),
    queryFn: ({ signal }) => client.crate(name).latest(signal),
    ...queryOptions,
    enabled: enabled && name.length > 0,
  });
}
