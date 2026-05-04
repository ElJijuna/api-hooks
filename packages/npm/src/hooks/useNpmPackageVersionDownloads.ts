
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { type NpmVersionDownloadPeriod, type NpmVersionDownloadPoint } from 'npmjs-api-client';
import { npmQueryKeys } from '../keys/npmQueryKeys.js';
import { useNpmClient } from '../NpmClientContext.js';

export interface UseNpmPackageVersionDownloadsOptions {
  period?: NpmVersionDownloadPeriod;
  enabled?: boolean;
}

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
