import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { SimilarPackages } from 'bundlephobia-api-client';
import { useBpClient } from '../BpClientContext.js';
import { bpQueryKeys } from '../keys/bpQueryKeys.js';
import type { QueryOverrides } from '../types.js';

export interface UseBpPackageSimilarOptions {
  /** Disable the query. Also disabled when `name` is empty. */
  enabled?: boolean;
  queryOptions?: QueryOverrides<SimilarPackages>;
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
  const { enabled = true, queryOptions } = options;
  const client = useBpClient();

  return useQuery<SimilarPackages, Error>({
    queryKey: bpQueryKeys.packageSimilar(name),
    queryFn: ({ signal }) => client.package(name).similar(signal),
    ...queryOptions,
    enabled: enabled && name.length > 0,
  });
}
