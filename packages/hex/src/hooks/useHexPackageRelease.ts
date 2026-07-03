import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { HexRelease } from 'hex-api-client';
import { useHexClient } from '../HexClientContext.js';
import { hexQueryKeys } from '../keys/hexQueryKeys.js';
import type { UseHexQueryOptions } from './options.js';

/**
 * Fetches full release metadata for a specific package version.
 *
 * @param name - Hex.pm package name (e.g. `'phoenix'`)
 * @param version - Version string (e.g. `'1.7.10'`)
 * @param options - Query options
 * @returns TanStack Query result with {@link HexRelease}
 */
export function useHexPackageRelease(
  name: string,
  version: string,
  options: UseHexQueryOptions = {},
): UseQueryResult<HexRelease, Error> {
  const { enabled = true, queryOptions } = options;
  const client = useHexClient();

  return useQuery<HexRelease, Error>({
    queryKey: hexQueryKeys.packageRelease(name, version),
    queryFn: ({ signal }) => client.package(name).release(version, signal),
    ...queryOptions,
    enabled: enabled && name.length > 0 && version.length > 0,
  });
}
