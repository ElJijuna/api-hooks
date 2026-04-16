import { useMemo } from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { NpmClient, type NpmDownloadPoint, type NpmDownloadPeriod } from 'npmjs-api-client';
import { npmQueryKeys } from '../keys/npmQueryKeys.js';

export interface UseNpmPackageDownloadsOptions {
  period?: NpmDownloadPeriod;
  enabled?: boolean;
}

export function useNpmPackageDownloads(
  name: string,
  options: UseNpmPackageDownloadsOptions = {}
): UseQueryResult<NpmDownloadPoint, Error> {
  const { period = 'last-month', enabled = true } = options;
  const client = useMemo(() => new NpmClient(), []);

  return useQuery<NpmDownloadPoint, Error>({
    queryKey: npmQueryKeys.packageDownloads(name, period),
    queryFn: ({ signal }) => client.package(name).downloads(period, signal),
    enabled: enabled && name.length > 0,
  });
}
