import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { HexPackage } from 'hex-api-client';
import { useHexClient } from '../HexClientContext.js';
import { hexQueryKeys } from '../keys/hexQueryKeys.js';
import type { UseHexQueryOptions } from './options.js';

/**
 * Fetches full package metadata from Hex.pm.
 *
 * @param name - Hex.pm package name (e.g. `'phoenix'`)
 * @param options - Query options
 * @returns TanStack Query result with {@link HexPackage}
 */
export function useHexPackage(
  name: string,
  options: UseHexQueryOptions = {},
): UseQueryResult<HexPackage, Error> {
  const { enabled = true, queryOptions } = options;
  const client = useHexClient();

  return useQuery<HexPackage, Error>({
    queryKey: hexQueryKeys.package(name),
    queryFn: ({ signal }) => client.package(name).get(signal),
    ...queryOptions,
    enabled: enabled && name.length > 0,
  });
}
