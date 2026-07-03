import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { useHexClient } from '../HexClientContext.js';
import { hexQueryKeys } from '../keys/hexQueryKeys.js';
import type { UseHexQueryOptions } from './options.js';

/**
 * Fetches all published version strings of a Hex.pm package.
 *
 * @param name - Hex.pm package name (e.g. `'phoenix'`)
 * @param options - Query options
 * @returns TanStack Query result with an array of version strings
 */
export function useHexPackageVersions(
  name: string,
  options: UseHexQueryOptions = {},
): UseQueryResult<string[], Error> {
  const { enabled = true, queryOptions } = options;
  const client = useHexClient();

  return useQuery<string[], Error>({
    queryKey: hexQueryKeys.packageVersions(name),
    queryFn: ({ signal }) => client.package(name).versions(signal),
    ...queryOptions,
    enabled: enabled && name.length > 0,
  });
}
