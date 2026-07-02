import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { CrateVersion } from 'crates-api-client';
import { useCratesClient } from '../CratesClientContext.js';
import { cratesQueryKeys } from '../keys/cratesQueryKeys.js';
import type { UseCratesQueryOptions } from './options.js';

/**
 * Fetches all versions published for a crate.
 *
 * @param name - Crate name (e.g. `'serde'`)
 * @param options - Query options
 * @returns TanStack Query result with an array of {@link CrateVersion}
 */
export function useCratesCrateVersions(
  name: string,
  options: UseCratesQueryOptions = {},
): UseQueryResult<CrateVersion[], Error> {
  const { enabled = true, queryOptions } = options;
  const client = useCratesClient();

  return useQuery<CrateVersion[], Error>({
    queryKey: cratesQueryKeys.crateVersions(name),
    queryFn: ({ signal }) => client.crate(name).versions(signal),
    ...queryOptions,
    enabled: enabled && name.length > 0,
  });
}
