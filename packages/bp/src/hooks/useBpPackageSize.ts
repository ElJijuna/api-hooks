import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { BundlephobiaClient, type BundleSize } from 'bundlephobia-api-client';
import { useMemo } from 'react';
import { bpQueryKeys } from '../keys/bpQueryKeys.js';
import type { QueryOverrides } from '../types.js';

export interface UseBpPackageSizeOptions {
  /** Disable the query. Also disabled when `name` is empty. */
  enabled?: boolean;
  queryOptions?: QueryOverrides<BundleSize>;
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
  options: UseBpPackageSizeOptions = {},
): UseQueryResult<BundleSize, Error> {
  const { enabled = true, queryOptions } = options;
  const client = useMemo(() => new BundlephobiaClient(), []);

  return useQuery<BundleSize, Error>({
    queryKey: bpQueryKeys.packageSize(name),
    queryFn: ({ signal }) => client.package(name).size(undefined, signal),
    ...queryOptions,
    enabled: enabled && name.length > 0,
  });
}
