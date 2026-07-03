import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { HexPackage, HexPackageSearchParams } from 'hex-api-client';
import { useHexClient } from '../HexClientContext.js';
import { hexQueryKeys } from '../keys/hexQueryKeys.js';
import type { UseHexQueryOptions } from './options.js';

/**
 * Lists or searches Hex.pm packages.
 *
 * @param params - Search/pagination parameters (`search`, `page`, `per_page`)
 * @param options - Query options
 * @returns TanStack Query result with an array of {@link HexPackage}
 */
export function useHexPackages(
  params: HexPackageSearchParams = {},
  options: UseHexQueryOptions = {},
): UseQueryResult<HexPackage[], Error> {
  const { enabled = true, queryOptions } = options;
  const client = useHexClient();

  return useQuery<HexPackage[], Error>({
    queryKey: hexQueryKeys.packages(params),
    queryFn: ({ signal }) => client.packages(params, signal),
    ...queryOptions,
    enabled,
  });
}
