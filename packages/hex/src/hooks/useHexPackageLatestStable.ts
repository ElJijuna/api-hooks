import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { useHexClient } from '../HexClientContext.js';
import { hexQueryKeys } from '../keys/hexQueryKeys.js';
import type { UseHexQueryOptions } from './options.js';

/**
 * Fetches the `latest_stable_version` string for a Hex.pm package.
 *
 * @param name - Hex.pm package name (e.g. `'phoenix'`)
 * @param options - Query options
 * @returns TanStack Query result with the latest stable version string, or `null`
 */
export function useHexPackageLatestStable(
  name: string,
  options: UseHexQueryOptions = {},
): UseQueryResult<string | null, Error> {
  const { enabled = true, queryOptions } = options;
  const client = useHexClient();

  return useQuery<string | null, Error>({
    queryKey: hexQueryKeys.packageLatestStable(name),
    queryFn: ({ signal }) => client.package(name).latestStable(signal),
    ...queryOptions,
    enabled: enabled && name.length > 0,
  });
}
