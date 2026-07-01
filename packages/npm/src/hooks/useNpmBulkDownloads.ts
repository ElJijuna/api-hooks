import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { NpmBulkDownloads, NpmDownloadPeriod } from 'npmjs-api-client';
import { npmQueryKeys } from '../keys/npmQueryKeys.js';
import { useNpmClient } from '../NpmClientContext.js';
import type { QueryOverrides } from '../types.js';

export interface UseNpmBulkDownloadsOptions {
  /** Named period or date range (default: `'last-month'`). */
  period?: NpmDownloadPeriod;
  /** Disable the query. Also disabled when `packages` is empty. */
  enabled?: boolean;
  queryOptions?: QueryOverrides<NpmBulkDownloads>;
}

/**
 * Fetches the total download count for multiple packages in a single request (max 128).
 *
 * @param packages - Array of package names (e.g. `['react', 'vue', 'angular']`)
 * @param options - Query options including `period`
 * @returns TanStack Query result with {@link NpmBulkDownloads} — a map of package name to download point
 */
export function useNpmBulkDownloads(
  packages: string[],
  options: UseNpmBulkDownloadsOptions = {},
): UseQueryResult<NpmBulkDownloads, Error> {
  const { period = 'last-month', enabled = true, queryOptions } = options;
  const client = useNpmClient();

  return useQuery<NpmBulkDownloads, Error>({
    queryKey: npmQueryKeys.bulkDownloads(packages, period),
    queryFn: ({ signal }) => client.bulkDownloads(packages, period, signal),
    ...queryOptions,
    enabled: enabled && packages.length > 0,
  });
}
