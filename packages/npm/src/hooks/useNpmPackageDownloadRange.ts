import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { NpmDownloadPeriod, NpmDownloadRange } from 'npmjs-api-client';
import { npmQueryKeys } from '../keys/npmQueryKeys.js';
import { useNpmClient } from '../NpmClientContext.js';

export interface UseNpmPackageDownloadRangeOptions {
  /** Named period or date range (default: `'last-month'`). */
  period?: NpmDownloadPeriod;
  /** Disable the query. Also disabled when `name` is empty. */
  enabled?: boolean;
}

/**
 * Fetches the per-day download breakdown — ideal for rendering charts.
 *
 * @param name - Package name (e.g. `'react'`)
 * @param options - Query options including `period`
 * @returns TanStack Query result with {@link NpmDownloadRange}
 */
export function useNpmPackageDownloadRange(
  name: string,
  options: UseNpmPackageDownloadRangeOptions = {},
): UseQueryResult<NpmDownloadRange, Error> {
  const { period = 'last-month', enabled = true } = options;
  const client = useNpmClient();

  return useQuery<NpmDownloadRange, Error>({
    queryKey: npmQueryKeys.packageDownloadRange(name, period),
    queryFn: ({ signal }) => client.package(name).downloadRange(period, signal),
    enabled: enabled && name.length > 0,
  });
}
