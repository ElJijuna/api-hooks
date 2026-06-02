import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { JsdelivrGroupBy, JsdelivrPeriod, JsdelivrStats } from 'npmjs-api-client';
import { npmQueryKeys } from '../keys/npmQueryKeys.js';
import { useNpmClient } from '../NpmClientContext.js';

export interface UseNpmPackageVersionCdnStatsOptions {
  /** Group results by `'file'` (default) or `'date'`. */
  groupBy?: JsdelivrGroupBy;
  /** Time window: `'day'`, `'week'`, `'month'` (default), or `'year'`. */
  period?: JsdelivrPeriod;
  /** Disable the query. Also disabled when `name` or `version` is empty. */
  enabled?: boolean;
}

/**
 * Fetches CDN usage statistics for a specific version of a package from jsDelivr.
 *
 * At version level, results are grouped by file by default, showing which individual
 * files are most requested from browsers in production.
 *
 * @param name - Package name (e.g. `'react'`)
 * @param version - Version string (e.g. `'18.2.0'`)
 * @param options - Query options including `groupBy` and `period`
 * @returns TanStack Query result with {@link JsdelivrStats}
 */
export function useNpmPackageVersionCdnStats(
  name: string,
  version: string,
  options: UseNpmPackageVersionCdnStatsOptions = {},
): UseQueryResult<JsdelivrStats, Error> {
  const { groupBy = 'file', period = 'month', enabled = true } = options;
  const client = useNpmClient();

  return useQuery<JsdelivrStats, Error>({
    queryKey: npmQueryKeys.packageVersionCdnStats(name, version, groupBy, period),
    queryFn: ({ signal }) =>
      client.package(name).version(version).cdnStats(groupBy, period, signal),
    enabled: enabled && name.length > 0 && version.length > 0,
  });
}
