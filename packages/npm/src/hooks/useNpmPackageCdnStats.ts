
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { type JsdelivrStats, type JsdelivrGroupBy, type JsdelivrPeriod } from 'npmjs-api-client';
import { npmQueryKeys } from '../keys/npmQueryKeys.js';
import { useNpmClient } from '../NpmClientContext.js';

export interface UseNpmPackageCdnStatsOptions {
  /** Group results by `'version'` (default) or `'date'`. */
  groupBy?: JsdelivrGroupBy;
  /** Time window: `'day'`, `'week'`, `'month'` (default), or `'year'`. */
  period?: JsdelivrPeriod;
  /** Disable the query. Also disabled when `name` is empty. */
  enabled?: boolean;
}

/**
 * Fetches CDN usage statistics for a package from jsDelivr.
 *
 * CDN stats reflect real browser/frontend usage, complementing npm install counts.
 *
 * @param name - Package name (e.g. `'react'`)
 * @param options - Query options including `groupBy` and `period`
 * @returns TanStack Query result with {@link JsdelivrStats}
 */
export function useNpmPackageCdnStats(
  name: string,
  options: UseNpmPackageCdnStatsOptions = {}
): UseQueryResult<JsdelivrStats, Error> {
  const { groupBy = 'version', period = 'month', enabled = true } = options;
  const client = useNpmClient();

  return useQuery<JsdelivrStats, Error>({
    queryKey: npmQueryKeys.packageCdnStats(name, groupBy, period),
    queryFn: ({ signal }) => client.package(name).cdnStats(groupBy, period, signal),
    enabled: enabled && name.length > 0,
  });
}
