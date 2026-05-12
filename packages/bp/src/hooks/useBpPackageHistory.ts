import { useMemo } from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { BundlephobiaClient, type PackageHistory } from 'bundlephobia-api-client';
import { bpQueryKeys } from '../keys/bpQueryKeys.js';

export interface UseBpPackageHistoryOptions {
  /** Disable the query. Also disabled when `name` is empty. */
  enabled?: boolean;
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
  options: UseBpPackageHistoryOptions = {}
): UseQueryResult<PackageHistory, Error> {
  const { enabled = true } = options;
  const client = useMemo(() => new BundlephobiaClient(), []);

  return useQuery<PackageHistory, Error>({
    queryKey: bpQueryKeys.packageHistory(name),
    queryFn: ({ signal }) => client.package(name).history(signal),
    enabled: enabled && name.length > 0,
  });
}
