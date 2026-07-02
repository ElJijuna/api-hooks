import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { CrateVersion } from 'crates-api-client';
import { useCratesClient } from '../CratesClientContext.js';
import { cratesQueryKeys } from '../keys/cratesQueryKeys.js';
import type { UseCratesQueryOptions } from './options.js';

/**
 * Fetches metadata for a specific published version of a crate.
 *
 * @param name - Crate name (e.g. `'serde'`)
 * @param version - Semver version string (e.g. `'1.0.210'`)
 * @param options - Query options
 * @returns TanStack Query result with {@link CrateVersion}
 */
export function useCratesCrateVersion(
  name: string,
  version: string,
  options: UseCratesQueryOptions = {},
): UseQueryResult<CrateVersion, Error> {
  const { enabled = true, queryOptions } = options;
  const client = useCratesClient();

  return useQuery<CrateVersion, Error>({
    queryKey: cratesQueryKeys.crateVersion(name, version),
    queryFn: ({ signal }) => client.crate(name).version(version, signal),
    ...queryOptions,
    enabled: enabled && name.length > 0 && version.length > 0,
  });
}
