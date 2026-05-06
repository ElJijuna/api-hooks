
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { type NpmVersionDownloadPeriod, type NpmVersionDownloadPoint } from 'npmjs-api-client';
import { npmQueryKeys } from '../keys/npmQueryKeys.js';
import { useNpmClient } from '../NpmClientContext.js';

export interface UseNpmPackageVersionDownloadsOptions {
  /** Period to fetch downloads for. npm only supports `'last-week'`. */
  period?: NpmVersionDownloadPeriod;
  /** Disable the query. Also disabled when `name` or `version` is empty. */
  enabled?: boolean;
}

/**
 * Fetches the download count for a specific version of a package over the previous 7 days.
 *
 * npm only exposes version-level download counts for `'last-week'`.
 *
 * @param name - Package name (e.g. `'react'`)
 * @param version - Version string (e.g. `'18.2.0'`)
 * @param options - Query options
 * @returns TanStack Query result with {@link NpmVersionDownloadPoint}
 */
export function useNpmPackageVersionDownloads(
  name: string,
  version: string,
  options: UseNpmPackageVersionDownloadsOptions = {}
): UseQueryResult<NpmVersionDownloadPoint, Error> {
  const { period = 'last-week', enabled = true } = options;
  const client = useNpmClient();

  return useQuery<NpmVersionDownloadPoint, Error>({
    queryKey: npmQueryKeys.packageVersionDownloads(name, version, period),
    queryFn: ({ signal }) => client.package(name).version(version).downloads(period, signal),
    enabled: enabled && name.length > 0 && version.length > 0,
  });
}
