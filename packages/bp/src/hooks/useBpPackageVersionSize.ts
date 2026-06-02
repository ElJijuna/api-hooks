import { useMemo } from 'react';
import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { BundlephobiaClient, type BundleSize } from 'bundlephobia-api-client';
import { bpQueryKeys } from '../keys/bpQueryKeys.js';

export interface UseBpPackageVersionSizeOptions {
  /** Disable the query. Also disabled when `name` or `version` is empty. */
  enabled?: boolean;
}

/**
 * Fetches the minified + gzipped bundle size for a specific package version from Bundlephobia.
 *
 * @param name - Package name (e.g. `'lodash'`)
 * @param version - Exact version string (e.g. `'4.17.21'`)
 * @param options - Query options
 * @returns TanStack Query result with {@link BundleSize}
 */
export function useBpPackageVersionSize(
  name: string,
  version: string,
  options: UseBpPackageVersionSizeOptions = {},
): UseQueryResult<BundleSize, Error> {
  const { enabled = true } = options;
  const client = useMemo(() => new BundlephobiaClient(), []);

  return useQuery<BundleSize, Error>({
    queryKey: bpQueryKeys.packageVersionSize(name, version),
    queryFn: ({ signal }) => client.package(name).size(version, signal),
    enabled: enabled && name.length > 0 && version.length > 0,
  });
}
