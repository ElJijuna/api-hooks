import { useMemo } from 'react';
import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { BundlephobiaClient, type SimilarPackages } from 'bundlephobia-api-client';
import { bpQueryKeys } from '../keys/bpQueryKeys.js';

export interface UseBpPackageSimilarOptions {
  /** Disable the query. Also disabled when `name` is empty. */
  enabled?: boolean;
}

/**
 * Fetches packages similar to the given one from Bundlephobia — useful for showing alternatives.
 *
 * @param name - Package name (e.g. `'moment'`)
 * @param options - Query options
 * @returns TanStack Query result with {@link SimilarPackages}
 */
export function useBpPackageSimilar(
  name: string,
  options: UseBpPackageSimilarOptions = {},
): UseQueryResult<SimilarPackages, Error> {
  const { enabled = true } = options;
  const client = useMemo(() => new BundlephobiaClient(), []);

  return useQuery<SimilarPackages, Error>({
    queryKey: bpQueryKeys.packageSimilar(name),
    queryFn: ({ signal }) => client.package(name).similar(signal),
    enabled: enabled && name.length > 0,
  });
}
