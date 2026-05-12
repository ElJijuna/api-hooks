
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { type NpmDownloadPoint, type NpmDownloadPeriod } from 'npmjs-api-client';
import { npmQueryKeys } from '../keys/npmQueryKeys.js';
import { useNpmClient } from '../NpmClientContext.js';

export interface UseNpmPackageDownloadsOptions {
  /** Named period or date range (default: `'last-month'`). */
  period?: NpmDownloadPeriod;
  /** Disable the query. Also disabled when `name` is empty. */
  enabled?: boolean;
}

/**
 * Fetches the total download count for a package over a period.
 *
 * @param name - Package name (e.g. `'react'`)
 * @param options - Query options including `period`
 * @returns TanStack Query result with {@link NpmDownloadPoint}
 */
export function useNpmPackageDownloads(
  name: string,
  options: UseNpmPackageDownloadsOptions = {}
): UseQueryResult<NpmDownloadPoint, Error> {
  const { period = 'last-month', enabled = true } = options;
  const client = useNpmClient();

  return useQuery<NpmDownloadPoint, Error>({
    queryKey: npmQueryKeys.packageDownloads(name, period),
    queryFn: ({ signal }) => client.package(name).downloads(period, signal),
    enabled: enabled && name.length > 0,
  });
}
