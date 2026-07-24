import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { PackageHistory } from 'bundlephobia-api-client';
import { useBpClient } from '../BpClientContext.js';
import { bpQueryKeys } from '../keys/bpQueryKeys.js';
import type { QueryOverrides } from '../types.js';

export interface UseBpPackageHistoryOptions {
  /** Disable the query. Also disabled when `name` is empty. */
  enabled?: boolean;
  queryOptions?: QueryOverrides<PackageHistory>;
}

/**
 * Fetches the bundle size history across all published versions of a package from Bundlephobia.
 *
 * Useful for rendering a size-over-time chart.
 *
 * @param name - Package name (e.g. `'lodash'`)
 * @param options - Query options
 * @returns TanStack Query result with {@link PackageHistory}
 */
export function useBpPackageHistory(
  name: string,
  options: UseBpPackageHistoryOptions = {},
): UseQueryResult<PackageHistory, Error> {
  const { enabled = true, queryOptions } = options;
  const client = useBpClient();

  return useQuery<PackageHistory, Error>({
    queryKey: bpQueryKeys.packageHistory(name),
    queryFn: ({ signal }) => client.package(name).history(signal),
    ...queryOptions,
    enabled: enabled && name.length > 0,
  });
}
