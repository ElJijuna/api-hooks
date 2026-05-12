import { useMemo } from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { BundlephobiaClient, type BundleSize } from 'bundlephobia-api-client';
import { bpQueryKeys } from '../keys/bpQueryKeys.js';

export interface UseBpPackageSizeOptions {
  /** Disable the query. Also disabled when `name` is empty. */
  enabled?: boolean;
}

/**
 * Fetches the minified + gzipped bundle size for the latest version of a package from Bundlephobia.
 *
 * @param name - Package name (e.g. `'lodash'`)
 * @param options - Query options
 * @returns TanStack Query result with {@link BundleSize}
 */
export function useBpPackageSize(
  name: string,
  options: UseBpPackageSizeOptions = {}
): UseQueryResult<BundleSize, Error> {
  const { enabled = true } = options;
  const client = useMemo(() => new BundlephobiaClient(), []);

  return useQuery<BundleSize, Error>({
    queryKey: bpQueryKeys.packageSize(name),
    queryFn: ({ signal }) => client.package(name).size(undefined, signal),
    enabled: enabled && name.length > 0,
  });
}
